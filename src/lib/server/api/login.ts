import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";

export async function login(username: string, password: string): Promise<boolean> {
   let storedPasswordHash = await db.select({passwordHash: user.passwordHash}).from(user).where(eq(user.name, username)) 
        .then(result => result[0]?.passwordHash);
    if (!storedPasswordHash) {
        return false; // User not found
    }
    return await Bun.password.verify(password, storedPasswordHash)
}

export async function loginMiddleware(request: Request): Promise<boolean> {
    const username = request.headers.get("username");
    const password = request.headers.get("password");

    if (!username || !password) {
        return false; // Missing credentials
    }

    return await login(username, password);
}
