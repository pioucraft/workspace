import { user } from './src/lib/server/db/schema';

import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './src/lib/server/db/schema';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });

console.log('Welcome to the Admin Panel');

console.log('Available Commands:');
console.log('1. Add User');
console.log('2. Remove User');
console.log('3. View Users');

let command = prompt('Enter a command (1-3): ');
switch (command) {
	case '1':
		addUser();
		break;
	case '2':
		console.log('Removing a user...');
		removeUser();
		break;
	case '3':
		console.log('Viewing all users...');
		viewUsers();
		break;
	default:
		console.log('Invalid command. Please try again.');
}

async function addUser() {
	let username = prompt('Enter username: ') ?? '';
	let password = prompt('Enter password: ') ?? '';

	let passwordHash = await Bun.password.hash(password);

	await db.insert(user).values({
		name: username,
		passwordHash: passwordHash
	});

	console.log(`User ${username} added successfully.`);
	process.exit(0);
}

async function viewUsers() {
	const users = await db.select().from(user);
	console.log('Current Users:');
	users.forEach((u) => {
		console.log(`- username: ${u.name} with id: ${u.id}`);
	});
	process.exit(0);
}

async function removeUser() {
	let id = prompt('Enter user ID to remove: ') ?? '';
	await db.delete(user).where(eq(user.id, id));
	console.log(`User with ID ${id} removed successfully.`);
	process.exit(0);
}
