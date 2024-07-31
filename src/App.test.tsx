import { act, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
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
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </Provider>
            );
        });
        const linkList = screen.getByTestId("linkList");
        expect(linkList.children.length).toBe(3);

        await userEvent.click(screen.getByTestId("linkSignin"));
        expect(screen.getByTestId("sginin-form")).toBeInTheDocument();
    });

    it("should showd load About page", async () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </Provider>
            );
        });

        const linkList = screen.getByTestId("linkList");
        expect(linkList.children.length).toBe(5);
        await screen.findByTestId("outlayTable");

        await userEvent.click(screen.getByTestId("linkAbout"));
        await screen.findByTestId("linkAbout");
        expect(screen.getByTestId("about-message")).toBeInTheDocument();
    });

    it("should showd load Categories page", async () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </Provider>
            );
        });
        await screen.findByTestId("outlayTable");

        await userEvent.click(screen.getByTestId("linkCategories"));

        await screen.findByTestId("cat-table");
        expect(screen.getByTestId("cat-table")).toBeInTheDocument();
    });

    it("should showd load Statistic page", async () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </Provider>
            );
        });
        await screen.findByTestId("outlayTable");

        await userEvent.click(screen.getByTestId("linkStatistic"));
        await screen.findByTestId("statisticForm");
        expect(screen.getByTestId("statisticForm")).toBeInTheDocument();
    });

    it("should showd load User page", async () => {
        initialState.User.status = AuthStatus.DONE;
        store = mockStore(initialState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </Provider>
            );
        });
        await screen.findByTestId("outlayTable");

        await userEvent.click(screen.getByTestId("linkUser"));
        await screen.findByTestId("user-label");
        expect(screen.getByTestId("user-label")).toBeInTheDocument();
    });
});
