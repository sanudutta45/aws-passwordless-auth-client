import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { sessionStorage } from "aws-amplify/utils"
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito"
import { Amplify } from "aws-amplify"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: 'code'
    },
  },
})

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage)

const currentConfig = Amplify.getConfig()
console.log(currentConfig)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
