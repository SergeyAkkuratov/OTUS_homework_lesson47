export enum OutlayType {
    OUTLAY = "OUTLAY",
    INCOME = "INCOME"
}

export enum AuthStatus {
    NOT_DONE = "NOT_DONE",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export interface Outlay {
    id: string;
    date: string;
    comment: string;
    sum: number;
    type: OutlayType;
    category: string;
}

export interface UserState {
    status: AuthStatus;
    login: string | null;
    email: string | null;
}

export interface OutlaysState {
    connected: boolean;
    outlays: Outlay[];
}