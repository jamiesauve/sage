import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { askChatGpt, condenseConversationHistory, getIsConversationHistoryTooLong } from './integrations/chat-gpt';
import { DecorativeImageSvg } from './components/svg/decorative-image-svg';
import { InputArea } from './components/input-area';
import { MessageFeed } from './components/message-feed';
import { Menu } from './components/menu';

import { 
  messageGetters, 
  messageSetters,
  messageInitialState, 
  messagesReducer,
  SenderEntity,
 } from './state/messagesReducer';

import './app.css'
import { useWindowSize } from './utils/useWindowSize';

export const App = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [previousIsFetching, setPreviousIsFetching] = useState<boolean>(false);

  const [ state, dispatch ] = useReducer(messagesReducer, messageInitialState);

  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    const appElement = document.getElementsByClassName("app")[0];
    
    // @ts-ignore
    appElement.style.height = window.innerHeight;
  }, [])

  useEffect(() => {
    const appElement = document.getElementsByClassName("app")[0];

    // @ts-ignore
    appElement.style.height = `${windowHeight}px`;
  }, [
    windowHeight
  ])

  const handleSubmit = useCallback(async (content: string) => {
    if (content.toLowerCase().trim() === "clear") {
          state.messages.forEach(message => {
            messageSetters.updateMessageById(dispatch, message.id, { appearsToUser: true })
          })
        } else if (content.trim()) {
          const unsummarizedMessages = messageGetters.unsummarizedMessages(state);

          messageSetters.addMessage(dispatch, {
            appearsToUser: true,
            from: SenderEntity.User, 
            isSummarized: false,
            text: content, 
          });
          
          setIsFetching(true);

          await askChatGpt(dispatch, unsummarizedMessages, content);

          setIsFetching(false);
        }
  }, [
    askChatGpt,
    messageSetters,
    state
  ])

  useEffect(() => {
    (async () => {
    if (previousIsFetching && !isFetching) {
      const unsummarizedMessages = messageGetters.unsummarizedMessages(state);
      const isConversationHistoryTooLong = getIsConversationHistoryTooLong(unsummarizedMessages);

      if (isConversationHistoryTooLong) {
        condenseConversationHistory(dispatch, unsummarizedMessages);
      }
    }

    setPreviousIsFetching(isFetching)
  })();
  }, [
    isFetching,
    previousIsFetching,
  ])

  const visibleMessages = useMemo(() => messageGetters.messagesThatAppearToTheUser(state), [messageGetters, state]);
  const pastQueriesInReverseOrder = useMemo(() => {
    const messagesFromTheUser = messageGetters.messagesFromUser(state);

    return messagesFromTheUser.map(message => message.text).reverse()
  }, [
    messageGetters,
    state
  ]
  );
  
  return (
    <div className="app">
      <div className="main">
        <Menu />
        
        <DecorativeImageSvg />

        <MessageFeed messages={visibleMessages} />

        <InputArea
          handleSubmit={handleSubmit}
          isFetching={isFetching}
          pastQueries={pastQueriesInReverseOrder}
        />
      </div>
    </div>
  )
}