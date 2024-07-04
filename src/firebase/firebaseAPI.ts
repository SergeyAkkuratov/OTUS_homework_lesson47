export interface AuthReponse {
    login: string;
    email: string;
}

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