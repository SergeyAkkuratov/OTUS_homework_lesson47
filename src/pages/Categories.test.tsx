import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ThenableReference, push, set } from "firebase/database";
import { initialCategories, initialOutlaysState, RootState } from "../store/Store";
import { AuthStatus } from "../store/StoreTypes";
import Categories from "./Categories";

jest.mock("firebase/database");

describe("Categories", () => {
    const initialState: RootState = {
        User: {
            status: AuthStatus.DONE,
            email: "test@test.com",
            uid: "test_uid",
        },
        Outlays: initialOutlaysState,
        Categories: initialCategories,
    };
    const mockStore = configureStore<RootState>();
    let store;

    it("should add new categories on submit", async () => {
        const myChildData = {
            key: "test_key",
        } as unknown as ThenableReference;

        (push as jest.MockedFunction<typeof push>).mockReturnValue(myChildData);
        (set as jest.MockedFunction<typeof set>).mockReturnValue(Promise.resolve());
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Categories />
                </BrowserRouter>
            </Provider>
        );

        const inputName = screen.getByTestId("inputName") as HTMLInputElement;
        await userEvent.type(inputName, "TEST");

        const selectParent = screen.getByTestId("selectParent") as HTMLSelectElement;
        await userEvent.selectOptions(selectParent, "Food");

        const button = screen.getByTestId("buttonSubmit") as HTMLButtonElement;
        await userEvent.click(button);

        expect(push).toHaveBeenCalled();
        expect(set).toHaveBeenCalled();
    });
});
