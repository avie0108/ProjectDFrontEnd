import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel, Message } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { FeedPanel } from "./components/FeedPanel/FeedPanel";
import { Guid } from "guid-typescript";
import { LoginPanel } from "./components/LoginPanel/LoginPanel";
import * as Socket from "./components/ChatPanel/Sockets/Sockets";

interface AppState
{
	// The currently selected panel if panel is a number that number is then the chat id
	CurrentPanel: { ID: Guid | "Feed", Name?: string};
	// The name of the current Panel

	// SidePanel chats
	SidePanelChats: Array<{ID: Guid, Name: string}>;
}

// The app
class App extends React.Component<{},AppState>
{
	constructor(props: object)
	{
		super(props)
		this.state = {CurrentPanel: { ID: "Feed" }, SidePanelChats: new Array()};
	}

	render()
	{
		return <div>
			<SidePanel CallBack={(guid, name) => this.setState({CurrentPanel: { ID: guid, Name: name }})} Chats={this.state.SidePanelChats}/>
			<LoginPanel LogedIn={() => this.onLogedIn()}/>
			{/* Decides wether it should render feed or a chat. */}
			{this.ChoosePanel() }
		</div>
	}

	/*
	* Decides wether it should render feed or a chat.
	* This is decided based on the CurrentPanel in the state.
	* If current panel is "Feed" it will render the feed else it will render the chat with the id of CurrentPanel.
	*/
	ChoosePanel()
	{
		if(this.state.CurrentPanel.ID === "Feed")
			return <FeedPanel/>
		return <ChatPanel ChatId = {this.state.CurrentPanel.ID as Guid} Name={this.state.CurrentPanel.Name ?? ""}/>
	}

	onLogedIn(){
		Socket.Init();
		Socket.AddOnMessageCallBack((soc, ev) => this.onSocketMessage(soc, ev));
	}

	onSocketMessage(soc: WebSocket, ev: MessageEvent)
	{
		let Message: Socket.SocketJsonMessage = Socket.GetJsonMessage(ev.data);
		if(Message.Type != Socket.MessageType.ChatroomUpdate)
			return;
		let sidePanelData: Array<{ID: Guid, Name: string}> = new Array<{ID: Guid, Name: string}>();
		Message.Data.forEach(v => sidePanelData.push({ID: v.ID, Name: v.Name}));
		this.setState({...this.state, SidePanelChats: sidePanelData});
	}
}

// renders the page
ReactDom.render(
	<App/>,
	document.getElementById("root")
);
