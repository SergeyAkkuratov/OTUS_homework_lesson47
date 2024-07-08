import React from "react";
import { useNavigate } from "react-router-dom";
import { outlaysSlice, useAppDispatch, useAppSelector, userSlice } from "../store/Store";
import { signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseAuth } from "../App";

export function User() {
    const userState = useAppSelector((state) => state.User);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function signOutApi() {
        try {
            await signOut(firebaseAuth);
            dispatch(userSlice.actions.signOut());
            navigate("/");
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error(error.message);
            }
        }
    }

    return (
        <>
            <legend>Sign in user:</legend>
            <div className="row">
                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                    <input type="text" readOnly={true} className="form-control-plaintext" id="staticEmail" value={userState.email!} />
                </div>
            </div>
            <button type="button" className="btn btn-danger mt-4" onClick={signOutApi}>Sign out</button>
        </>
    );
}