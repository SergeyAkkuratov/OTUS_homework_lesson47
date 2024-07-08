import React, { useState } from "react";
import { categoriesConnect, dbConnect, useAppDispatch, userSlice } from "../store/Store";
import { AuthStatus, UserState } from "../store/Store.types";
import { useNavigate } from "react-router-dom";
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../App";

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

    async function signInOrUp(firebaseFunction: typeof signInWithEmailAndPassword | typeof createUserWithEmailAndPassword) {
        dispatch(userSlice.actions.startAuth());
        setFormData({
            email: "",
            password: "",
        })
        try {
            await setPersistence(firebaseAuth, browserLocalPersistence);
            const userCredential = await firebaseFunction(firebaseAuth, formData.email, formData.password);
            const newUserState: UserState = {
                status: AuthStatus.DONE,
                email: userCredential.user.email,
                uid: userCredential.user.uid
            };
            dispatch(userSlice.actions.successAuth(newUserState))
            await dbConnect();
            await categoriesConnect();
            navigate("/");
        } catch (error) {
            console.error(error);
            dispatch(userSlice.actions.failureAuth())
        }
    }

    return (
        <>
            <form onSubmit={(event) => {
                event.preventDefault();
                signInOrUp(signInWithEmailAndPassword);
            }}>
                <fieldset>
                    <div>
                        <label htmlFor="email" className="form-label mt-1">Login</label>
                        <input type="text" className="form-control" id="email" aria-describedby="loginHelp" placeholder="Enter login" onChange={handleChange} />
                    </div>
                    <div className="mb3">
                        <label htmlFor="password" className="form-label mt-1">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" autoComplete="off" onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 me-sm-2">Sign in</button>
                    <button type="button" className="btn btn-secondary mt-2" onClick={() => signInOrUp(createUserWithEmailAndPassword)}>Sign up</button>
                </fieldset>
            </form>
        </>
    )
}