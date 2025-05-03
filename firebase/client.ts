import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmGn5aTruthF_OWTnTRDMoyN05UTrSPpo",
  authDomain: "intervue-ai-ef7fd.firebaseapp.com",
  projectId: "intervue-ai-ef7fd",
  storageBucket: "intervue-ai-ef7fd.firebasestorage.app",
  messagingSenderId: "638236177361",
  appId: "1:638236177361:web:f6df565f3107cc97bf26f0",
  measurementId: "G-MCHWD400G1"
}


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);