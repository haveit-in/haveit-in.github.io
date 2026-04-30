import { RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

// reCAPTCHA setup for OTP
export const setupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }
  
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible"
    },
    auth
  );
  
  return window.recaptchaVerifier;
};

// Google login test function
export const loginWithGoogle = async (loginCallback) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("User:", result.user);
    
    const user = auth.currentUser;
    
    // ✅ MUST USE THIS
    const token = await user.getIdToken();
    
    // Debug log
    console.log("ID TOKEN:", token);
    console.log("ACCESS TOKEN:", user.accessToken);
    
    // 🔥 CALL BACKEND THROUGH AUTH CONTEXT
    if (loginCallback) {
      await loginCallback(token);
    }
    
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// Partner Google login function
export const loginWithGooglePartner = async (loginCallback) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("Partner User:", result.user);
    
    const user = auth.currentUser;
    
    // ✅ MUST USE THIS
    const token = await user.getIdToken();
    
    // Debug log
    console.log("ID TOKEN:", token);
    console.log("ACCESS TOKEN:", user.accessToken);
    
    // 🔥 CALL BACKEND THROUGH AUTH CONTEXT WITH ROLE AND RETURN RESPONSE
    if (loginCallback) {
      const response = await loginCallback(token, "partner");
      return response;
    }
    
    return result.user;
  } catch (error) {
    console.error("Partner Google login error:", error);
    throw error;
  }
};
