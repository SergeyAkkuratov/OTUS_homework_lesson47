import React from "react";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <>
            <h3>About:</h3>
            <p data-testid="about-message">
                Outlays - Web React application, providing functionality to store money incomes and outlays to control youe budget.
            </p>
            <h4>Pages:</h4>
            <p>
                <Link to="/">Main</Link> - you go to this page after sign in. You could add outlays and incomes by form fields and see outlays for the
                last week.
            </p>
            <p>
                <Link to="/categories">Categories</Link> - by this page you could observe, add and delete categories of you outlays.
            </p>
            <p>
                <Link to="/statistic">Statistic</Link> - provides functionality to see all outlays by last week, last month and between nay two dates.
                You could see outlays in table view or in Pie chart.
            </p>
            <p>
                <Link to="/about">About</Link> - you are here :)
            </p>
            <p>
                <Link to="/signin">SignIn</Link> - page to Sign in or Sign Up.
            </p>
            <p>
                <span className="badge bg-success">&lt;Your email&gt;</span> - page with information about you user and button to Sign out.
            </p>
        </>
    );
}
