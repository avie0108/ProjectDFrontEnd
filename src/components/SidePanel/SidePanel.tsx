import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Guid } from "guid-typescript";
import "./SidePanel.scss";

export interface SidePanelProps
{
	// the function that is called when one of the buttons is pressed
	// @param id: the id of the chat button that is pressed
	CallBack(id: Guid | "Feed"): void;
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
			<SidePanelIcon ChatID={Guid.create()} CallBack={this.props.CallBack}/>
			<SidePanelIcon ChatID={Guid.create()} CallBack={this.props.CallBack}/>
			<SidePanelIcon ChatID={Guid.create()} CallBack={this.props.CallBack}/>
		</div>
	}
}

interface SidePanelIconProps
{
	// the id of the chat that this icon represents
	ChatID: Guid;

	// the function that is called when one of the buttons is pressed
	// @param id: the id of the chat button that is pressed
	CallBack(id: Guid): void;
}

// an icon that reacts when pressed
class SidePanelIcon extends React.Component<SidePanelIconProps,{}>
{
	render()
	{
		return <button onClick={() => this.props.CallBack(this.props.ChatID)}>
			{/* gets the chat icon from the server*/}
			<img alt="" src={"https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + this.props.ChatID + "/Icon.png"} draggable={false}/>
		</button>
	}
}