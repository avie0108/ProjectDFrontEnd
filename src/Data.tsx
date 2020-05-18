import { Guid } from "guid-typescript";
import { User } from "./components/ChatPanel/Sockets/Sockets";
import { Message } from "./components/ChatPanel/ChatPanel";

//#region Users
let Users: Array<User>;
let CurrentUser: User;

export function setUsers(users: Array<User>) { Users = users; }

export function setCurrentUser(user : User) { CurrentUser = user; }

export function getUsers() { return Users; }

export function getCurrentUser() { return CurrentUser }

export function getUser(user: Guid) {return Users.find(x => x.ID.equals(user));}

//#endregion

//#region Chat
let LastMessage: Map<Guid, number> = new Map<Guid, number>();
let Messages: Map<Guid, Array<Message>> = new Map<Guid, Array<Message>>();

export function setLastMessage(chatroomID: Guid, messageID: number) { LastMessage.set(chatroomID, messageID); }

export function setMessages(chatroomID: Guid, messages: Array<Message>) { Messages.set(chatroomID, messages); }

export function addMessage(chatroomID: Guid, message: Message) { Messages.get(chatroomID)?.push(message) }

export function getLastMessage(chatroomID: Guid) { return LastMessage.get(chatroomID)}

export function getMessages(chatroomID: Guid) { return Messages.get(chatroomID); }
//#endregion
