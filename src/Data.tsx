import { Guid } from "guid-typescript";
import { User, Chatroom } from "./components/ChatPanel/Sockets/Sockets";
import { Message } from "./components/ChatPanel/ChatPanel";

//#region Users
// the known users
let Users: Array<User> = new Array<User>();
// the currently logged in user
let CurrentUser: User | undefined;

// sets the known users
export function setUsers(users: Array<User>) { Users = users; }

// adds a user to the known users
export function AddUser(user: User) { Users.push(user);}

// sets the current logged in user
export function setCurrentUser(user : User) { CurrentUser = user; }

// gets users
export function getUsers() { return Users; }

// gets the current user
export function getCurrentUser() { return CurrentUser }

// gets a user based on his guid
export function getUser(user: Guid) { return Users.find(x => x.ID.equals(user)); }

// removes a user
export function removeUser(user: Guid)
{
	let i = Users.findIndex(x=> x.ID.equals(user));
	if( i > -1)
		Users.splice(i, 1);
}

// updates this user
export function updateUser(user: User)
{
	let i = Users.findIndex(x => x.ID.equals(user.ID));
	if(i > -1)
		Users[i] = user;
	else
	Users.push(user);
}

//#endregion

//#region Chat
// the known chatrooms
let Chatrooms: Array<Chatroom> = new Array<Chatroom>();

// the id's of all the last messages of the subscribed chatroom's
let LastMessage: Map<Guid, number> = new Map<Guid, number>();
// all loaded messages
let Messages: Map<Guid, Array<Message>> = new Map<Guid, Array<Message>>();

// sets the known chatroom's
export function setChatrooms(chatrooms: Array<Chatroom>) { Chatrooms = chatrooms; }

// adds a new chatroom to the known chatroom's
export function addChatroom(chatroom: Chatroom) { Chatrooms.push(chatroom); }

// gets the known chatroom's
export function getChatrooms() { return Chatrooms; }

// gets the known chatroom's
export function getChatroom(ID: Guid) { return Chatrooms.find(x=> x.ID.equals(ID)); }

// updates the specified chatroom
export function updateChatroom(chatroom: Chatroom)
{
	console.log(Chatrooms);
	let i = Chatrooms.findIndex(x => x.ID.equals(chatroom.ID));
	if(i > -1)
		Chatrooms[i] = chatroom;
	else
	Chatrooms.push(chatroom);
}

// remove the chatroom's
export function deleteChatroom(ID: Guid) 
{
	let i = Chatrooms.findIndex(x=> x.ID.equals(ID));
	if( i > -1)
		Chatrooms.splice(i, 1);
}

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
export let Server: string = "localhost"

// resets all the data in this module
export function resetData()
{
	Users = new Array<User>();
	CurrentUser = undefined;
	
	Chatrooms = new Array<Chatroom>();
	LastMessage = new Map<Guid, number>();
	Messages = new Map<Guid, Array<Message>>();
}
