import { DatabaseReference, DataSnapshot } from "firebase/database";

export enum OutlayType {
    OUTLAY = "OUTLAY",
    INCOME = "INCOME",
}

export enum AuthStatus {
    NOT_DONE = "NOT_DONE",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface Category {
    id: string;
    name: string;
    parent: string | null;
}

export interface Categories {
    [id: string]: Category;
}

export interface Outlay {
    id: string;
    type: OutlayType;
    date: string;
    sum: number;
    category: string;
    comment: string;
}

export interface Outlays {
    [id: string]: Outlay;
}

export interface UserState {
    status: AuthStatus;
    email: string | null;
    uid: string | null;
}

export interface OutlaysState {
    outlays: Outlays;
}

export interface CategoriesState {
    categories: Categories;
}

export interface IOnValueFunction {
    (dbRef: DatabaseReference, snapshot: DataSnapshot): Promise<void>;
}
