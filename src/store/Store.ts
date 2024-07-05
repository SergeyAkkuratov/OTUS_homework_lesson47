import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { AuthStatus, Outlay, OutlayType, OutlaysState, UserState } from "./Store.types";
import { useDispatch, useSelector } from "react-redux";


//TODO: для тестовых нужд, убрать перед деплоем
const initialUserStateSingIn: UserState = {
    status: AuthStatus.DONE,
    login: "TestUserLogin",
    email: "test.user@gmail.com"
}

const initialTasksStateTest: OutlaysState = {
    connected: false,
    outlays: [
        {
            id: "1",
            date: "2024-07-04T15:40:33.597Z",
            comment: "Comment 1",
            sum: 150000,
            type: OutlayType.INCOME,
            category: "Salary"
        },
        {
            id: "2",
            date: "2024-07-01T15:40:33.597Z",
            comment: "Comment 2",
            sum: 150000,
            type: OutlayType.OUTLAY,
            category: "Bills"
        },
        {
            id: "3",
            date: "2024-07-02T15:40:33.597Z",
            comment: "",
            sum: 1000,
            type: OutlayType.OUTLAY,
            category: "Books"
        },
        {
            id: "4",
            date: "2024-06-30T15:40:33.597Z",
            comment: "",
            sum: 10000,
            type: OutlayType.OUTLAY,
            category: "Restaraunt"
        },
        {
            id: "5",
            date: "2024-06-04T15:40:33.597Z",
            comment: "",
            sum: 150000,
            type: OutlayType.INCOME,
            category: "Salary"
        },
    ]
}

const initialUserState: UserState = {
    status: AuthStatus.NOT_DONE,
    login: null,
    email: null
}


const initialTasksState: OutlaysState = {
    connected: false,
    outlays: []
}

export const userSlice = createSlice({
    name: "User",
    initialState: initialUserStateSingIn,
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
                login: null,
                email: null
            };
        }
    },
    selectors: {
        isAuth: (state) => state.status === AuthStatus.DONE
    }
});

export const outlaysSlice = createSlice({
    name: "Outlays",
    initialState: initialTasksStateTest,
    reducers: {
        outlayCreate: (state, action: PayloadAction<Outlay>) => {
            state.outlays.push(action.payload);
        },
        outlayDelete: (state, action: PayloadAction<string>) => {
            state.outlays.splice(state.outlays.findIndex(outlay => outlay.id === action.payload), 1);
        },
        connect: (state) => { state.connected = true },
        disconnect: (state) => { state.connected = false }
    },
    selectors: {
        lastWeekOutlays: (state) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return state.outlays.filter(outlay => new Date(outlay.date) > weekAgo).sort((a,b) => Date.parse(b.date) - Date.parse(a.date));
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