import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { FeedPanel } from "./components/FeedPanel/FeedPanel";
import { Guid } from "guid-typescript";
import { SettingsPanel, Theme} from "./components/Settings/Settings";
import { RegisterPanel } from "./components/RegisterPanel/RegisterPanel";
import * as Socket from "./components/ChatPanel/Sockets/Sockets";
import * as Data from "./Data";
import * as Settings from "./components/Settings/Settings";
import { StatusBar } from "./components/StatusBar/StatusBar";

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
	StatusBar: React.RefObject<StatusBar>;
	SettingsRef: React.RefObject<SettingsPanel>;
	RegisterRef: React.RefObject<RegisterPanel>;

	constructor(props: object)
	{
		super(props);
		this.StatusBar = React.createRef<StatusBar>();
		this.SettingsRef = React.createRef<SettingsPanel>();
		this.RegisterRef = React.createRef<RegisterPanel>();

		Settings.AddOnSettingChangedCallBack((s, v) => this.onSettingChanged(s, v))
		this.state = {CurrentPanel: { ID: "Feed" }, SidePanelChats: Array<{ID: Guid, Name: string}>(), Theme: Settings.GetSetting("Theme")};
	}

	render()
	{
		return <div data-theme={this.state.Theme}>
			<StatusBar LogedIn={() => this.onLogedIn()} ref={this.StatusBar}/>

			<SidePanel CallBack={(guid, name) => this.SidePanelCallBack(guid, name)} Chats={this.state.SidePanelChats}/>
			<SettingsPanel ref={this.SettingsRef}/>
			<RegisterPanel ref={this.RegisterRef}/>
			{/* Decides wether it should render feed or a chat. */}
			{this.ChoosePanel() }
		</div>
	}

	// handle what happens when a button in the side panel is clicked
	SidePanelCallBack(id: Guid | "Feed" | "Settings" | "Register", name?: string){
		if(id === "Feed")
			this.setState({CurrentPanel: { ID: id, Name: name }});
		else if (id === "Settings")
			this.SettingsRef.current?.Show();
		else if (id === "Register")
			this.RegisterRef.current?.Show();
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
