import net from 'net';
import { Guid } from 'guid-typescript';

let Socket: WebSocket;

let Initialized: boolean = false;

let OnMessageCallBacks: ((sock: WebSocket, ev: MessageEvent) => any)[] = new Array<(sock: WebSocket, ev: MessageEvent) => any>();

export async function Init()
{
	if(!Initialized)
	{
		Socket = new WebSocket("ws://192.168.1.105/chat");
		Initialized = true;
		Socket.onclose = () => Initialized = false;
		Socket.onmessage = OnMessage;
	}
}

export function AddOnMessageCallBack(callBack: ((sock: WebSocket, ev: MessageEvent) => any))
{
	OnMessageCallBacks.push(callBack);
}

function OnMessage(this: WebSocket, ev: MessageEvent): any
{
	OnMessageCallBacks.forEach(value =>{
		value(this, ev);
	});
}

export async function Send(message: string | any)
{
	if(typeof message === "string")
		Socket.send(message);
	else
		Socket.send(JSON.stringify(message));
}


export async function Terminate()
{
	if(Initialized)
		Socket.close();
}

export interface SocketJsonMessage
{
	MessageID: Guid;
	Type: MessageType;
	Data: Array<ChatroomUpdateMessage>;
	StatusCode: ChatStatusCode;
	Command: string | null;
}

export interface ChatroomUpdateMessage
{
	Name: string;
	Private: boolean;
	ID: Guid;
	LastMessage: number | null;
}

export function GetJsonMessage(message: string): SocketJsonMessage
{
	let JsonMessage = JSON.parse(message.replace(/\0/g, ''));
	JsonMessage.MessageID = Guid.parse(JsonMessage.MessageID);
	JsonMessage.Type = MessageType[JsonMessage.Type];
	return JsonMessage;
}

export enum MessageType
{
	//General
	InvalidMessage,

	//Chat
	Chat,
	ChatroomUpdate,
	ChatMessage,
}

export enum ChatStatusCode
{
	//System announcements (100-199)

	//The client was a good boy. (200-299)
	OK = 200,

	//The client tried to access something it doesn't have permission for (300-399)
	ChatroomAccessDenied = 300,
	CommandAccessDenied = 301,

	//We fucked up. (400-499)
	BadMessageType = 400,
	BadMessageData = 401,
	NoSuchChatroom = 402,
	AlreadyExists = 403,

	//The server fucked up. (500-599)
	InternalServerError = 500,
}