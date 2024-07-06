import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { AuthStatus, Outlay, OutlayType, Outlays, OutlaysState, UserState } from "./Store.types";
import { useDispatch, useSelector } from "react-redux";
import { firebaseDb } from "../firebase/firebaseAPI";
import { onValue, ref } from "firebase/database";

const initialUserState: UserState = {
    status: AuthStatus.NOT_DONE,
    email: null,
    uid: null
}

const initialOutlaysState: OutlaysState = {
    connected: false,
    dbReference: null,
    outlays: {}
}

export const userSlice = createSlice({
    name: "User",
    initialState: initialUserState,
    reducers: {
        startAuth: (state) => { state.status = AuthStatus.IN_PROGRESS },
        successAuth: (state, action: PayloadAction<UserState>) => {
            return action.payload;
        },
        failureAuth: (state) => {
            console.error("Auth error");
            state.status = AuthStatus.NOT_DONE;
        },
        signOut: (state) => {
            return {
                status: AuthStatus.NOT_DONE,
                email: null,
                uid: null
            };
        }
    },
    selectors: {
        isAuth: (state) => state.status === AuthStatus.DONE,
        userUID: (state) => state.uid,
    }
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
        connect: (state, action: PayloadAction<UserState>) => {
            state.dbReference = ref(firebaseDb, action.payload.uid!);
            state.connected = true
        },
        disconnect: (state) => {
            return initialOutlaysState;
        }
    },
    selectors: {
        dbReference: (state) => { return state.dbReference },
        lastWeekOutlays: (state) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return Object.keys(state.outlays).map((key) => state.outlays[key]).filter(outlay => new Date(outlay.date) > weekAgo).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }
    }
})

export const store = configureStore({
    reducer: {
        User: userSlice.reducer,
        Outlays: outlaysSlice.reducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()