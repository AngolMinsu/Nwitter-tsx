// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcYRolWnf6MBxirb7M3ZoKCymNK0GG4fA",
  authDomain: "nwitter-re-43cce.firebaseapp.com",
  projectId: "nwitter-re-43cce",
  storageBucket: "nwitter-re-43cce.appspot.com",
  messagingSenderId: "157922025202",
  appId: "1:157922025202:web:81ef28a62173879678ba6b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 우리의 앱에 대해서 인증을 사용하고 싶음
export const auth = getAuth(app);
