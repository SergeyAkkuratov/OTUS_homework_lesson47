import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, userSlice } from "../../store/Store";

export function User() {
    const userState = useAppSelector((state) => state.User);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function signOut()  {
        dispatch(userSlice.actions.signOut());
        navigate("/");
    }

    return (
        <>
            <legend>Sing in user:</legend>
            <div className="row">
                <label htmlFor="staticLogin" className="col-sm-2 col-form-label">Login</label>
                <div className="col-sm-10">
                    <input type="text" readOnly={true} className="form-control-plaintext" id="staticLogin" value={userState.login!} />
                </div>
            </div>
            <div className="row">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                    <input type="text" readOnly={true} className="form-control-plaintext" id="staticEmail" value={userState.email!} />
                </div>
            </div>
            <button type="button" className="btn btn-danger mt-4" onClick={signOut}>Sign out</button>
        </>
    );
}