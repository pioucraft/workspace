import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
});
