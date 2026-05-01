import { RecaptchaVerifier, GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { auth } from "../firebase";

// Test Firebase configuration
export const testFirebaseConfig = () => {
  const auth = getAuth();
  console.log("=== FIREBASE CONFIG TEST ===");
  console.log("Auth app:", auth.app);
  console.log("Project ID:", auth.app.options.projectId);
  console.log("App ID:", auth.app.options.appId);
  console.log("API Key:", auth.app.options.apiKey);
  console.log("Auth Domain:", auth.app.options.authDomain);
  return auth.app.options.projectId;
};

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
    
    // MUST USE THIS
    const token = await user.getIdToken();
    
    // Debug log
    console.log("ID TOKEN:", token);
    console.log("ACCESS TOKEN:", user.accessToken);
    
    // CALL BACKEND THROUGH AUTH CONTEXT WITH ROLE AND RETURN RESPONSE
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

// Admin Google login function
export const loginWithGoogleAdmin = async (loginCallback) => {
  try {
    // Test Firebase configuration first
    testFirebaseConfig();
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("Admin User:", result.user);
    
    const user = auth.currentUser;
    
    // MUST USE THIS
    const token = await user.getIdToken(true); // Force refresh token
    
    // Debug log
    console.log("=== ADMIN LOGIN DEBUG ===");
    console.log("ID TOKEN:", token);
    console.log("ID TOKEN length:", token.length);
    console.log("ID TOKEN segments:", token.split('.').length);
    console.log("ID TOKEN starts with:", token.substring(0, 50) + "...");
    console.log("ID TOKEN ends with:", token.substring(token.length - 50) + "...");
    console.log("ACCESS TOKEN:", user.accessToken);
    console.log("User email:", user.email);
    console.log("User UID:", user.uid);
    console.log("Firebase auth object:", auth);
    console.log("Current user exists:", !!auth.currentUser);
    
    // Validate token format before sending
    if (token.split('.').length !== 3) {
      console.error("Invalid Firebase ID token format - wrong number of segments");
      throw new Error("Invalid Firebase ID token format");
    }
    
    // CALL BACKEND THROUGH AUTH CONTEXT WITH ADMIN ROLE AND RETURN RESPONSE
    if (loginCallback) {
      console.log("Calling backend with token and admin role...");
      const response = await loginCallback(token, "admin");
      console.log("Backend response:", response);
      return response;
    }
    
    return result.user;
  } catch (error) {
    console.error("Admin Google login error:", error);
    throw error;
  }
};
