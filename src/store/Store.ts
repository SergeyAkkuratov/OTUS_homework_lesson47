/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { PayloadAction, configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { child, onValue, push, ref, set } from "firebase/database";
import { AuthStatus, Categories, CategoriesState, Outlays, OutlaysState, UserState } from "./StoreTypes";
import { firebaseDb } from "../App";

const initialUserState: UserState = {
    status: AuthStatus.NOT_DONE,
    email: null,
    uid: null,
};

const initialOutlaysState: OutlaysState = {
    outlays: {},
};

const initialCategories: CategoriesState = {
    categories: {
        0: {
            id: "0",
            name: "Food",
            parent: null,
        },
        1: {
            id: "1",
            name: "Bills",
            parent: null,
        },
        2: {
            id: "2",
            name: "Medecine",
            parent: null,
        },
        3: {
            id: "3",
            name: "Transport",
            parent: null,
        },
        4: {
            id: "4",
            name: "Entertainment",
            parent: null,
        },
        5: {
            id: "5",
            name: "Salary",
            parent: null,
        },
    },
};

export const userSlice = createSlice({
    name: "User",
    initialState: initialUserState,
    reducers: {
        startAuth: (state) => {
            state.status = AuthStatus.IN_PROGRESS;
        },
        successAuth: (state, action: PayloadAction<UserState>) => action.payload,
        failureAuth: (state) => {
            state.status = AuthStatus.NOT_DONE;
        },
        signOut: (state) => ({
            status: AuthStatus.NOT_DONE,
            email: null,
            uid: null,
        }),
    },
    selectors: {
        isAuth: (state) => state.status === AuthStatus.DONE,
        userUID: (state) => state.uid,
    },
});

export const outlaysSlice = createSlice({
    name: "Outlays",
    initialState: initialOutlaysState,
    reducers: {
        outlaySet: (state, action: PayloadAction<Outlays>) => {
            if (action.payload !== null) {
                state.outlays = action.payload;
            } else {
                state.outlays = {};
            }
        },
    },
});

export const categoriesSlice = createSlice({
    name: "Categories",
    initialState: initialCategories,
    reducers: {
        setCategories: (state, action: PayloadAction<Categories>) => {
            state.categories = action.payload;
        },
    },
    selectors: {
        categoryNameWithId: (state, id: string) => state.categories[id].name,
        highestCategoryName: (state, id: string) => {
            let category = state.categories[id];
            while (category.parent) {
                category = state.categories[category.parent];
            }
            return category.name;
        },
    },
});

export const store = configureStore({
    reducer: {
        User: userSlice.reducer,
        Outlays: outlaysSlice.reducer,
        Categories: categoriesSlice.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const createAppSelector = createSelector.withTypes<RootState>();

export const outlayDbReference = createAppSelector([(state) => state.User.uid], (uid: string | null) => (uid ? ref(firebaseDb, uid) : null));

export const filterOutlays = createAppSelector(
    [(state) => state.Outlays.outlays, (state, startDate: string) => startDate, (state, startDate: string, endDate: string) => endDate],
    (outlays: Outlays, startDate: string, endDate: string) =>
        Object.keys(outlays)
            .map((key) => outlays[key])
            .filter((outlay) => new Date(outlay.date) >= new Date(startDate) && new Date(outlay.date) <= new Date(endDate))
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
);

export const categoriesDbReference = createAppSelector([(state) => state.User.uid], (uid: string | null) =>
    uid ? child(ref(firebaseDb, uid), "categories") : null
);

export const listOfCategories = createAppSelector([(state) => state.Categories.categories], (categories: Categories) =>
    Object.keys(categories).map((key) => categories[key])
);

export async function dbConnect() {
    try {
        onValue(outlayDbReference(store.getState())!, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                push(outlayDbReference(store.getState())!, {});
                store.dispatch(outlaysSlice.actions.outlaySet({}));
            } else {
                store.dispatch(outlaysSlice.actions.outlaySet(data));
            }
        });
    } catch (error) {
        console.error(`Coonect error: ${error}`);
    }
}

export async function categoriesConnect() {
    try {
        onValue(categoriesDbReference(store.getState())!, async (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                await set(categoriesDbReference(store.getState())!, store.getState().Categories.categories);
            } else {
                store.dispatch(categoriesSlice.actions.setCategories(data));
            }
        });
    } catch (error) {
        console.error(`Coonect error: ${error}`);
    }
}
