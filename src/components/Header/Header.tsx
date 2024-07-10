import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, userSlice } from "../../store/Store";

export default function Header() {
    const isAuth = useAppSelector(userSlice.selectors.isAuth);
    const userEmail = useAppSelector((state) => state.User.email);
    return (
        <>
            <nav className="navbar navbar-expand-sm bg-dark" data-bs-theme="dark" data-testid="header">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        Outlays
                    </a>
                    <button
                        className="navbar-toggler collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar"
                        aria-controls="navbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav me-auto" data-testid="linkList">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Main
                                </Link>
                            </li>
                            {isAuth ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/categories" data-testid="linkCategories">
                                            Categories
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/statistic" data-testid="linkStatistic">
                                            Statistic
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about" data-testid="linkAbout">
                                            About
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user" data-testid="linkUser">
                                            <span className="badge bg-success">{userEmail}</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about" data-testid="linkAbout">
                                            About
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/signin" data-testid="linkSignin">
                                            SignIn
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
