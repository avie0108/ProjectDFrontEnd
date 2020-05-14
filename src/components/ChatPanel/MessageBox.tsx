import * as React from "react";
import * as Socket from "./Sockets/Sockets";
import "./MessageBox.scss";
import { Guid } from "guid-typescript";

export interface MessageBoxProps
{
	Name: string;
	Room: Guid;
}

export class MessageBox extends React.Component<MessageBoxProps,{}>
{
	
	InputRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
	render()
	{
		return <div className="messagebox">
			<input type="text" placeholder={"stuur een bericht naar " + this.props.Name} ref={this.InputRef}/>
			<input type="button" value="&#xf061;" onClick={() => this.SendMessage()}/>
		</div>
	}

	SendMessage()
	{
		let message: Socket.SocketJsonMessage = {
			MessageID: Guid.create(),
			Type: Socket.MessageType.ChatMessage,
			Command: "ChatMessage",
			Data: {
				ChatroomID: this.props.Room,
				MessageText: this.InputRef.current?.value ?? "",
			},
		};
		Socket.Send(message);
		if(this.InputRef.current !== null)
			this.InputRef.current.value = "";
	}
}