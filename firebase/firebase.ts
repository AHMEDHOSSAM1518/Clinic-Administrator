// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbjBqnVXvU7p3R41igMF62PDemqcmpLcE",
  authDomain: "mousaclinicsystem.firebaseapp.com",
  projectId: "mousaclinicsystem",
  storageBucket: "mousaclinicsystem.firebasestorage.app",
  messagingSenderId: "138618825583",
  appId: "1:138618825583:web:bcf52ea40b5b99a669169a",
  measurementId: "G-BL312K145S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);