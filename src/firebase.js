// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyB372GAx-yOacCESLD7GLbSHBu-gvE-J1M",
    authDomain: "spint-planning-poker.firebaseapp.com",
    projectId: "spint-planning-poker",
    storageBucket: "spint-planning-poker.appspot.com",
    messagingSenderId: "615153958621",
    appId: "1:615153958621:web:682aaae05e13b730b6e534",
    measurementId: "G-X9PBEYKSJF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db = getFirestore(app);