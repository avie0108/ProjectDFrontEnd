import * as React from "react";
import * as ReactDom from "react-dom";

import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { SidePanel } from "./components/SidePanel/SidePanel";

interface AppState
{
	// The id of the current chat
	CurrentChat: Number;
}

// The app
class App extends React.Component<{},AppState>
{
	constructor(props: object)
	{
		super(props)
		// TODO: should be the homepage
		this.state = {CurrentChat: 554};
	}

	render()
	{
		return <div>
			<SidePanel CallBack={(id) => this.setState({CurrentChat: id})}/>
			{/* TODO: implement feed */}
			<ChatPanel ChatId = {this.state.CurrentChat}/>
		</div>
	}
}

// renders the page
ReactDom.render(
	<App/>,
	document.getElementById("root")
);
