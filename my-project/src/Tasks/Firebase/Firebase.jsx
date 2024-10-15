import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAy5z7Em_0X6e9kP-UuJC1tEDjN37Ud0nE",
  authDomain: "otp-verifier-7f307.firebaseapp.com",
  projectId: "otp-verifier-7f307",
  storageBucket: "otp-verifier-7f307.appspot.com",
  messagingSenderId: "881512155852",
  appId: "1:881512155852:web:cd65b758ec87d6cfe79069",
  measurementId: "G-ZGVE5GBDWV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);