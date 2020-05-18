import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Guid } from "guid-typescript";
import "./SidePanel.scss";

export interface SidePanelProps
{
	// the function that is called when one of the buttons is pressed
	// @param id: the id of the chat button that is pressed
	// @param name?: the name of the chat button that is pressed
	CallBack(id: Guid | "Feed", name?: string): void;

	// The chats this user is in
	Chats: Array<{ID: Guid, Name: string}>;
}

// the side panel
export class SidePanel extends React.Component<SidePanelProps,{}>
{
	render()
	{
		return <div className="sidenav">
			{/* the button for the feed with default id 0*/}
			<button onClick={() => this.props.CallBack("Feed")}>
				<FontAwesomeIcon icon={faHome} size="2x"/>
			</button>
			<hr/>
			{this.props.Chats.map(v => <SidePanelIcon ChatID={v.ID} ChatName={v.Name} CallBack={this.props.CallBack}/>)}
		</div>
	}
}

interface SidePanelIconProps
{
	// the id of the chat that this icon represents
	ChatID: Guid;

	// the name of the chat that this icon represents
	ChatName: string;

	// the function that is called when one of the buttons is pressed
	// @param id: the id of the chat button that is pressed
	CallBack(id: Guid, name?: string): void;
}

interface SidePanelIconState
{
	Error: boolean;
}

// an icon that reacts when pressed
class SidePanelIcon extends React.Component<SidePanelIconProps,SidePanelIconState>
{
	constructor(props: Readonly<SidePanelIconProps>)
	{
		super(props);
		this.state = {Error: false};
	}

	render()
	{
		return <button onClick={() => this.props.CallBack(this.props.ChatID, this.props.ChatName)}>
			{/* gets the chat icon from the server*/}
			{ this.state.Error ? this.props.ChatName[0] : <img title={this.props.ChatName} src={"https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + this.props.ChatID + "/Icon.png"} alt="Chat icon" draggable={false} onError={() => this.setState({Error: true})}/>}
		</button>
	}
}