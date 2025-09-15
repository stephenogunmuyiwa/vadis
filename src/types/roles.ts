import { Role } from "./session";


export const ROLES: Role[] = ["production", "creator", "investor", "brand", "admin"];
export const isRole = (r: string | undefined | null): r is Role => (!!r && (ROLES as string[]).includes(r));
export const getRoleHome = (role: Role) => `/${role}`;