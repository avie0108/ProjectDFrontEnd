import React from "react";
import { Guid } from "guid-typescript";
import { PopUp } from "../../Pop-up/Pop-up";
import * as Socket from "../../ChatPanel/Sockets/Sockets";
import "./NewPanels.scss";

export interface NewPanelProps{
	onClose(): void;
}

export class NewChatroomPanel extends React.Component<NewPanelProps, {}>
{
	static defaultProps: NewPanelProps = {
		onClose: () => {},
	};

	PopUpRef: React.RefObject<PopUp>;
	NameRef: React.RefObject<HTMLInputElement>;
	PrivateRef: React.RefObject<HTMLInputElement>;

	constructor(props: NewPanelProps){
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.NameRef = React.createRef<HTMLInputElement>();
		this.PrivateRef = React.createRef<HTMLInputElement>();
	}

	render(){
		return <PopUp canClose={true} onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="newchatroom-div">
				<div>
					<h3>Naam:</h3>
					<input ref={this.NameRef} type="text"/><br/>
					Prive: <input ref={this.PrivateRef} type="checkbox"/>
				</div>
				<button onClick={() => this.CreateChatroom()}>Chatroom aanmaken</button>
			</div>
		</PopUp>
	}

	CreateChatroom(){
		if(this.NameRef.current?.value === "" || this.NameRef.current?.value === undefined)
			return;
		let message: Socket.SocketJsonMessage = {
			MessageID: Guid.create(),
			Command: "CreateChatroom",
			Data:{
				Name: this.NameRef.current?.value,
				Private: this.PrivateRef.current?.checked ?? false,
			},
		};

		Socket.Send(message);
		this.PopUpRef.current?.Hide();
	}

	Show(){
		this.PopUpRef.current?.Show();
	}
}
