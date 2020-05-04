import net from 'net';

let Socket: WebSocket;

let Initialized: boolean = false;

let OnMessageCallBacks: ((sock: WebSocket, ev: MessageEvent) => any)[] = new Array<(sock: WebSocket, ev: MessageEvent) => any>();

export async function Init()
{
	if(!Initialized)
	{
		Socket = new WebSocket("ws://192.168.1.105/chat", "WebSocket");
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