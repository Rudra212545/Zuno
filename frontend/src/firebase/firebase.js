// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtkfDRCkVPG8ZL5jUxsFWWgDtT8jE65jo",
  authDomain: "zono-6293c.firebaseapp.com",
  projectId: "zono-6293c",

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };