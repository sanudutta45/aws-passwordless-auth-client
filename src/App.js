import { useState } from "react"
import { confirmSignIn, signIn, signUp } from "aws-amplify/auth"

function App() {
  const [email, setEmail] = useState("")
  const [authCode, setAuthCode] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState()

  function getRandomString(bytes) {
    const randomValues = new Uint8Array(bytes)
    window.crypto.getRandomValues(randomValues)
    return Array.from(randomValues).map(intToHex).join("")
  }

  function intToHex(nr) {
    return nr.toString(16).padStart(2, "0")
  }

  const handleSigninSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { nextStep: nextStep2 } = await signIn({
        username: email,
        options: {
          authFlowType: "CUSTOM_WITHOUT_SRP",
        },
      })
      if (nextStep2.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
        setEmailSent(true)
      }
    } catch (e) {
      console.log("ERROR IN LOGIN: ", e)
      const { nextStep } = await signUp({
        username: email,
        password: getRandomString(30),
        options: {
          authFlowType: "CUSTOM_WITHOUT_SRP",
          userAttributes: {
            name: "",
          },
          autoSignIn: true,
        },
      })
      console.log("NEXT STEP: ", nextStep)
      if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        const { nextStep: nextStep2 } = await signIn({
          username: email,
          options: {
            authFlowType: "CUSTOM_WITHOUT_SRP",
          },
        })
        if (nextStep2.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
          setEmailSent(true)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleValidateOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await confirmSignIn({
        challengeResponse: authCode,
      })
      console.log("CONFIRM SIGNIN OUTPUT ")
      setIsAuth(true)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isAuth ? (
        <div>
          <form onSubmit={handleSigninSignup}>
            <div style={{ display: "flex", gap: "150px" }}>
              <label htmlFor='login_input'>Email: </label>
              <input
                type='email'
                placeholder='enter your email id'
                onChange={(e) => setEmail(e.target.value)}
                width='250px'
                height='80px'
                id='login_input'
              />
            </div>
            <button
              style={{ width: "200px", height: "80px" }}
              type='submit'
              disabled={loading}
            >
              Login
            </button>
          </form>
          {emailSent && (
            <form onSubmit={handleValidateOtp}>
              <div style={{ display: "flex", gap: "150px" }}>
                <label htmlFor='opt_input'>OTP: </label>
                <input
                  type='number'
                  placeholder='Enter code'
                  onChange={(e) => setAuthCode(e.target.value)}
                  width='250px'
                  height='80px'
                  id='opt_input'
                />
              </div>
              <button
                style={{ width: "200px", height: "80px" }}
                type='submit'
                disabled={loading}
              >
                Verify Otp
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>
          <p>Authenticated user</p>
        </div>
      )}
    </div>
  )
}

export default App
