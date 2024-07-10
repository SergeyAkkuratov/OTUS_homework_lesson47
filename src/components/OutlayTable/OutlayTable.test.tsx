import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { remove } from "firebase/database";
import { initialCategories, RootState } from "../../store/Store";
import { AuthStatus, OutlayType } from "../../store/StoreTypes";
import OutlayTable from "./OutlayTable";

jest.mock("firebase/database");

describe("AddOulay", () => {
    const initialState: RootState = {
        User: {
            status: AuthStatus.DONE,
            email: "test@test.com",
            uid: "test_uid",
        },
        Outlays: {
            outlays: {
                "1": {
                    id: "1",
                    type: OutlayType.OUTLAY,
                    date: "2024-07-10T10:00",
                    sum: 299,
                    category: "0",
                    comment: "Test comment 1",
                },
                "2": {
                    id: "2",
                    type: OutlayType.OUTLAY,
                    date: "2024-07-10T11:00",
                    sum: 299,
                    category: "1",
                    comment: "Test comment 2",
                },
                "3": {
                    id: "3",
                    type: OutlayType.INCOME,
                    date: "2024-07-10T12:00",
                    sum: 299,
                    category: "2",
                    comment: "Test comment 3",
                },
            },
        },
        Categories: initialCategories,
    };
    const mockStore = configureStore<RootState>();
    let store;

    it("should filled with data from store", () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <OutlayTable startDate={"2024-07-10T09:00"} endDate={"2024-07-10T20:00"} />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("row-id-1")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-2")).toBeInTheDocument();
        expect(screen.getByTestId("row-id-3")).toBeInTheDocument();
    });

    it("should call firebase remove function on delete", async () => {
        jest.spyOn(window, "confirm").mockReturnValueOnce(true);
        (remove as jest.MockedFunction<typeof remove>).mockReturnValue(Promise.resolve());

        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <OutlayTable startDate={"2024-07-10T09:00"} endDate={"2024-07-10T20:00"} />
                </BrowserRouter>
            </Provider>
        );

        await userEvent.click(screen.getByTestId("deleteButton-id-1"));
        expect(remove).toHaveBeenCalled();
    });

    it("should don't call remove then decline confitm message", async () => {
        jest.spyOn(window, "confirm").mockReturnValueOnce(false);
        (remove as jest.MockedFunction<typeof remove>).mockReturnValue(Promise.resolve());

        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <OutlayTable startDate={"2024-07-10T09:00"} endDate={"2024-07-10T20:00"} />
                </BrowserRouter>
            </Provider>
        );

        await userEvent.click(screen.getByTestId("deleteButton-id-1"));
        expect(remove).not.toHaveBeenCalled();
    });
});
