import { Category } from "../store/Store.types";

export interface AuthReponse {
    login: string;
    email: string;
}

const testCategories: Category[] = [
    {
        id: "1",
        name: "Test1",
        parent: null
    },
    {
        id: "2",
        name: "Test2",
        parent: null
    },
    {
        id: "3",
        name: "Test3",
        parent: "2"
    },
    {
        id: "4",
        name: "Test4",
        parent: "3"
    },
    {
        id: "5",
        name: "Test5",
        parent: null
    },
    {
        id: "6",
        name: "Test6",
        parent: "5"
    },
];

export async function signIn(loggin: string, password: string, error: boolean = false): Promise<AuthReponse> {
    return new Promise<AuthReponse>((resolve, reject) => {
        error ? reject("New error") : resolve({login: "TEST", email: "test@mail.com"});
    });
}

export async function signUp(loggin: string, email: string, password: string, error: boolean = false): Promise<AuthReponse> {
    return new Promise<AuthReponse>((resolve, reject) => {
        error ? reject("New error") : resolve({login: "TEST", email: "test@mail.com"});
    });
}

export function getCategories(): Category[] {
    return testCategories;
}