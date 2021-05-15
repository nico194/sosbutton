import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
//import "firebase/database";
import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBZ4QKcXVXPQUTSi5YWpafm-wbeIrJjOXQ",
    authDomain: "sos-button-308021.firebaseapp.com",
    projectId: "sos-button-308021",
    storageBucket: "sos-button-308021.appspot.com",
    messagingSenderId: "611420789677",
    appId: "1:611420789677:web:eeccd2c0da569003a05f24"
}

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const getNewId = () => {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let autoId = ''

    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(
            Math.floor(Math.random() * CHARS.length)
        )
    }
    return autoId
}
