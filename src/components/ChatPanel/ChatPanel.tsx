import * as React from "react";
import {MessageBox} from "./MessageBox";
import { Guid } from "guid-typescript";
import * as Sockets from "./Sockets/Sockets";
import * as Data from "../../Data";
import "./ChatPanel.scss";

export interface ChatPanelProps 
{
	// The Id of the chat
	ChatId: Guid;
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

export interface Message
{
	User: Guid;
	Text: string;
}

export interface ChatProps
{
	// The Id of the chat
	ChatId: Guid;
}

export interface ChatState
{
	Messages: Array<Message>;
}

export class Chat extends React.Component<ChatProps, ChatState>
{
	constructor(props: Readonly<ChatProps>){
		super(props);
		this.state = {Messages: Array<Message>()};
		Sockets.AddOnMessageCallBack((soc, ev) => {
			let Message:Sockets.ChatMessageMessage = Sockets.GetJSONMessage(ev.data).Data as Sockets.ChatMessageMessage;
			this.AddMessage({ User: Message.User, Text: Message.Text})
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

	AddMessage(message: Message)
	{
		this.state.Messages.push(message);
		this.forceUpdate();
	}
}

export interface ChatMessageProps
{
	Message: Message;
}

export class ChatMessage extends React.Component<ChatMessageProps, {}>
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