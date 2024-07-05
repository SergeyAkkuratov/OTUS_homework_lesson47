import React, { MouseEventHandler, useState } from "react";
import { useAppDispatch, userSlice } from "../../store/Store";
import { firebaseAuth } from "../../firebase/firebaseAPI";
import { AuthStatus } from "../../store/Store.types";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function SingIn() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    async function signIn(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(userSlice.actions.startAuth());
        setFormData({
            email: "",
            password: "",
        })
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password)
            dispatch(userSlice.actions.successAuth({
                status: AuthStatus.DONE,
                email: userCredential.user.email
            }))
        } catch (error) {
            dispatch(userSlice.actions.failureAuth())
        }
        navigate("/");
    }

    async function signUp() {
        dispatch(userSlice.actions.startAuth());
        setFormData({
            email: "",
            password: "",
        })
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
            dispatch(userSlice.actions.successAuth({
                status: AuthStatus.DONE,
                email: userCredential.user.email
            }))
        } catch (error) {
            dispatch(userSlice.actions.failureAuth())
        }
        navigate("/");
    }

    return (
        <>
            <form onSubmit={(event) => signIn(event)}>
                <fieldset>
                    <div>
                        <label htmlFor="email" className="form-label mt-1">Login</label>
                        <input type="text" className="form-control" id="email" aria-describedby="loginHelp" placeholder="Enter login" onChange={handleChange}/>
                    </div>
                    <div className="mb3">
                        <label htmlFor="password" className="form-label mt-1">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" autoComplete="off" onChange={handleChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 me-sm-2">Sign in</button>
                    <button type="button" className="btn btn-secondary mt-2" onClick={signUp}>Sign up</button>
                </fieldset>
            </form>
        </>
    )
}