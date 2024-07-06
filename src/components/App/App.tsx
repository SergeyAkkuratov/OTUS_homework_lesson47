import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "bootswatch/dist/darkly/bootstrap.min.css";
import { User } from "../User/User";
import Main from "../Main/Main";
import { useAppSelector, userSlice } from "../../store/Store";

const About = React.lazy(() => import("../About/About"));
const SignIn = React.lazy(() => import("../SignIn/SignIn"));
const Header = React.lazy(() => import("../Header/Header"));
const Categories = React.lazy(() => import("../Categories/Categories"));
const Statistic = React.lazy(() => import("../Statistic/Statistic"));

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
                        <>
                            <Route path="categories" element={<Categories />} />
                            <Route path="statistic" element={<Statistic />} />
                            <Route path="user" element={<User />} />
                        </>
                    ) : (
                        <>
                            <Route path="signin" element={<SignIn />} />
                        </>
                    )}
                </Routes>
            </Suspense>
        </>
    )
}