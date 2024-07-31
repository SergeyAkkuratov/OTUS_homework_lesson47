import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import { initialCategories, initialOutlaysState, initialUserState, RootState } from "../../store/Store";
import { AuthStatus } from "../../store/StoreTypes";

import Header from "./Header";

describe("Header", () => {
    const initialState: RootState = {
        User: initialUserState,
        Outlays: initialOutlaysState,
        Categories: initialCategories,
    };
    const mockStore = configureStore();
    let store;

    it("should contains 3 elements in start", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        const mainElement = screen.getByTestId("header");
        expect(mainElement).toBeInTheDocument();
        expect(mainElement.classList).toContain("navbar");
        expect(mainElement.classList).toContain("navbar-expand-sm");
        expect(mainElement.classList).toContain("bg-dark");
        const linkList = screen.getByTestId("linkList");
        expect(linkList.children.length).toBe(3);
    });

    it("should contains 5 elements after login", () => {
        store = mockStore({
            User: {
                status: AuthStatus.DONE,
                email: "test@test.com",
                uid: "123456",
            },
            Outlays: initialOutlaysState,
            Categories: initialCategories,
        });
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        const mainElement = screen.getByTestId("header");
        expect(mainElement).toBeInTheDocument();
        expect(mainElement.classList).toContain("navbar");
        expect(mainElement.classList).toContain("navbar-expand-sm");
        expect(mainElement.classList).toContain("bg-dark");
        const linkList = screen.getByTestId("linkList");
        expect(linkList.children.length).toBe(5);
    });
});
