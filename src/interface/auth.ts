interface LoginDto {
    email: string;
    password: string;
    keepMeLoggedIn: boolean;
}
export interface LoginResponse {
    access_token: string;
}
