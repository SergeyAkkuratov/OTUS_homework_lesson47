import { User } from "firebase/auth";
import * as store from "./Store"
import { AuthStatus, UserState } from "./StoreTypes";


describe("Store", () => {
    const user: UserState = {
        status: AuthStatus.DONE,
        email: "test@test.com",
        uid: "test_uid"
    }

    it("test onUserConnect function", async () => {
        const authUser = {
            email: "test@test.com",
            uid: "test_uid"
        } as User;

        jest.spyOn(store, "dbConnect").mockReturnValue(Promise.resolve());

        await store.onUserConnect(authUser);
        expect(store.store.getState().User).toStrictEqual(user);
        await store.onUserConnect(authUser);
        expect(store.store.getState().User).toStrictEqual(user);
    })
})