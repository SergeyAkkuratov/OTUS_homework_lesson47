import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import { initialCategories, initialOutlaysState, RootState } from "../../store/Store";
import { AuthStatus } from "../../store/StoreTypes";
import AddCategories from "./AddCategories";

describe("AddCategories", () => {
    const initialState: RootState = {
        User: {
            status: AuthStatus.DONE,
            email: "test@test.com",
            uid: "123456",
        },
        Outlays: initialOutlaysState,
        Categories: initialCategories,
    };
    const mockStore = configureStore<RootState>();
    let store;

    it("should contain all form fields in initial state", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AddCategories />
                </BrowserRouter>
            </Provider>
        );

        const formElement = screen.getByTestId("addCategory");
        expect(formElement).toBeInTheDocument();

        const inputName = screen.getByTestId("inputName") as HTMLInputElement;
        expect(inputName.value).toBe("");
        const selectParent = screen.getByTestId("selectParent") as HTMLSelectElement;
        expect(selectParent.value).toBe("No parent");
    });
});
