import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { outlaysSlice, store } from "../store/Store";
import Statistic from "./Statistic";
import { OutlayType } from "../store/StoreTypes";
import formatDate from "../helpers";

describe("Statisitc", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dates: any = {};
    const today = new Date();
    dates.today = formatDate(today);

    today.setMonth(today.getMonth() - 1);
    dates.lastMonth = formatDate(today);

    today.setMonth(today.getMonth() + 1);
    today.setDate(today.getDate() - 2);
    dates["-2 days"] = formatDate(today);

    today.setDate(today.getDate() - 5);
    dates.lastWeek = formatDate(today);

    today.setDate(today.getDate() - 13);
    dates["-20 days"] = formatDate(today);

    today.setDate(today.getDate() - 15);
    dates["-35 days"] = formatDate(today);

    today.setDate(today.getDate() - 20);
    dates["-55 days"] = formatDate(today);

    const outlays = {
        "1": {
            id: "1",
            type: OutlayType.OUTLAY,
            date: dates.today,
            sum: 299,
            category: "0",
            comment: "today",
        },
        "2": {
            id: "2",
            type: OutlayType.OUTLAY,
            date: dates["-2 days"],
            sum: 299,
            category: "1",
            comment: "-2 days",
        },
        "3": {
            id: "3",
            type: OutlayType.OUTLAY,
            date: dates["-20 days"],
            sum: 299,
            category: "2",
            comment: "-20 days",
        },
        "4": {
            id: "3",
            type: OutlayType.OUTLAY,
            date: dates["-35 days"],
            sum: 299,
            category: "2",
            comment: "older",
        },
        "5": {
            id: "3",
            type: OutlayType.INCOME,
            date: dates["-55 days"],
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

        // await userEvent.click(screen.getByTestId("button-radio-LastMonth"));
        await act(async () => {
            fireEvent.change(screen.getByTestId("button-radio-LastMonth"), { target: { value: "LastMonth" } });
        });

        expect(table.rows.length).toBe(3);

        const startDateInput = screen.getByTestId("startDateInput") as HTMLInputElement;
        const endDateInput = screen.getByTestId("endDateInput") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(screen.getByTestId("button-radio-BetweenTwoDates"), { target: { value: "BetweenTwoDates" } });
            fireEvent.change(startDateInput, { target: { id: "startDate", value: dates["-2 days"] } });
            fireEvent.change(endDateInput, { target: { id: "endDate", value: dates.today } });
        });

        expect(startDateInput.value).toBe(dates["-2 days"]);
        expect(table.rows.length).toBe(3);

        const chartCheckbox = screen.getByTestId("isChartInput") as HTMLInputElement;
        expect(chartCheckbox.checked).not.toBeTruthy();

        await userEvent.click(chartCheckbox);

        expect(chartCheckbox.checked).toBeTruthy();

        await userEvent.click(chartCheckbox);
        // await userEvent.click(screen.getByTestId("button-radio-LastWeek"));
        await act(async () => {
            fireEvent.change(screen.getByTestId("button-radio-LastWeek"), { target: { value: "LastWeek" } });
            // To trigger any onChange listeners
            fireEvent.blur(screen.getByTestId("button-radio-LastWeek"));
        });
        expect(table.rows.length).toBe(3);
    });

    it("test lastWeek search params", () => {
        const startDate = (dates.lastWeek as string).replace(":", "%3A");
        const endDate = (dates.today as string).replace(":", "%3A");
        mockSearchParams(`?filter=LastWeek&startDate=${startDate}&endDate=${endDate}&isChart=false`);
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
        const startDate = (dates.lastMonth as string).replace(":", "%3A");
        const endDate = (dates.today as string).replace(":", "%3A");
        mockSearchParams(`?filter=LastMonth&startDate=${startDate}%3A33&endDate=${endDate}&isChart=false`);
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
        const startDate = (dates["-55 days"] as string).replace(":", "%3A");
        const endDate = (dates.today as string).replace(":", "%3A");
        mockSearchParams(`?filter=BetweenTwoDates&startDate=${startDate}&endDate=${endDate}&isChart=false`);
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
