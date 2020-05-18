import * as React from "react";
import {MessageBox} from "./MessageBox";
import { Guid } from "guid-typescript";
import * as Sockets from "./Sockets/Sockets";
import * as Data from "../../Data";
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
	constructor(props: Readonly<ChatProps>){
		super(props);
		this.state = {Messages: Array<Message>()};
		// sets a way to handle new messages coming in
		Sockets.AddOnMessageCallBack((soc, ev) => {
			let Message: Sockets.SocketJsonMessage = Sockets.GetJSONMessage(ev.data);
			if(Message.Type === Sockets.MessageType.ChatMessage && (Message.Data as Sockets.ChatMessageMessage).Chatroom === this.props.ChatId)
			{
				let data = Message.Data as Sockets.ChatMessageMessage;
				this.AddMessage({ User: data.User, Text: data.Text});
			}
		});
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