// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCkLbQKW7n4rQRCvtGEuTCkteYJKSApB3E',
	authDomain: 'house-marketplace-app-1a31f.firebaseapp.com',
	projectId: 'house-marketplace-app-1a31f',
	storageBucket: 'house-marketplace-app-1a31f.appspot.com',
	messagingSenderId: '405257227131',
	appId: '1:405257227131:web:7e738f908c720497954bde',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
