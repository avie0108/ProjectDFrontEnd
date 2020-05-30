import { Guid } from "guid-typescript";

// the basic socket message
export interface SocketJsonMessage
{
	MessageID: Guid;
	Type?: MessageType;
	Data: ChatData;
	StatusCode?: ChatStatusCode;
	Command: ChatCommand | null;
};

// the commands available to us
export type ChatCommand = "ChangeUserStatus" | "ChatHistory" | "CreateChatroom" | "DeleteChatroom" | "EditChatroom" | "ChatMessage";
// the types that data can be in a socket message
export type ChatData = ChatInfoMessage | ChatMessageMessage | SentChatMessageMessage | User | SentChatHistory
| CreateChatroom | DeleteChatroom | Array<ChatMessageMessage>;

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

// the message that will be used to request chat history
export interface SentChatHistory{
	ChatroomID : Guid;
	Start: number;
	Amount: number;
}

// the message that will be used to recieve chat messages
export interface ChatMessageMessage
{
	ID: number;
	User: Guid;
	Chatroom: Guid;
	Date: Date;
	Text: string;
};

// the message that will be used to create a new chatroom
export interface CreateChatroom
{
	Name: string;
	Private: boolean;
}

export interface DeleteChatroom
{
	ChatroomID: Guid;
}

// a basic chatroom
export interface Chatroom
{
	Name: string;
	Private: boolean;
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
	// the system will never announce shit apparently

	//We were good boys. (200-299)
	OK = 200,

	//We tried to access something we don't have permissions for (300-399)
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

// gets the JSON message from a string
// why not JSON.parse? simple guid won't work that way and enums
export function GetJSONMessage(message: string): SocketJsonMessage
{
	let json = JSON.parse(message.replace(/\0/g, ''));
	// set the basic values
	let real: SocketJsonMessage = json;
	real.MessageID = Guid.parse(json.MessageID);
	real.Type = MessageType[json.Type] as any;
	
	// because the backend doesn't know what to use to tell us what kind of data they're sending we have to do this bs
	// WHY DON'T YOU GUYS STANDARDIZE SHIT?!?!?!?!?!?!?!?
	if(real.Command === null)
		// set data based on the type of the message
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
				break;
			case MessageType.ChatroomCreated:
				(real.Data as Chatroom).ID = Guid.parse(json.Data.ID);
				let nUsers =  Array<Guid>();
				(json.Data.Users as Array<string>).forEach(v => nUsers.push(Guid.parse(v)));
				(real.Data as Chatroom).Users = nUsers;
				break;
			case MessageType.ChatroomDeleted:
				console.log(Guid.parse(json.Data));
				let x: Guid = Guid.parse(json.Data.replace(/\"/g, ''));
				console.log(x);
				(real.Data as DeleteChatroom).ChatroomID = Guid.parse(x.toString());
				break;
		}
	else
		switch(real.Command)
		{
			case "ChatHistory":
				let messages: Array<ChatMessageMessage> = Array<ChatMessageMessage>();
				(json.Data as Array<any>).forEach(x =>
					messages.push({...x, User: Guid.parse(x.User), Chatroom: Guid.parse(x.Chatroom), Date: new Date(x.Date)}));
				real.Data = messages
		}
	return real;
}

// creates a JSON message
export function CreateJSONMessage(message: SocketJsonMessage): string
{
	let js: any = message;
	js.MessageID = message.MessageID.toString();
	switch(message.Command)
	{
		case "ChatMessage":
			js.Data = message.Data;
			js.Data.ChatroomID = (message.Data as SentChatMessageMessage).ChatroomID.toString();
			break;
		case "ChatHistory":
			js.Data.ChatroomID = (message.Data as SentChatHistory).ChatroomID.toString();
		case "DeleteChatroom":
			js.Data.ChatroomID = (message.Data as DeleteChatroom).ChatroomID.toString();

	}
	return JSON.stringify(js);
}

// fix inconsistencies in data
function GetChatInfoMessage(Data: any): ChatInfoMessage
{
	let cIData: ChatInfoMessage = Data;

	// fix the Chat rooms
	let nChatrooms = Array<Chatroom>();
	(Data.Chatrooms as Array<any>).forEach(v =>{
		let nUsers =  Array<Guid>();
		(v.Users as Array<string>).forEach(v => nUsers.push(Guid.parse(v)));
		nChatrooms.push({...v, ID: Guid.parse(v.ID), Users: nUsers, LastMessage: v.LastMessage ?? 1});
	});
	cIData.Chatrooms = nChatrooms;
	// converts the ID of the current User
	cIData.CurrentUser.ID = Guid.parse(Data.CurrentUser.ID);

	// converts the Users
	let nUsers = Array<User>();
	(Data.Users as Array<any>).forEach(v => nUsers.push({...v, ID: Guid.parse(v.ID)}));
	cIData.Users = nUsers;

	return cIData;
}
