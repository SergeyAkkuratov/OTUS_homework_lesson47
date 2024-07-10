import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { store } from "../store/Store";
import SingIn from "./SignIn";
import { AuthStatus } from "../store/StoreTypes";

jest.mock("firebase/auth");

describe("SignIn", () => {
    it("test errors on sign in", async () => {
        const logSpy = jest.spyOn(console, "error");
        (signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>).mockImplementation(() =>
            Promise.reject(new Error("TEST"))
        );
        (setPersistence as jest.MockedFunction<typeof setPersistence>).mockReturnValue(Promise.resolve());

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SingIn />
                </BrowserRouter>
            </Provider>
        );

        const inputEmail = screen.getByTestId("emailInput") as HTMLInputElement;
        await userEvent.type(inputEmail, "test@test.com");

        const inputPass = screen.getByTestId("passwordInput") as HTMLInputElement;
        await userEvent.type(inputPass, "test123");

        const button = screen.getByTestId("buttonSubmit") as HTMLButtonElement;
        await userEvent.click(button);

        expect(setPersistence).toHaveBeenCalled();
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
        expect(logSpy).toHaveBeenLastCalledWith(Error("TEST"));
        expect(store.getState().User).toStrictEqual({
            status: AuthStatus.NOT_DONE,
            email: null,
            uid: null,
        });
    });
    it("should sign in on submit", async () => {
        const myCred = {
            user: {
                email: "test@test.com",
                uid: "test_uid",
            },
        } as unknown as UserCredential;

        (signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>).mockReturnValue(Promise.resolve(myCred));
        (setPersistence as jest.MockedFunction<typeof setPersistence>).mockReturnValue(Promise.resolve());

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SingIn />
                </BrowserRouter>
            </Provider>
        );

        const inputEmail = screen.getByTestId("emailInput") as HTMLInputElement;
        await userEvent.type(inputEmail, "test@test.com");

        const inputPass = screen.getByTestId("passwordInput") as HTMLInputElement;
        await userEvent.type(inputPass, "test123");

        const button = screen.getByTestId("buttonSubmit") as HTMLButtonElement;
        await userEvent.click(button);

        expect(setPersistence).toHaveBeenCalled();
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
        expect(store.getState().User).toStrictEqual({
            status: AuthStatus.DONE,
            email: "test@test.com",
            uid: "test_uid",
        });
    });

    it("should sign up on SignUp button click", async () => {
        const myCred = {
            user: {
                email: "test@test.com",
                uid: "test_uid",
            },
        } as unknown as UserCredential;

        (createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>).mockReturnValue(Promise.resolve(myCred));
        (setPersistence as jest.MockedFunction<typeof setPersistence>).mockReturnValue(Promise.resolve());

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SingIn />
                </BrowserRouter>
            </Provider>
        );

        const inputEmail = screen.getByTestId("emailInput") as HTMLInputElement;
        await userEvent.type(inputEmail, "test@test.com");

        const inputPass = screen.getByTestId("passwordInput") as HTMLInputElement;
        await userEvent.type(inputPass, "test123");

        const button = screen.getByTestId("buttonSignUp") as HTMLButtonElement;
        await userEvent.click(button);

        expect(setPersistence).toHaveBeenCalled();
        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(store.getState().User).toStrictEqual({
            status: AuthStatus.DONE,
            email: "test@test.com",
            uid: "test_uid",
        });
    });
});
