// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaaB_2CxSIvLnYh3se_cnIeWlewOC7Epg",
  authDomain: "nwitter-4490a.firebaseapp.com",
  projectId: "nwitter-4490a",
  storageBucket: "nwitter-4490a.appspot.com",
  messagingSenderId: "778432445001",
  appId: "1:778432445001:web:54096ef36e4bd1efc1dd98",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 우리의 앱에 대해서 인증을 사용하고 싶음
export const auth = getAuth(app);
