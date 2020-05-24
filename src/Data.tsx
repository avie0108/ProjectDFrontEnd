import { Guid } from "guid-typescript";
import { User } from "./components/ChatPanel/Sockets/Sockets";
import { Message } from "./components/ChatPanel/ChatPanel";

//#region Users
// the known users
let Users: Array<User>;
// the currently logged in user
let CurrentUser: User;

// sets the known users
export function setUsers(users: Array<User>) { Users = users; }

// sets the current logged in user
export function setCurrentUser(user : User) { CurrentUser = user; }

// gets users
export function getUsers() { return Users; }

// gets the current user
export function getCurrentUser() { return CurrentUser }

// gets a user based on his guid
export function getUser(user: Guid) {return Users.find(x => x.ID.equals(user));}

//#endregion

//#region Chat
// the id's of all the last messages of the subscribed chatroom's
let LastMessage: Map<Guid, number> = new Map<Guid, number>();
// all loaded messages
let Messages: Map<Guid, Array<Message>> = new Map<Guid, Array<Message>>();

// sets the last message of a chatroom
export function setLastMessage(chatroomID: Guid, messageID: number) { LastMessage.set(chatroomID, messageID); }

// set the messages of a chatroom
export function setMessages(chatroomID: Guid, messages: Array<Message>) { Messages.set(chatroomID, messages); }

// adds a message to this chatroom's messages
export function addMessage(chatroomID: Guid, message: Message) { Messages.get(chatroomID)?.push(message) }

// gets the last message of the chatroom
export function getLastMessage(chatroomID: Guid) { return LastMessage.get(chatroomID)}

// gets the messages of a chatroom
export function getMessages(chatroomID: Guid) { return Messages.get(chatroomID); }
//#endregion

// the server name
export let Server: string = "192.168.1.105"
