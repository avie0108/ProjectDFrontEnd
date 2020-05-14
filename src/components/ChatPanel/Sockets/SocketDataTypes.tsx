import { Guid } from "guid-typescript";

// the basic socket message
export interface SocketJsonMessage
{
	MessageID: Guid;
	Type: MessageType;
	Data: ChatInfoMessage | ChatMessageMessage | SentChatMessageMessage | User;
	StatusCode?: ChatStatusCode;
	Command: string | null;
};

// the message that the backend sends to update chat info
export interface ChatInfoMessage
{
	Chatrooms: Array<Chatroom>;
	CurrentUser: User;
	Users: Array<User>;
};

// the message that will be used to sent chat messages
export interface SentChatMessageMessage
{
	ChatroomID : Guid;
	MessageText: string;
};

export interface ChatMessageMessage
{
	ID: number;
	User: Guid;
	Chatroom: Guid;
	Date: Date;
	Text: string;
};

// a basic chatroom
export interface Chatroom
{
	Name: string;
	Private: false;
	ID: Guid;
	LastMessage: number | null;
	Users: Array<Guid>;
};

// a basic user
export interface User
{
	ID: Guid;
	Username: string | null;
	PermissionLevel: number;
	Status?: UserStatus;
};

// the status a user can have
export enum UserStatus
{
	Online,
	Busy,
	Away,
	Offline,
};

// all types of messages that the front end knows
export enum MessageType
{
	//General
	InvalidMessage,

	//Chat		
	ChatInfo,
	ChatroomCreated,
	ChatroomUpdated,
	ChatroomDeleted,
	ChatMessage,
	UserStatusChanged,
	UserInfo,
};

// the status codes that the backend can send
export enum ChatStatusCode
{
	//System announcements (100-199)

	//We were good boys. (200-299)
	OK = 200,

	//We tried to access something we don't have permission for (300-399)
	ChatroomAccessDenied = 300,
	CommandAccessDenied = 301,

	//We fucked up. (400-499)
	BadMessageType = 400,
	BadMessageData = 401,
	NoSuchChatroom = 402,
	AlreadyExists = 403,

	//The server fucked up. (500-599)
	InternalServerError = 500,
};

export function GetJSONMessage(message: string): SocketJsonMessage
{
	let json = JSON.parse(message.replace(/\0/g, ''));
	
	let real: SocketJsonMessage = json;
	real.MessageID = Guid.parse(json.MessageID);
	real.Type = MessageType[json.Type] as any;
	switch(real.Type)
	{
		case MessageType.UserStatusChanged:
			(real.Data as User).ID = Guid.parse(json.Data.ID);
			break;
		case MessageType.ChatInfo:
			real.Data = GetChatInfoMessage(json.Data);
			break;
		case MessageType.ChatMessage:
			(real.Data as ChatMessageMessage).User = Guid.parse(json.Data.User);
			(real.Data as ChatMessageMessage).Chatroom = Guid.parse(json.Data.Chatroom);
			(real.Data as ChatMessageMessage).Date = new Date(json.Data.Date);

	}
	return real;
}

export function CreateJSONMessage(message: SocketJsonMessage): string
{
	let js: any = message;
	js.MessageID = message.MessageID.toString();
	switch(message.Type)
	{
		case MessageType.ChatMessage:
			js.Data = message.Data;
			js.Data.ChatroomID = (message.Data as SentChatMessageMessage).ChatroomID.toString();
	}
	return JSON.stringify(js);
}

function GetChatInfoMessage(Data: any): ChatInfoMessage
{
	let cIData: ChatInfoMessage = Data;

	// fix the Chat rooms
	let nChatrooms = Array<Chatroom>();
	(Data.Chatrooms as Array<any>).forEach(v =>{
		let nChatroom: Chatroom = v;
		nChatroom.ID = Guid.parse(v.ID);
		let nUsers =  Array<Guid>();
		(v.Users as Array<string>).forEach(v => nUsers.push(Guid.parse(v)));
		nChatroom.Users = nUsers;
		nChatrooms.push(nChatroom);
	});
	cIData.Chatrooms = nChatrooms;
	// converts the ID of the current User
	cIData.CurrentUser.ID = Guid.parse(Data.CurrentUser.ID);

	// converts the Users
	let nUsers = Array<User>();
	(Data.Users as Array<any>).forEach(v =>{
		let nUser: User = v;
		nUser.ID = Guid.parse(v.ID);
		nUsers.push(nUser);
	});
	cIData.Users = nUsers;

	return cIData;
}