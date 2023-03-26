import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
    fromCognitoIdentityPool,
} from "@aws-sdk/credential-provider-cognito-identity";
import { Polly } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";

// Create the Polly service client, assigning your credentials
const client = new Polly({
  region: "us-west-2",
  credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: "us-west-2" }),
      identityPoolId: "us-west-2:26ca6b8f-6e57-4110-b644-7ead80ab4c89" // IDENTITY_POOL_ID
  }),
});

// Set the parameters
const speechParams = {
  OutputFormat: "mp3", // For example, 'mp3'
  // SampleRate: "16000", // For example, '16000
  Text: "", // The 'speakText' function supplies this value
  TextType: "ssml", // For example, "text"
  VoiceId: "Aria", // For example, "Matthew"
  Engine: "neural",
};

export const speakText = async (text: string) => {
  // Update the Text parameter with the text entered by the user
  speechParams.Text = `<speak><prosody rate=\"fast\">${text}</prosody></speak>`;
  try{
      let url = await getSynthesizeSpeechUrl({
          client, params: speechParams
      });

      // Load the URL of the voice recording into the browser
      // @ts-ignore
      document.getElementById('audioSource').src = url;
      // @ts-ignore
      document.getElementById('audioPlayback').load();
      // @ts-ignore
      document.getElementById('audioPlayback').play();
    } catch (err) {
      console.log("Error", err);
      // @ts-ignore
      document.getElementById('result').innerHTML = err;
  }
};