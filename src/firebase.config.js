// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBb4C5O4deOdMZB9A2U2NdiyGzQkg2SYfg',
	authDomain: 'fitness-website-8c13d.firebaseapp.com',
	projectId: 'fitness-website-8c13d',
	storageBucket: 'fitness-website-8c13d.appspot.com',
	messagingSenderId: '99514163679',
	appId: '1:99514163679:web:23c7dc1e8a60ff578be46a',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
