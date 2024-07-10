import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { onUserConnect, useAppSelector,  userSlice } from "./store/Store";
import "bootswatch/dist/darkly/bootstrap.min.css";

const Main = React.lazy(() => import("./pages/Main"));
const About = React.lazy(() => import("./pages/About"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const Header = React.lazy(() => import("./components/Header/Header"));
const Categories = React.lazy(() => import("./pages/Categories"));
const Statistic = React.lazy(() => import("./pages/Statistic"));
const User = React.lazy(() => import("./pages/User"));

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeBQawIwktWT0nwvRuizl8Fq-uqdxUS9M",
    authDomain: "outlays-fa282.firebaseapp.com",
    databaseURL: "https://outlays-fa282-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "outlays-fa282",
    storageBucket: "outlays-fa282.appspot.com",
    messagingSenderId: "141496007785",
    appId: "1:141496007785:web:2ce0d5a5af8b9cf1e6b6f8",
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
onAuthStateChanged(firebaseAuth, (user) => onUserConnect(user));
export const firebaseDb = getDatabase(firebaseApp);

export default function App() {
    const isAuth = useAppSelector(userSlice.selectors.isAuth);

    return (
        <>
            <Suspense>
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/about" element={<About />} />
                    {isAuth ? (
                        <>
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/statistic" element={<Statistic />} />
                            <Route path="/user" element={<User />} />
                        </>
                    ) : (
                        <>
                            <Route path="/signin" element={<SignIn />} />
                        </>
                    )}
                </Routes>
            </Suspense>
        </>
    );
}
