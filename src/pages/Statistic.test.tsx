import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { outlaysSlice, store } from "../store/Store";
import Statistic from "./Statistic";
import { OutlayType } from "../store/StoreTypes";

describe("Statisitc", () => {
    const outlays = {
        "1": {
            id: "1",
            type: OutlayType.OUTLAY,
            date: "2024-07-06T01:00",
            sum: 299,
            category: "0",
            comment: "today",
        },
        "2": {
            id: "2",
            type: OutlayType.OUTLAY,
            date: "2024-07-04T01:00",
            sum: 299,
            category: "1",
            comment: "-2 days",
        },
        "3": {
            id: "3",
            type: OutlayType.OUTLAY,
            date: "2024-06-14T01:00",
            sum: 299,
            category: "2",
            comment: "-20 days",
        },
        "4": {
            id: "3",
            type: OutlayType.OUTLAY,
            date: "2024-05-01T01:00",
            sum: 299,
            category: "2",
            comment: "older",
        },
        "5": {
            id: "3",
            type: OutlayType.INCOME,
            date: "2024-05-01T01:00",
            sum: 299,
            category: "2",
            comment: "older",
        },
    };

    function mockSearchParams(paramsString: string): void {
        const { pathname } = window.location;
        const url = paramsString ? `${pathname}?${paramsString}` : pathname;
        window.history.pushState({}, "", url);
    }

    it("should show last week table view by default", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Statistic />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByTestId("outlayTable")).toBeInTheDocument();
        const activeButton = screen.getByTestId("button-radio-LastWeek") as HTMLInputElement;
        expect(activeButton).toBeInTheDocument();
        expect(activeButton.checked).toBeTruthy();
    });

    it("should show switch beetwen diferent views", async () => {
        store.dispatch(outlaysSlice.actions.outlaySet(outlays));
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Statistic />
                </BrowserRouter>
            </Provider>
        );

        const table = screen.getByTestId("outlayTable") as HTMLTableElement;
        expect(table).toBeInTheDocument();
        expect(table.rows.length).toBe(3);

        await userEvent.click(screen.getByTestId("button-radio-LastMonth"));

        expect(table.rows.length).toBe(4);

        const startDateInput = screen.getByTestId("startDateInput") as HTMLInputElement;
        const endDateInput = screen.getByTestId("endDateInput") as HTMLInputElement;

        await userEvent.click(screen.getByTestId("button-radio-BetweenTwoDates"));
        // Fire the change event
        await act(async () => {
            fireEvent.change(startDateInput, { target: { id: "startDate", value: "2024-04-01T01:00" } });
            // To trigger any onChange listeners
            fireEvent.blur(startDateInput);

            fireEvent.change(endDateInput, { target: { id: "endDate", value: "2024-07-10T23:59" } });
            // To trigger any onChange listeners
            fireEvent.blur(endDateInput);
        });

        expect(startDateInput.value).toBe("2024-04-01T01:00");
        expect(table.rows.length).toBe(6);

        const chartCheckbox = screen.getByTestId("isChartInput") as HTMLInputElement;
        expect(chartCheckbox.checked).not.toBeTruthy();

        await userEvent.click(chartCheckbox);

        expect(chartCheckbox.checked).toBeTruthy();

        await userEvent.click(chartCheckbox);
        await userEvent.click(screen.getByTestId("button-radio-LastWeek"));
        expect(table.rows.length).toBe(6);
    });

    it("test lastWeek search params", () => {
        mockSearchParams(`?filter=LastWeek&startDate=2024-07-03T23%3A33&endDate=2024-07-10T23%3A33&isChart=false`);
        store.dispatch(outlaysSlice.actions.outlaySet(outlays));
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Statistic />
                </BrowserRouter>
            </Provider>
        );

        const table = screen.getByTestId("outlayTable") as HTMLTableElement;
        expect(table).toBeInTheDocument();
        expect(table.rows.length).toBe(3);
    });

    it("test LastMonth search params", () => {
        mockSearchParams(`?filter=LastMonth&startDate=2024-06-10T23%3A33&endDate=2024-07-10T23%3A33&isChart=false`);
        store.dispatch(outlaysSlice.actions.outlaySet(outlays));
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Statistic />
                </BrowserRouter>
            </Provider>
        );

        const table = screen.getByTestId("outlayTable") as HTMLTableElement;
        expect(table).toBeInTheDocument();
        expect(table.rows.length).toBe(4);
    });

    it("test BetweenTwoDates serch params", () => {
        mockSearchParams(`?filter=BetweenTwoDates&startDate=2024-04-01T23%3A33&endDate=2024-07-10T23%3A33&isChart=false`);
        store.dispatch(outlaysSlice.actions.outlaySet(outlays));
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Statistic />
                </BrowserRouter>
            </Provider>
        );

        const table = screen.getByTestId("outlayTable") as HTMLTableElement;
        expect(table).toBeInTheDocument();
        expect(table.rows.length).toBe(6);
    });
});
