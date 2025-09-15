export type Role = "production" | "creator" | "investor" | "brand" | "admin";


export type Credentials = { email: string; password: string };


export type Session = {
ok: boolean;
email?: string;
role?: Role;
};