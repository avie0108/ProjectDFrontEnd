import { Guid } from "guid-typescript";
import { SocketJsonMessage, ChatInfoMessage, ChatMessageMessage, ChatStatusCode, MessageType, CreateJSONMessage} from "./SocketDataTypes";

// the websocket used for communication
let Socket: WebSocket;

// if the websocket is initialized
let Initialized: boolean = false;

// the events that happens when the websocket receives a message
let OnMessageCallBacks: ((sock: WebSocket, ev: MessageEvent) => any)[] = new Array<(sock: WebSocket, ev: MessageEvent) => any>();

// initializes the websockets
export async function Init()
{
	if(!Initialized)
	{
		Socket = new WebSocket("ws://192.168.1.105/chat");
		Initialized = true;
		Socket.onclose = () => Initialized = false;
		Socket.onmessage = OnMessage;
		AddOnMessageCallBack((s, ev) => console.log(ev.data));
	}
}

// adds a new event that is called when the websocket gets data
export function AddOnMessageCallBack(callBack: ((sock: WebSocket, ev: MessageEvent) => any))
{
	OnMessageCallBacks.push(callBack);
}

// calls all the functions connected with this event
function OnMessage(this: WebSocket, ev: MessageEvent): any
{
	OnMessageCallBacks.forEach(value =>{
		value(this, ev);
	});
}

// sends the message to the backend
export async function Send(message: SocketJsonMessage)
{
	let m: string = CreateJSONMessage(message);
	Socket.send(m);
}

// closes the socket and makes it ready to be reinitialized
export async function Terminate()
{
	if(Initialized)
		Socket.close();
}

export * from "./SocketDataTypes";