import * as React from "react";
import {MessageBox} from "./MessageBox";
import { Guid } from "guid-typescript";
import * as Sockets from "./Sockets/Sockets";
import * as Data from "../../Data";
import { ChatMessageMessage } from "./Sockets/Sockets";
import "./ChatPanel.scss";

export interface ChatPanelProps 
{
	// the Id of the chat
	ChatId: Guid;
	// the name of the current chat
	Name: string;
}

// the chat panel
export class ChatPanel extends React.Component<ChatPanelProps, {}>
{
	ChatRef: React.RefObject<Chat>;

	constructor(props: ChatPanelProps)
	{
		super(props);
		this.ChatRef = React.createRef<Chat>();
	}

	render()
	{
		return <div className="chatpanel">
			<div className="chattop">
				<h1>{this.props.Name }</h1>
			</div>
			<Chat ChatId = {this.props.ChatId} ref={this.ChatRef}/>
			<MessageBox Name={this.props.Name} Room={this.props.ChatId}/>
		</div>;
	}
}

// a basic message
export interface Message
{
	User: Guid;
	Text: string;
}

interface ChatProps
{
	// The Id of the chat
	ChatId: Guid;
}

interface ChatState
{
	// all the messages sent in this chatroom
	Messages: Array<Message>;
}

// the chat to be rendered
class Chat extends React.Component<ChatProps, ChatState>
{
	messageCallBack: (sock: WebSocket, ev: MessageEvent) => any;

	constructor(props: Readonly<ChatProps>)
	{
		super(props);
		this.messageCallBack = (soc, ev) => this.OnMessageCallBack(ev.data);
		Sockets.AddOnMessageCallBack(this.messageCallBack);
		let messages = Data.getMessages(props.ChatId);
		console.log()
		if(messages === undefined)
		{
			Sockets.Send({
				MessageID: Guid.create(),
				Command: "ChatHistory",
				Data: {
					ChatroomID: props.ChatId,
					Start: Data.getLastMessage(props.ChatId) ?? 1,
					Amount: 50
				}
			});
			this.state = {Messages: Array<Message>()};
		}
		else
		{
			this.state = {Messages: messages};
		}
	}

	componentWillUnmount(){
		Sockets.RemoveOnMessageCallBack(this.messageCallBack);
	}

	render()
	{
		return <div className="chat">
			<div className="messages">
				{this.state.Messages.map(value => <ChatMessage Message = {value} />)}
			</div>
		</div>
	}

	// adds a new message to be rendered
	AddMessage(message: Message)
	{
		this.state.Messages.push(message);
		this.forceUpdate();
	}

	// handles new messages coming in
	OnMessageCallBack(data: any){
		let Message: Sockets.SocketJsonMessage = Sockets.GetJSONMessage(data);
		if(Message.Command === "ChatHistory")
		{
			let data = Message.Data as Array<ChatMessageMessage>;
			if(data.length !== 0)
				if(data[0].Chatroom.equals(this.props.ChatId))
				{
					let messages: Array<Message> = Array<Message>();
					data.forEach(x => messages.push({User: x.User, Text: x.Text}))
					Data.setMessages(this.props.ChatId, messages);
					this.setState({Messages: messages});
				}
		}
		else if(Message.Type === Sockets.MessageType.ChatMessage && (Message.Data as Sockets.ChatMessageMessage).Chatroom.equals(this.props.ChatId))
		{
			let data = Message.Data as Sockets.ChatMessageMessage;
			this.AddMessage({ User: data.User, Text: data.Text});
		}
	}
}

interface ChatMessageProps
{
	// the message to be rendered
	Message: Message;
}

// a chat message
class ChatMessage extends React.Component<ChatMessageProps, {}>
{
	render()
	{
		return <div className="message">
		<div className="text-container">
			<div className="name">
				{Data.getUser(this.props.Message.User)?.Username}
			</div>
			<div className="text">
				{this.props.Message.Text}
			</div>
		</div>
	</div>;
	}
}