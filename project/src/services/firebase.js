import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZYGVd1e3_Pf4be2EmW8zalW5WhXXJG4c",
    authDomain: "eventos-app-fab17.firebaseapp.com",
    projectId: "eventos-app-fab17",
    storageBucket: "eventos-app-fab17.appspot.com",
    messagingSenderId: "828525740531",
    appId: "1:828525740531:web:2e99e07c695e21f4c39286"
  };

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider, app };