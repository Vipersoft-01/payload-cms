import { User } from "payload/auth";

export function checkRole(roles: string[], user: User): boolean {
    if (user && roles.find(r => user.roles.includes(r))) {
        return true;
    }
}