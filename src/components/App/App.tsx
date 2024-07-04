import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "bootswatch/dist/darkly/bootstrap.min.css";
import { useAppSelector } from "./hooks";
import { AuthStatus } from "../../store/Store.types";
import { User } from "../User/User";
import SingUp from "../SingUp/SingUp";
import Main from "../Main/Main";
import { userSlice } from "../../store/Store";
const About = React.lazy(() => import("../About/About"));
const SingIn = React.lazy(() => import("../SingIn/SingIn"));
const Header = React.lazy(() => import("../Header/Header"));

export default function App() {
    const isAuth = useAppSelector(userSlice.selectors.isAuth);

    return (
        <>
            <Suspense>
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="about" element={<About />} />
                    {isAuth ? (
                        <Route path="user" element={<User />} />
                    ) : (
                        <>
                            <Route path="signin" element={<SingIn />} />
                            <Route path="signup" element={<SingUp />} />
                        </>
                    )}
                </Routes>
            </Suspense>
        </>
    )
}