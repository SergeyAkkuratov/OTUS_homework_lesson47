import { child, DatabaseReference, DataSnapshot, push, set, ThenableReference } from "firebase/database";
import { categoriesDbReference, categoriesSlice, initialUserState, outlaysSlice, setCategories, setOutlays, store, userSlice } from "./Store";
import { AuthStatus, Categories, Outlays, OutlayType, UserState } from "./StoreTypes";

jest.mock("firebase/database");

describe("Store", () => {
    const outlays: Outlays = {
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
    };

    const user: UserState = {
        status: AuthStatus.DONE,
        email: "test@test.com",
        uid: "test_uid",
    };

    const categories: Categories = {
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
    };
    it("test user actions", () => {
        store.dispatch(userSlice.actions.startAuth());

        expect(store.getState().User.status).toBe(AuthStatus.IN_PROGRESS);

        store.dispatch(userSlice.actions.failureAuth());

        expect(store.getState().User.status).toBe(AuthStatus.NOT_DONE);

        store.dispatch(userSlice.actions.successAuth(user));

        expect(store.getState().User).toBe(user);

        store.dispatch(userSlice.actions.signOut());

        expect(store.getState().User).toStrictEqual(initialUserState);
    });

    it("test outlaySet action", () => {
        store.dispatch(outlaysSlice.actions.outlaySet(outlays));

        expect(store.getState().Outlays.outlays).toBe(outlays);

        store.dispatch(outlaysSlice.actions.outlaySet({}));

        expect(store.getState().Outlays.outlays).toStrictEqual({});
    });

    it("test categories actions", () => {
        store.dispatch(categoriesSlice.actions.setCategories(categories));

        expect(store.getState().Categories.categories).toBe(categories);
        expect(categoriesSlice.selectors.categoryNameWithId(store.getState(), "1")).toBe(categories["1"].name);
        expect(categoriesSlice.selectors.highestCategoryName(store.getState(), "1")).toBe(categories["0"].name);
    });

    it("test onValue callback function for outlays db", async () => {
        const myChildData = {
            key: "test_key",
        } as unknown as ThenableReference;

        const myDbRef = {
            key: "child_test_key",
        } as unknown as DatabaseReference;

        let snapshot = {
            val: () => null,
        } as unknown as DataSnapshot;

        (push as jest.MockedFunction<typeof push>).mockReturnValue(myChildData);

        setOutlays(myDbRef, snapshot);
        expect(push).toHaveBeenCalled();
        expect(store.getState().Outlays.outlays).toStrictEqual({});

        snapshot = {
            val: () => ({
                "1": {
                    id: "1",
                    type: OutlayType.OUTLAY,
                    date: "2024-07-10T10:00",
                    sum: 299,
                    category: "0",
                    comment: "Test comment 1",
                },
            }),
        } as unknown as DataSnapshot;

        setOutlays(myDbRef, snapshot);
        expect(store.getState().Outlays.outlays).toStrictEqual({
            "1": {
                id: "1",
                type: OutlayType.OUTLAY,
                date: "2024-07-10T10:00",
                sum: 299,
                category: "0",
                comment: "Test comment 1",
            },
        });
    });

    it("test onValue callback function for categories db", async () => {
        const myDbRef = {
            key: "child_test_key",
        } as unknown as DatabaseReference;

        let snapshot = {
            val: () => null,
        } as unknown as DataSnapshot;

        (set as jest.MockedFunction<typeof set>).mockReturnValue(Promise.resolve());

        setCategories(myDbRef, snapshot);
        expect(set).toHaveBeenCalled();

        snapshot = {
            val: () => ({
                0: {
                    id: "0",
                    name: "TEST1",
                    parent: null,
                },
            }),
        } as unknown as DataSnapshot;

        setCategories(myDbRef, snapshot);
        expect(store.getState().Categories.categories).toStrictEqual({
            0: {
                id: "0",
                name: "TEST1",
                parent: null,
            },
        });
    });

    it("test get dbReference", () => {
        const myDbRef = {
            key: "test_key",
        } as unknown as DatabaseReference;
        (child as jest.MockedFunction<typeof child>).mockReturnValue(myDbRef);

        let received = categoriesDbReference(store.getState());
        expect(child).toHaveBeenCalled();
        expect(received).toBe(null);

        store.dispatch(userSlice.actions.successAuth(user));
        received = categoriesDbReference(store.getState());
        expect(received?.key).toBe("test_key");
    });
});
