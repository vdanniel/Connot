import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyC5acPkMbeQULNhDuqQwulGJmsGPoDsPRQ",
    authDomain: "dndc-b.firebaseapp.com",
    databaseURL: "https://dndc-b.firebaseio.com",
    projectId: "fdndc-b",
    storageBucket: "dndc-b.appspot.com",
    messagingSenderId: "849346575213"
};
firebase.initializeApp(config);
export default firebase;