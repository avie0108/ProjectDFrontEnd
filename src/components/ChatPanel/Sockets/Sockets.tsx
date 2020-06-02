import { SocketJsonMessage, CreateJSONMessage} from "./SocketDataTypes";
import { Server } from "../../../Data";

// the websocket used for communication
let Socket: WebSocket;

// if the websocket is initialized
let Initialized: boolean = false;

// the events that happens when the websocket receives a message
let OnMessageCallBacks: Array<(sock: WebSocket, ev: MessageEvent) => any> = Array<(sock: WebSocket, ev: MessageEvent) => any>();

// initializes the websockets
export async function Init()
{
	if(!Initialized)
	{
		Socket = new WebSocket(`ws://${Server}/chat`);
		Initialized = true;
		Socket.onclose = () => Initialized = false;
		Socket.onmessage = OnMessage;
		Socket.onerror = () => {Terminate(); Init();};
	}
}

// adds a new event that is called when the websocket gets data
export function AddOnMessageCallBack(callBack: ((sock: WebSocket, ev: MessageEvent) => any))
{
	OnMessageCallBacks.push(callBack);
}

// adds a new event that is called when the websocket gets data
export function RemoveOnMessageCallBack(callBack: ((sock: WebSocket, ev: MessageEvent) => any))
{
	let i = OnMessageCallBacks.indexOf(callBack);
	if(i > -1)
		OnMessageCallBacks.splice(i, 1);
}

// calls all the functions connected with this event
function OnMessage(this: WebSocket, ev: MessageEvent): any
{
	console.log(ev.data);
	OnMessageCallBacks.forEach(value =>{
		value(this, ev);
	});
}

// sends the message to the backend
export async function Send(message: SocketJsonMessage)
{
	let m: string = CreateJSONMessage(message);
	console.log(m);
	Socket.send(m);
}

// closes the socket and makes it ready to be reinitialized
export async function Terminate()
{
	if(Initialized)
		Socket.close();
}

export * from "./SocketDataTypes";
