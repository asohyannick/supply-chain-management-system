export interface IUser {
    id: number | string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    refreshToken: string;
}