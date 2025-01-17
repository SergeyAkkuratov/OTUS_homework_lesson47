import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import { remove } from "firebase/database";
import userEvent from "@testing-library/user-event";
import { initialCategories, initialOutlaysState, RootState } from "../../store/Store";
import { AuthStatus } from "../../store/StoreTypes";
import CategoriesTable from "./CategoriesTable";

jest.mock("firebase/database");

describe("CategoriesTable", () => {
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

    it("should filled with data from store", () => {
        const store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CategoriesTable />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("cat-table")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-0")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-1")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-2")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-3")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-4")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-5")).toBeInTheDocument();
    });

    it("should filled with custom data from store", () => {
        const store = mockStore({
            User: {
                status: AuthStatus.DONE,
                email: "test@test.com",
                uid: "test_uid",
            },
            Outlays: initialOutlaysState,
            Categories: {
                categories: {
                    0: {
                        id: "0",
                        name: "TEST1",
                        parent: null,
                    },
                    1: {
                        id: "1",
                        name: "TEST2",
                        parent: "0",
                    },
                },
            },
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CategoriesTable />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("cat-table")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-0")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-1")).toBeInTheDocument();
        expect(screen.getByTestId("parent-td-id-1").innerHTML).toBe("TEST1");
    });

    it("should call firebase remove function on delete", async () => {
        jest.spyOn(window, "confirm").mockReturnValueOnce(true);
        (remove as jest.MockedFunction<typeof remove>).mockReturnValue(Promise.resolve());

        const store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CategoriesTable />
                </BrowserRouter>
            </Provider>
        );

        await userEvent.click(screen.getByTestId("deleteButton-id-0"));
        expect(remove).toHaveBeenCalled();
    });

    it("should don't call remove then decline confitm message", async () => {
        jest.spyOn(window, "confirm").mockReturnValueOnce(false);
        (remove as jest.MockedFunction<typeof remove>).mockReturnValue(Promise.resolve());

        const store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CategoriesTable />
                </BrowserRouter>
            </Provider>
        );

        await userEvent.click(screen.getByTestId("deleteButton-id-0"));
        expect(remove).not.toHaveBeenCalled();
    });
});
