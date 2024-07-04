import React, { useState } from "react";
import { useAppDispatch } from "../App/hooks";
import { userSlice } from "../../store/Store";
import { signIn } from "../../firebase/firebaseAPI";
import { AuthStatus } from "../../store/Store.types";
import { Navigate, useNavigate } from "react-router-dom";

export default function SingIn() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: "",
        password: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(userSlice.actions.startAuth());
        try {
            const authResponse = await signIn(formData.login, formData.password);
            dispatch(userSlice.actions.successAuth({
                status: AuthStatus.DONE,
                ...authResponse
            }))
        } catch (error) {
            dispatch(userSlice.actions.failureAuth())
        }
        navigate("/");
    }

    return (
        <>
            <form onSubmit={(event) => submit(event)}>
                <fieldset>
                    <div>
                        <label htmlFor="loginInput" className="form-label mt-4">Login</label>
                        <input type="text" className="form-control" id="loginInput" aria-describedby="loginHelp" placeholder="Enter login" />
                    </div>
                    <div>
                        <label htmlFor="exampleInputPassword1" className="form-label mt-4">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off" />
                    </div>
                    <button type="submit" className="btn btn-primary">Sign in</button>
                    <button type="button" className="btn btn-secondary" onClick={() => {navigate("/signup")}}>Sign up</button>
                </fieldset>
            </form>
        </>
    )
}