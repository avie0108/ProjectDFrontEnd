import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { FeedPanel } from "./components/FeedPanel/FeedPanel";
import { Guid } from "guid-typescript";
import { LoginPanel } from "./components/LoginPanel/LoginPanel";
import { SettingsPanel, Theme } from "./components/Settings/Settings";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import * as Socket from "./components/ChatPanel/Sockets/Sockets";
import * as Data from "./Data";
import * as Settings from "./components/Settings/Settings";

interface AppState
{
	// The currently selected panel if panel is a number that number is then the chat id
	CurrentPanel: { ID: Guid | "Feed", Name?: string};
	// SidePanel chats
	SidePanelChats: Array<{ID: Guid, Name: string}>;
	// The current theme
	Theme: Theme;
}

// The app
class App extends React.Component<{},AppState>
{

	SettingsRef: React.RefObject<SettingsPanel>;
	AdminRef: React.RefObject<AdminPanel>;

	constructor(props: object)
	{
		super(props)
		this.SettingsRef = React.createRef<SettingsPanel>();
		this.AdminRef = React.createRef<AdminPanel>();
		Settings.AddOnSettingChangedCallBack((s, v) => this.onSettingChanged(s, v))
		this.state = {CurrentPanel: { ID: "Feed" }, SidePanelChats: Array<{ID: Guid, Name: string}>(), Theme: Settings.GetSetting("Theme")};
	}

	render()
	{
		return <div data-theme={this.state.Theme}>
			<SidePanel CallBack={(guid, name) => this.SidePanelCallBack(guid, name)} Chats={this.state.SidePanelChats}/>
			<LoginPanel LogedIn={() => this.onLogedIn()}/>
			<SettingsPanel ref={this.SettingsRef}/>
			{Data.getCurrentUser()?.PermissionLevel ? <AdminPanel ref={this.AdminRef}/> : null }
			{/* Decides wether it should render feed or a chat. */}
			{this.ChoosePanel() }
		</div>
	}

	// handle what happens when a button in the side panel is clicked
	SidePanelCallBack(id: Guid | "Feed" | "Settings" | "Admin", name?: string)
	{
		if(id !== "Settings" && id !== "Admin")
			this.setState({CurrentPanel: { ID: id, Name: name }});
		else if(id === "Settings")
			this.SettingsRef.current?.Show();
		else 
			this.AdminRef.current?.Show();
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

	// create a websocket connection when logging in
	onLogedIn(){
		Socket.AddOnMessageCallBack((soc, ev) => this.onSocketMessage(soc, ev));
		Socket.Init();
	}

	// handle incoming socket messages
	onSocketMessage(soc: WebSocket, ev: MessageEvent)
	{
		let message: Socket.SocketJsonMessage = Socket.GetJSONMessage(ev.data);
		console.log(message);
		if(message.Command == null)
		{
			switch (message.Type) 
			{
			case Socket.MessageType.ChatInfo:
				this.onChatInfo(message.Data as Socket.ChatInfoMessage);
				break;
			case Socket.MessageType.ChatroomCreated:
				this.onChatroomCreated(message.Data as Socket.Chatroom);
				break;
			case Socket.MessageType.ChatroomDeleted:
				this.onChatroomDeleted(message.Data as Socket.DeleteChatroom);
				break;
			}
		}
	}

	onChatroomCreated(data: Socket.Chatroom)
	{
		Data.addChatroom(data)
		this.state.SidePanelChats.push({ID: data.ID, Name: data.Name});
		this.forceUpdate();
	}

	onChatroomDeleted(data: Socket.DeleteChatroom)
	{
		Data.deleteChatroom(data.ChatroomID);
		let i = this.state.SidePanelChats.findIndex(x=> x.ID.equals(data.ChatroomID));
		if( i < 0)
			return;
		console.log("kill: " + i)
		this.state.SidePanelChats.splice(i, 1);
		this.forceUpdate();
	}

	// handle when a Chat info websocket is received
	onChatInfo(data: Socket.ChatInfoMessage)
	{
		let newSidePanelChats: Array<{ID: Guid, Name: string}> = Array<{ID: Guid, Name: string}>();
		
		// initialize Data
		data.Chatrooms.forEach(v => {
			newSidePanelChats.push({ID: v.ID, Name: v.Name});
			Data.setLastMessage(v.ID, v.LastMessage ?? 0)
		});
		Data.setChatrooms(data.Chatrooms);
		Data.setCurrentUser(data.CurrentUser);
		Data.setUsers(data.Users);
		
		// set this state
		this.setState({...this.state, SidePanelChats: newSidePanelChats});
	}

	// handle setting changes
	onSettingChanged(name: Settings.Settings, value: any)
	{
		if(name === "Theme")
			this.setState({...this.state, Theme: value});
	}
}

// initialize the settings
Settings.Init();

// renders the page
ReactDom.render(
	<App/>,
	document.getElementById("root")
);
