# app

This app is a browser-based todo list with a simple login system, using only HTML, CSS, and JavaScript with localStorage.

## Login and user data

- The app shows a login screen first, asking for a name and an email that must be a valid address ending with @gmail.com, checked via a simple email pattern plus an endsWith("@gmail.com") condition.
- On successful login, it saves the user object (name and email) in localStorage under a fixed key so the user is automatically recognized on the next visit.

## Task storage with localStorage

- Each user’s tasks are stored in localStorage using a key that includes their email, so different Gmail users can have their own separate task lists in the same browser.
- Tasks are kept in an array of objects and saved as JSON strings, then loaded and parsed on page load to repopulate the list even after closing or refreshing the tab.

## Core todo functionality

- Users can create tasks using an input and button; every task is stored with an id, text, and a completed flag for state management.
- The app renders tasks dynamically into a list, so any change (add, edit, delete, toggle complete) updates the in-memory array and then syncs back to localStorage.

## Edit, delete, and complete

- Each list item includes a checkbox to mark a task as complete; when checked, it sets completed to true and applies a CSS class that adds a line-through effect (text-decoration: line-through).
- Buttons on each task allow editing (via a prompt that updates the text) and deleting (filtering the task out of the array), with every action followed by saving the updated tasks and re-rendering the list.

## UX details and behavior

- A logout button lets the user return to the login screen while keeping previously saved user and task data intact in localStorage, so logging in again restores their list.
- Basic styling centers the app, uses card-like containers, and visually distinguishes completed tasks and buttons, providing a clean, beginner-friendly UI for practicing DOM and localStorage concepts.