import { useEffect, useState } from "react"

import "./before-install-prompt-button.css";

export const BeforeInstallPromptButton = () => {
  const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false);

  useEffect(() => {
    if(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      // @ts-ignore
      navigator?.standalone === true
    ) {
      // PWA is already installed, or browser does not support installation
    } else {
    // PWA installation is supported, handle the event
      window.addEventListener('beforeinstallprompt', (e: any) => {
        // Prevent the default behavior of the event
        e.preventDefault();
        
        setIsPromptVisible(true);
        
        // Handle the installation when the button is clicked
        const installButton = document.getElementById('install-button')!;
        installButton.addEventListener('click', () => {
        
          // Prompt the user to install the app
          e.prompt();
          
          setIsPromptVisible(false);
        });
      });
    }
  }, [])

  return (
    isPromptVisible
   ? (
    <div className="before-install-prompt-button">
        <div className="install-button-background">
          <button className="install-button" id="install-button">
            Add Sage to your home screen
          </button>

          <div className="close-button-container">
            <button className="close-button" onClick={() => setIsPromptVisible(false)} />
          </div>
        </div>
      </div>
    ) : null 
  )
}