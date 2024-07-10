import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { initialCategories, initialOutlaysState, RootState } from "../store/Store";
import { AuthStatus, OutlayType } from "../store/StoreTypes";
import formatDate from "../helpers";
import Main from "./Main";

describe("Main", () => {
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
    let store;

    const testData = {
        id: "test_outlay_id",
        type: OutlayType.OUTLAY,
        date: formatDate(new Date()),
        sum: 299,
        category: initialState.Categories.categories[0].id,
        comment: "Test comment",
    };

    it("should show warning on not auth state", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </Provider>
        );

        const warning = screen.getByTestId("warning") as HTMLDivElement;
        expect(warning).toBeInTheDocument();
        expect(warning.classList).toContain("alert");
        expect(warning.classList).toContain("alert-dismissible");
        expect(warning.classList).toContain("alert-warning");
    });

    it("should contain all form fields in initial state", () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Main />
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

        const outlayTable = screen.getByTestId("outlayTable");
        expect(outlayTable).toBeInTheDocument();
    });

    it("should add new outlay on submit", async () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </Provider>
        );
        const currentDate = formatDate(new Date());

        const formElement = screen.getByTestId("addOutlay");
        expect(formElement).toBeInTheDocument();

        const selectType = screen.getByTestId("selectType") as HTMLSelectElement;
        await userEvent.selectOptions(selectType, OutlayType.INCOME);

        const inputSum = screen.getByTestId("inputSum") as HTMLInputElement;
        await userEvent.type(inputSum, `${testData.sum}`);

        const textAreaComment = screen.getByTestId("textAreaComment") as HTMLTextAreaElement;
        await userEvent.type(textAreaComment, `${testData.comment}`);

        const button = screen.getByTestId("buttonSubmit") as HTMLButtonElement;
        expect(button.textContent).toBe("Add INCOME");

        await userEvent.click(button);
        await screen.findByText("Add OUTLAY");

        expect(selectType.value).toBe(OutlayType.OUTLAY);
        const inputDate = screen.getByTestId("inputDate") as HTMLInputElement;
        expect(inputDate.value).toBe(currentDate);
        expect(inputSum.value).toBe("0");
        const selectCategory = screen.getByTestId("selectCategory") as HTMLSelectElement;
        expect(selectCategory.value).toBe(initialState.Categories.categories[0].id);
        expect(textAreaComment.value).toBe("");
    });
});
