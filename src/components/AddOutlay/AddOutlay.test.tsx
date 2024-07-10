import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import { initialCategories, initialOutlaysState, RootState } from "../../store/Store";
import { AuthStatus, OutlayType } from "../../store/StoreTypes";
import AddOutlay from "./AddOutlay";
import formatDate from "../../helpers";

describe("AddOulay", () => {
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
                    <AddOutlay />
                </BrowserRouter>
            </Provider>
        );
        const currentDate = formatDate(new Date());

        const formElement = screen.getByTestId("addOutlay");
        expect(formElement).toBeInTheDocument();

        const selectType = screen.getByTestId("selectType") as HTMLSelectElement;
        expect(selectType.value).toBe(OutlayType.OUTLAY);
        const inputDate = screen.getByTestId("inputDate") as HTMLInputElement;
        expect(inputDate.value).toBe(currentDate);
        const inputSum = screen.getByTestId("inputSum") as HTMLInputElement;
        expect(inputSum.value).toBe("0");
        const selectCategory = screen.getByTestId("selectCategory") as HTMLSelectElement;
        expect(selectCategory.value).toBe(initialState.Categories.categories[0].id);
        const textAreaComment = screen.getByTestId("textAreaComment") as HTMLTextAreaElement;
        expect(textAreaComment.value).toBe("");
    });
});
