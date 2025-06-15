import { db } from "./src/lib/server/db/index"

console.log("Welcome to the Admin Panel");

console.log("Available Commands:");
console.log("1. Add User");
console.log("2. Remove User");
console.log("3. View Users");

let command = prompt("Enter a command (1-3): ");
switch (command) {
    case '1':
        addUser();
        break;
    case '2':
        console.log("Removing a user...");
        // Code to remove a user
        break;
    case '3':
        console.log("Viewing all users...");
        // Code to view users
        break;
    default:
        console.log("Invalid command. Please try again.");
}

function addUser() {
    let username = prompt("Enter username: ");
    let password = prompt("Enter password: ");

    console.log(`User ${username} added successfully with password ${password}.`);
}
