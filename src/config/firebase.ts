import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDcIikVa6uv6iUj3LXaXuWYPhxdd9HG13o",
  authDomain: "screenscene-9e88d.firebaseapp.com",
  projectId: "screenscene-9e88d",
  storageBucket: "screenscene-9e88d.firebasestorage.app",
  messagingSenderId: "693032692078",
  appId: "1:693032692078:web:16170df64e9842da50f97f",
  measurementId: "G-49NF73S6FC"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app