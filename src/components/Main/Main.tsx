import React from "react";
import { outlaysSlice, useAppSelector, userSlice } from "../../store/Store";
import { Link } from "react-router-dom";
import OutlayTable from "../OutlayTable/OutlayTable";
import AddOutlay from "./AddOutlay/AddOutlay";

export default function () {
    const isAuth = useAppSelector(userSlice.selectors.isAuth);

    if (!isAuth) {
        return (
            <>
                <div className="alert alert-dismissible alert-warning">
                    <h4 className="alert-heading">Warning!</h4>
                    <p className="mb-0">While you aren't sign in, you couldn't use this application!</p>
                    <Link className="nav-link" to='/singin'>SingIn</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <AddOutlay />
            <OutlayTable filter="lastWeek"/>
        </>
    );
}