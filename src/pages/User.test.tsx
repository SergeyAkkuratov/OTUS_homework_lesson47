import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { signOut } from "firebase/auth";
import userEvent from "@testing-library/user-event";
import { store, userSlice } from "../store/Store";
import User from "./User";
import { AuthStatus } from "../store/StoreTypes";

jest.mock("firebase/auth");

describe("User page", () => {
    it("test signOut", async () => {
        (signOut as jest.MockedFunction<typeof signOut>).mockReturnValue(Promise.resolve());
        store.dispatch(
            userSlice.actions.successAuth({
                status: AuthStatus.DONE,
                email: "test@test.com",
                uid: "test_uid",
            })
        );
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <User />
                </BrowserRouter>
            </Provider>
        );

        await userEvent.click(screen.getByTestId("signOutButton"));
        expect(signOut).toHaveBeenCalled();
    });

    it("test signOut error", async () => {
        const logSpy = jest.spyOn(console, "error");
        (signOut as jest.MockedFunction<typeof signOut>).mockImplementation(() => Promise.reject(new Error("TEST")));
        store.dispatch(
            userSlice.actions.successAuth({
                status: AuthStatus.DONE,
                email: "test@test.com",
                uid: "test_uid",
            })
        );
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <User />
                </BrowserRouter>
            </Provider>
        );

        await userEvent.click(screen.getByTestId("signOutButton"));

        expect(logSpy).toHaveBeenLastCalledWith("Sign out error: Error: TEST");
    });
});
