import { act, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import { initialCategories, initialOutlaysState, RootState } from "./store/Store";
import { AuthStatus, CategoriesState, OutlaysState, UserState } from "./store/StoreTypes";
import App from "./App";

describe("App", () => {
    const initialState: RootState = {
        User: {
            status: AuthStatus.NOT_DONE,
            email: "test@test.com",
            uid: "test_uid",
        },
        Outlays: initialOutlaysState,
        Categories: initialCategories,
    };
    const mockStore = configureStore<RootState>();
    let store: MockStoreEnhanced<
        {
            User: UserState;
            Outlays: OutlaysState;
            Categories: CategoriesState;
        },
        object
    >;

    it("should showd have 3 routes", async () => {
        store = mockStore(initialState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            );
        });
        const linkList = screen.getByTestId("linkList");
        expect(linkList.children.length).toBe(3);
    });

    it("should showd have 5 routes", async () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            );
        });
        const linkList = screen.getByTestId("linkList");
        expect(linkList.children.length).toBe(5);
    });
});
