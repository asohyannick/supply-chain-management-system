export interface IProfile {
    id:string | number;
    firstName: string;
    lastName: string;
    email: string;
    address:{
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    }
    hobbies: string[];
    salary: number;
    carrier:string;
    date:Date;
}