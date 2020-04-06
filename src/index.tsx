import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { FeedPanel } from "./components/FeedPanel/FeedPanel"

interface AppState
{
	// The id of the current chat or "Feed"
	CurrentChat: Number | "Feed";
}

// The app
class App extends React.Component<{},AppState>
{
	constructor(props: object)
	{
		super(props)
		this.state = {CurrentChat: "Feed"};
	}

	render()
	{
		return <div>
			<SidePanel CallBack={(id) => this.setState({CurrentChat: id})}/>
			{/* Decides wether it should render feed or a chat. */}
			{this.ChoosePanel() }
		</div>
	}
	/*
	* Decides wether it should render feed or a chat.
	* This is decided based on the currentChat in the state.
	* If current chat is "Feed" it will render the feed else it will render the chat with the id of CurrentChat.
	*/
	ChoosePanel()
	{
		if(this.state.CurrentChat === "Feed")
			return <FeedPanel/>
		return <ChatPanel ChatId = {this.state.CurrentChat as number}/>
	}
}

// renders the page
ReactDom.render(
	<App/>,
	document.getElementById("root")
);
