/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { PayloadAction, configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { child, DatabaseReference, DataSnapshot, onValue, push, ref, set } from "firebase/database";
import { User } from "firebase/auth";
import { AuthStatus, Categories, CategoriesState, IOnValueFunction, Outlays, OutlaysState, UserState } from "./StoreTypes";
import { firebaseDb } from "../App";

export const initialUserState: UserState = {
    status: AuthStatus.NOT_DONE,
    email: null,
    uid: null,
};

export const initialOutlaysState: OutlaysState = {
    outlays: {},
};

export const initialCategories: CategoriesState = {
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
        isAuth: (state) => state.status === AuthStatus.DONE
    },
});

export const outlaysSlice = createSlice({
    name: "Outlays",
    initialState: initialOutlaysState,
    reducers: {
        outlaySet: (state, action: PayloadAction<Outlays>) => {
            state.outlays = action.payload;
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

export async function setOutlays(dbRef: DatabaseReference, snapshot: DataSnapshot) {
    const data = snapshot.val();
    if (data === null) {
        await push(dbRef, {});
        store.dispatch(outlaysSlice.actions.outlaySet({}));
    } else {
        store.dispatch(outlaysSlice.actions.outlaySet(data));
    }
}

export async function setCategories(dbRef: DatabaseReference, snapshot: DataSnapshot) {
    const data = snapshot.val();
    if (data === null) {
        await set(dbRef, store.getState().Categories.categories);
    } else {
        store.dispatch(categoriesSlice.actions.setCategories(data));
    }
}

export async function dbConnect(dbRef: DatabaseReference, onValueFunction: IOnValueFunction) {
    try {
        onValue(dbRef, (snapshot) => onValueFunction(dbRef, snapshot));
    } catch (error) {
        console.error(`Coonect error: ${error}`);
    }
}

export async function onUserConnect(user: User | null) {
    if (user) {
        if (!userSlice.selectors.isAuth(store.getState())) {
            const newUserState: UserState = {
                status: AuthStatus.DONE,
                email: user.email,
                uid: user.uid,
            };
            store.dispatch(userSlice.actions.successAuth(newUserState));
            await dbConnect(outlayDbReference(store.getState())!, setOutlays);
            await dbConnect(categoriesDbReference(store.getState())!, setCategories);
        }
    }
}