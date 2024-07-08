import React from "react";
import { outlaysSlice, useAppSelector, userSlice } from "../store/Store";
import { Link } from "react-router-dom";
import OutlayTable from "../components/OutlayTable/OutlayTable";
import AddOutlay from "../components/AddOutlay/AddOutlay";

export default function () {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const isAuth = useAppSelector(userSlice.selectors.isAuth);

    if (!isAuth) {
        return (
            <>
                <div className="alert alert-dismissible alert-warning">
                    <h4 className="alert-heading">Warning!</h4>
                    <p className="mb-0">While you aren't sign in, you couldn't use this application!</p>
                    <Link className="nav-link" to='/signin'>SingIn</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <AddOutlay />
            <OutlayTable startDate={lastWeek.toISOString()} endDate={today.toISOString()} />
        </>
    );
}