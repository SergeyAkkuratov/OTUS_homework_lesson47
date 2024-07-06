import { Category } from "../store/Store.types";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeBQawIwktWT0nwvRuizl8Fq-uqdxUS9M",
    authDomain: "outlays-fa282.firebaseapp.com",
    databaseURL: "https://outlays-fa282-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "outlays-fa282",
    storageBucket: "outlays-fa282.appspot.com",
    messagingSenderId: "141496007785",
    appId: "1:141496007785:web:2ce0d5a5af8b9cf1e6b6f8"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const firebaseAuth = getAuth();
export const firebaseDb = getDatabase();

const dbRef = ref(firebaseDb, 'posts');

// Mocks
const testCategories: Category[] = [
    {
        id: "1",
        name: "Test1",
        parent: null
    },
    {
        id: "2",
        name: "Test2",
        parent: null
    },
    {
        id: "3",
        name: "Test3",
        parent: "2"
    },
    {
        id: "4",
        name: "Test4",
        parent: "3"
    },
    {
        id: "5",
        name: "Test5",
        parent: null
    },
    {
        id: "6",
        name: "Test6",
        parent: "5"
    },
];

export function getCategories(): Category[] {
    return testCategories;
}