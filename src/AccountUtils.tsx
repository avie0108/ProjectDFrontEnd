import { Server } from "../src/Data";

export var loggedInUser = getLoggedInUser();

// Gets the currently logged in user, or null if no user is logged in
export function getLoggedInUser() : any {
    let xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("GET", `http://${Server}/api/account?email=CurrentUser`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    try {
        return JSON.parse(xhttp.responseText)[0];
    } catch {
        return null;
    }
}

export function updateLoggedInUser() {
    loggedInUser = getLoggedInUser();
}

// Logs out the currently logged in user
export function logOut() {
    let xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("DELETE", `http://${Server}/api/login`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();

    updateLoggedInUser();
}