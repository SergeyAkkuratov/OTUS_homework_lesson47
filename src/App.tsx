import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import "bootswatch/dist/darkly/bootstrap.min.css";
import {
    categoriesDbReference,
    dbConnect,
    outlayDbReference,
    setCategories,
    setOutlays,
    store,
    useAppDispatch,
    useAppSelector,
    userSlice,
} from "./store/Store";
import { AuthStatus, UserState } from "./store/StoreTypes";

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

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getDatabase(firebaseApp);

export default function App() {
    const isAuth = useAppSelector(userSlice.selectors.isAuth);
    const dispatch = useAppDispatch();

    onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
            if (!isAuth) {
                const newUserState: UserState = {
                    status: AuthStatus.DONE,
                    email: user.email,
                    uid: user.uid,
                };
                dispatch(userSlice.actions.successAuth(newUserState));
                await dbConnect(outlayDbReference(store.getState())!, setOutlays);
                await dbConnect(categoriesDbReference(store.getState())!, setCategories);
            }
        }
    });

    return (
        <>
            <Suspense>
                <Header />
                <Routes>
                    <Route path={`${PREFIX}/`} element={<Main />} />
                    <Route path={`${PREFIX}/about`} element={<About />} />
                    {isAuth ? (
                        <>
                            <Route path={`${PREFIX}/categories`} element={<Categories />} />
                            <Route path={`${PREFIX}/statistic`} element={<Statistic />} />
                            <Route path={`${PREFIX}/user`} element={<User />} />
                        </>
                    ) : (
                        <>
                            <Route path={`${PREFIX}/signin`} element={<SignIn />} />
                        </>
                    )}
                </Routes>
            </Suspense>
        </>
    );
}
