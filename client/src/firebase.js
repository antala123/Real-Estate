// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMks5IOWoSBVx04OKN4Hro53giAYpWnNc",
    authDomain: "estate-mern-524a2.firebaseapp.com",
    projectId: "estate-mern-524a2",
    storageBucket: "estate-mern-524a2.appspot.com",
    messagingSenderId: "840057359538",
    appId: "1:840057359538:web:69b758ad9f7a75248acdab",
    measurementId: "G-MJF39PQYFW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
