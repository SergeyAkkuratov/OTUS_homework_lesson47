import React from "react";
import { useAppSelector } from "../App/hooks";

export function User() {
    const userState = useAppSelector((state) => state.User);
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
        </>
    );
}