import * as React from "react";
import {MessageBox} from "./MessageBox";
import * as Sockets from "./Sockets/Sockets";
import { Guid } from "guid-typescript";
import "./ChatPanel.scss";

let proxyUrl = "https://cors-anywhere.herokuapp.com/";

export interface ChatPanelProps 
{
	// The Id of the chat
	ChatId: Guid;
}

interface ChatPanelState
{
	// the name of this chat
	Name: string;
}

// the chat panel
export class ChatPanel extends React.Component<ChatPanelProps, ChatPanelState>
{
	constructor(props: ChatPanelProps)
	{
		super(props);
		this.state = {Name: ""};
		// gets the data from the server in json format
		fetch(proxyUrl + "https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + props.ChatId + "/Data.json").
		then(response => response.json()).
		// stores the name in the state
		then(json => this.setState({ Name: json.Name}));
		Sockets.Init();
		Sockets.AddOnMessageCallBack((soc, ev) => {
			console.log(ev.data);
		});
	}

	// updates the state when new props are being received
	componentWillReceiveProps(nextProps: ChatPanelProps)
	{
		// TODO: caching to make load times faster
		fetch(proxyUrl + "https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + nextProps.ChatId + "/Data.json").
		then(response => response.json()).
		then(json => this.setState({ Name: json.Name}));
	}

	render()
	{
		return <div className="chatpanel">
			<div className="chattop">
				<h1>{this.state.Name }</h1>
			</div>
			<Chat ChatId = {this.props.ChatId}/>
			<MessageBox Name={this.state.Name}/>
		</div>;
	}
}

// a user
export class User
{
	// the users ID
	UserID: Number = 0;
	// the name of the user
	Username: string = "";
	// the profile picture of the user
	ProfilePicture: string = "0.png";
}

// a basic chat messages
export class Message
{
	// the user (or its id) who sent the message
	User: User | Number = 0;
	// the text of the message
	Text: string = "";
	// an url to an embedded file
	Embedded: string | null = null;
}

interface ChatProps
{
	// The Id of the chat
	ChatId: Guid;
}

interface ChatState
{
	// the list of messages
	Messages: Message[];
}

// the chat
class Chat extends React.Component<ChatProps, ChatState>
{
	constructor(props: ChatProps)
	{
		super(props)
		this.state = {Messages: Array<Message>()};
		// gets the data from the server in json format
		// TODO: get data from ChatPanel
		fetch(proxyUrl + "https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + props.ChatId + "/Data.json").
		then(response => response.json()).
		// stores the messages in the state
		then(json => this.setState({Messages: json.Messages}));
	}

	// updates the state when new props are being received
	componentWillReceiveProps(nextProps: ChatPanelProps)
	{
		// TODO: caching to make load times faster
		fetch(proxyUrl + "https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + nextProps.ChatId + "/Data.json").
		then(response => response.json()).
		then(json => this.setState({Messages: json.Messages}));
	}

	render()
	{
		return <div className="chat">
			<div className="messages">
				{this.state.Messages.map(value => <ChatMessage Message = {value} />)}
			</div>
		</div>
	}
}

interface ChatMessageProps
{
	// the chat message
	Message: Message;
}

// A message sent by the users
class ChatMessage extends React.Component<ChatMessageProps, {}>
{
	// all users that have sent a message
	static Users = Array<User>();
	// the user that sent this message
	User: User;
	constructor(props: ChatMessageProps)
	{
		super(props);
		// checks if the user is an id or an user object
		if(props.Message.User instanceof Object)
		{
			// checks if the user is in the array, and adds it if it isn't
			if(ChatMessage.Users.findIndex(x =>x.UserID == (props.Message.User as User).UserID) == -1)
				ChatMessage.Users.push(props.Message.User as User);
			this.User = props.Message.User as User;
			return;
		}
		// looks for the id in the previous users
		var user = ChatMessage.Users.find(x => x.UserID == props.Message.User);
		// checks if it found a user
		if(user !== undefined)
		{
			this.User = user;
			return;
		}
		// makes a new user
		this.User = new User();
		// TODO: aks the backend for the users data
	}

	render()
	{
		return <div className="message">
			<div className="avatar-container">
				{/* gets the users profile picture*/}
				<img src={"https://stud.hosted.hr.nl/0958956/ProjectD/Users/ProPic/" + this.User.ProfilePicture} className="avatar" draggable={false}/>
			</div>
			<div className="text-container">
				<div className="name">
					{this.User.Username}
				</div>
				<div className="text">
					{this.props.Message.Text}
				</div>
			</div>
		</div>
	}
}