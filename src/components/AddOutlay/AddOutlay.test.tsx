import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { initialCategories, initialOutlaysState, RootState } from "../../store/Store";
import { AuthStatus, OutlayType } from "../../store/StoreTypes";
import AddOutlay from "./AddOutlay";
import formatDate from "../../helpers";

describe("AddOulay", () => {
    const initialState: RootState = { 
        User: {
            status: AuthStatus.DONE,
            email: "test@test.com",
            uid: "123456"
        },
        Outlays: initialOutlaysState,
        Categories: initialCategories
     };
    const mockStore = configureStore<RootState>();
    let store;

    const mockData = {     
        id: "test_id",
        type: OutlayType.OUTLAY,
        date: formatDate(new Date()),
        sum: 299,
        category: initialState.Categories.categories[0].id,
        comment: "Test comment"
    };
    
    jest.mock("firebase/app", () => {
        const snapshot = { val: () => mockData };
        return {
          firebaseConfig: jest.fn().mockReturnValue({}),
          auth: jest.fn().mockReturnValue({ currentUser: { uid: 'test_uid', email: "test@test.com" } }),
          database: jest.fn().mockReturnValue({
            ref: jest.fn().mockImplementation(() => ({
              child: jest.fn().mockImplementation(() => ({
                push: jest.fn().mockReturnValue({
                  key: 'test_outlay_id'
                })
              })),
              set: jest.fn(),
            })),
            once: jest.fn(() => Promise.resolve(snapshot))
          })
        };
      });

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
    })

    it("should add new outlay on submit", async () => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AddOutlay />
                </BrowserRouter>
            </Provider>
        );

        const formElement = screen.getByTestId("addOutlay");
        expect(formElement).toBeInTheDocument();


        const inputSum = screen.getByTestId("inputSum") as HTMLInputElement;
        inputSum.value = `${mockData.sum}`;
        const textAreaComment = screen.getByTestId("textAreaComment") as HTMLTextAreaElement;
        textAreaComment.value = mockData.comment;
        
        await userEvent.click(screen.getByTestId("buttonSubmit"));

        expect(store.getState().Outlays.outlays.test_outlay_id).toBe(mockData);
    })
})