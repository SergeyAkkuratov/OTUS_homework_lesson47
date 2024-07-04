import React, { useState } from "react";
import { useAppDispatch } from "../App/hooks";
import { userSlice } from "../../store/Store";
import { signUp } from "../../firebase/firebaseAPI";
import { AuthStatus } from "../../store/Store.types";
import { useNavigate } from "react-router-dom";

export default function SingUp() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: "",
        email: "",
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
            const authResponse = await signUp(formData.login, formData.email, formData.password);
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
                        <label htmlFor="loginInput" className="form-label mt-1">Login</label>
                        <input type="text" className="form-control" id="loginInput" aria-describedby="loginHelp" placeholder="Enter login" />
                    </div>
                    <div>
                        <label htmlFor="emailInput" className="form-label mt-1">Email</label>
                        <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <div>
                        <label htmlFor="exampleInputPassword1" className="form-label mt-1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off" />
                    </div>
                    <button type="button" className="btn btn-secondary me-sm-2 mt-2" onClick={() => {navigate("/signin")}}>Sign in</button>
                    <button type="submit" className="btn btn-primary mt-2">Sign up</button>
                </fieldset>
            </form>
        </>
    )
}