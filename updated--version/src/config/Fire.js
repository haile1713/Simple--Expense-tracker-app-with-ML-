import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCQOH-6VpubSS1IAyusSWDsRDtlRb9jpgo",
	authDomain: "expense-tracker-aed26.firebaseapp.com",
	projectId: "expense-tracker-aed26",
	storageBucket: "expense-tracker-aed26.appspot.com",
	messagingSenderId: "835295357125",
	appId: "1:835295357125:web:d261d7221d0ca8c292a8ac",
	measurementId: "G-YSTJMDWX7X",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, updateProfile };
