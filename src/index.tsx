import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";
import { FeedPanel } from "./components/FeedPanel/FeedPanel";
import { LoginPanel } from "./components/LoginPanel/LoginPanel";

interface AppState
{
	// The currently selected panel if panel is a number that number is then the chat id
	CurrentPanel: Number | "Feed";
}

// The app
class App extends React.Component<{},AppState>
{
	constructor(props: object)
	{
		super(props)
		this.state = {CurrentPanel: "Feed"};
	}

	render()
	{
		return <div>
			<LoginPanel />
			<SidePanel CallBack={(id) => this.setState({CurrentPanel: id})}/>
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
		if(this.state.CurrentPanel === "Feed")
			return <FeedPanel/>
		return <ChatPanel ChatId = {this.state.CurrentPanel as number}/>
	}
}

// renders the page
ReactDom.render(
	<App/>,
	document.getElementById("root")
);
