import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import "./SidePanel.scss";

export interface SidePanelProps
{
	// the function that is called when one of the buttons is pressed
	// @param id: the id of the chat button that is pressed
	CallBack(id: Number | "Feed"): void;
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
			<SidePanelIcon ChatID={554} CallBack={this.props.CallBack}/>
			<SidePanelIcon ChatID={555} CallBack={this.props.CallBack}/>
			<SidePanelIcon ChatID={556} CallBack={this.props.CallBack}/>
		</div>
	}
}

interface SidePanelIconProps
{
	// the id of the chat that this icon represents
	ChatID: Number;

	// the function that is called when one of the buttons is pressed
	// @param id: the id of the chat button that is pressed
	CallBack(id: Number): void;
}

// an icon that reacts when pressed
class SidePanelIcon extends React.Component<SidePanelIconProps,{}>
{
	render()
	{
		return <button onClick={() => this.props.CallBack(this.props.ChatID)}>
			{/* gets the chat icon from the server*/}
			<img src={"https://stud.hosted.hr.nl/0958956/ProjectD/Chats/" + this.props.ChatID + "/Icon.png"} draggable={false}/>
		</button>
	}
}