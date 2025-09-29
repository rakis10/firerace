import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Move firebaseConfig outside the component so it's not re-created on every render
const firebaseConfig = {
  apiKey: "AIzaSyBNzB2oMy_45H_xcTSKjhaq-6JxJauuDgA",
  authDomain: "sklad3-33676.firebaseapp.com",
  projectId: "sklad3-33676",
  storageBucket: "sklad3-33676.appspot.com", // Fixed typo: should be .appspot.com
  messagingSenderId: "764039659582",
  appId: "1:764039659582:web:2439da1b1f8940da83d16f",
  // Optionally, add custom token here if needed
  __initial_auth_token: "YOUR_CUSTOM_TOKEN",
};

const App = () => {
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let app;
    try {
      app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const userAuth = getAuth(app);

      setDb(firestore);

      // Listen for auth state changes to set the userId
      const unsubscribe = onAuthStateChanged(userAuth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (e) {
      setError("Failed to initialize Firebase. Configuration error.");
      setIsAuthReady(true);
    }
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-red-600 p-4 bg-red-100 rounded-xl border border-red-300">
          <p className="font-semibold">Initialization Error:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }

    if (!isAuthReady) {
      return (
        <div className="flex items-center space-x-2 text-indigo-600">
          {/* <Loader className="animate-spin h-5 w-5" /> */}
          <p>Connecting to Firebase...</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl mb-4">
          <h2 className="text-xl font-semibold text-indigo-700">App Status</h2>
          <button className="btn">Login</button>
        </div>

        <p className="mb-2 text-gray-700">
          Database:{" "}
          <span
            className={`font-medium ${db ? "text-green-600" : "text-red-600"}`}
          >
            {db ? "Connected" : "Disconnected"}
          </span>
        </p>
        <p className="mb-4 text-gray-700">
          Authentication:{" "}
          <span
            className={`font-medium ${
              userId ? "text-green-600" : "text-red-600"
            }`}
          >
            {userId ? "Authenticated" : "Failed"}
          </span>
        </p>

        <div className="p-3 bg-white border border-gray-200 rounded-xl break-words">
          <p className="text-sm font-semibold text-gray-500 mb-1">
            Current User ID (Mandatory for multi-user apps):
          </p>
          <p className="font-mono text-base text-gray-800">{userId || "N/A"}</p>
        </div>

        <h3 className="mt-8 text-2xl font-bold text-gray-800">
          Your React Content Goes Here!
        </h3>
        <p className="text-gray-600 mt-2">
          Start building your application using the `db` and `userId` state
          variables.
        </p>
      </>
    );
  };
  const signInWithGoogle = async () => {
    try {
      // Use signInWithPopup to open the Google sign-in window
      const auth = getAuth();
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);

      // The user info is available in result.user
      const user = result.user;
      console.log("Successfully signed in:", user.displayName);
      setUserId(user.uid);
      setError(null);
      setIsAuthReady(true);
      // You can now redirect the user or update your UI state
    } catch (error) {
      // Handle Errors here
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-start justify-center">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 mb-6 border-b pb-3">
          React + Firebase Starter
        </h1>
        {renderContent()}
        {!isAuthReady && (
          <button onClick={signInWithGoogle}>Sign In with Google</button>
        )}
      </div>
    </div>
  );
};

export default App;
