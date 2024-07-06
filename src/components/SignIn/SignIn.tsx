import React, { useEffect, useState } from "react";
import { categoriesSlice, outlaysSlice, store, useAppDispatch, userSlice } from "../../store/Store";
import { firebaseAuth } from "../../firebase/firebaseAPI";
import { AuthStatus, UserState } from "../../store/Store.types";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { onValue, push, set } from "firebase/database";

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
            const userCredential = await firebaseFunction(firebaseAuth, formData.email, formData.password);
            const newUserState: UserState = {
                status: AuthStatus.DONE,
                email: userCredential.user.email,
                uid: userCredential.user.uid
            };
            dispatch(userSlice.actions.successAuth(newUserState))
            await dbConnect(newUserState);
            await categoriesConnect(newUserState);
            navigate("/");
        } catch (error) {
            dispatch(userSlice.actions.failureAuth())
        }
    }

    async function dbConnect(userState: UserState) {
        try {
            dispatch(outlaysSlice.actions.connect(userState));
            onValue(store.getState().Outlays.dbReference!, (snapshot) => {
                const data = snapshot.val();
                if (data === null) {
                    push(store.getState().Outlays.dbReference!, {});
                    dispatch(outlaysSlice.actions.outlaySet({}));
                } else {
                    dispatch(outlaysSlice.actions.outlaySet(data));
                }
            });
        } catch (error) {
            console.error("Coonect error");
        }
    }

    async function categoriesConnect(userState: UserState) {
        try {
            dispatch(categoriesSlice.actions.connect(userState));
            onValue(store.getState().Categories.dbReference!, async (snapshot) => {
                const data = snapshot.val();
                if (data === null) {
                    await set(store.getState().Categories.dbReference!, store.getState().Categories.categories);
                } else {
                    dispatch(categoriesSlice.actions.setCategories(data));
                }
            });
        } catch (error) {
            console.error("Categories Coonect error");
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