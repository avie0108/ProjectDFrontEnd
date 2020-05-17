import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { FeedPanel } from "./components/FeedPanel/FeedPanel";
import { Guid } from "guid-typescript";
import { LoginPanel } from "./components/LoginPanel/LoginPanel";
import * as Socket from "./components/ChatPanel/Sockets/Sockets";
import * as Data from "./Data";

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
		this.state = {CurrentPanel: { ID: "Feed" }, SidePanelChats: Array<{ID: Guid, Name: string}>()};
	}

	render()
	{
		return <div data-theme="light">
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
		Socket.AddOnMessageCallBack((soc, ev) => this.onSocketMessage(soc, ev));
		Socket.Init();
	}

	onSocketMessage(soc: WebSocket, ev: MessageEvent)
	{
		let message: Socket.SocketJsonMessage = Socket.GetJSONMessage(ev.data);
		if(message.Type !== Socket.MessageType.ChatInfo)
			return;
		let newSidePanelChats: Array<{ID: Guid, Name: string}> = Array<{ID: Guid, Name: string}>();
		(message.Data as Socket.ChatInfoMessage).Chatrooms.forEach(v => {
			newSidePanelChats.push({ID: v.ID, Name: v.Name});
			Data.setLastMessage(v.ID, v.LastMessage ?? 0)
		});
		Data.setCurrentUser((message.Data as Socket.ChatInfoMessage).CurrentUser);
		Data.setUsers((message.Data as Socket.ChatInfoMessage).Users);
		this.setState({...this.state, SidePanelChats: newSidePanelChats});
	}
}

// renders the page
ReactDom.render(
	<App/>,
	document.getElementById("root")
);
