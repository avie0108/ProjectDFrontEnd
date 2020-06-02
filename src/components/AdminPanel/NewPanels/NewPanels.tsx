import React from "react";
import { Guid } from "guid-typescript";
import { PopUp } from "../../Pop-up/Pop-up";
import * as Socket from "../../ChatPanel/Sockets/Sockets";
import * as Data from "../../../Data";
import "./NewPanels.scss";
import { Server } from "../../../Data";

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

// The state of the register panel
interface RegisterPanelState
{
	// The success message
	SuccessMessage: null | string,
	// The error message
	ErrorMessage: null | string
}


export class NewUserPanel extends React.Component<NewPanelProps, RegisterPanelState>
{
	static defaultProps: NewPanelProps = {
		onClose: () => {},
	};

	PopUpRef: React.RefObject<PopUp>;
	EmailRef: React.RefObject<HTMLInputElement>;
	PasswordRef: React.RefObject<HTMLInputElement>;
	RepeatPasswordRef: React.RefObject<HTMLInputElement>;

	constructor(props: Readonly<NewPanelProps>)
	{
		super(props);
		
		this.PopUpRef = React.createRef<PopUp>();
		this.EmailRef = React.createRef<HTMLInputElement>();
		this.PasswordRef = React.createRef<HTMLInputElement>();
		this.RepeatPasswordRef = React.createRef<HTMLInputElement>();
		
		this.state = { SuccessMessage: null, ErrorMessage: null }
	}

	render(){
		return <PopUp canClose={true} onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="register-form">
				<div className="register-div">
					{this.state.SuccessMessage !== null && <div className="success">{this.state.SuccessMessage}</div>}
					{this.state.ErrorMessage !== null && <div className="error">{this.state.ErrorMessage}</div>}

					<input type="email" placeholder="E-mailadres" className="form-element" ref={this.EmailRef}/><br/>
					<input type="password" placeholder="Wachtwoord" className="form-element" ref={this.PasswordRef}/><br/>
					<input type="password" placeholder="Wachtwoord herhalen" className="form-element" ref={this.RepeatPasswordRef}/><br/>
					<input type="submit" value="Gebruiker registreren" className="form-element" onClick={() => this.registerUser()}/>
				</div>
			</div>
		</PopUp>
	}

	registerUser() {
		// Reset the state
		this.setState({SuccessMessage: null, ErrorMessage: null});

		// Check if both passwords are filled in
		if(this.PasswordRef.current?.value?.trim() === "" || this.RepeatPasswordRef.current?.value?.trim() === "") {
			this.setState({ErrorMessage: "U dient beide wachtwoorden in te vullen."});
			return;
		}

		// Check if both passwords are identical
		if (this.PasswordRef.current?.value !== this.RepeatPasswordRef.current?.value) {
			this.setState({ErrorMessage: "De ingevulde wachtwoorden zijn niet hetzelfde."});
			return;
		}

		// Check if email address is valid
		if (!NewUserPanel.isEmail(this.EmailRef.current?.value ?? "") && this.EmailRef.current?.value !== "Administrator") {
			this.setState({ErrorMessage: "Het e-mailadres is niet geldig."});
			return;
		}
		
		// Send a POST request to create the account
		let xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("post", `http://${Server}/api/account`, true);
		xhttp.setRequestHeader("Content-type", "application/json");
		let json: string = JSON.stringify({
			Email: this.EmailRef.current?.value,
			Password: this.PasswordRef.current?.value,
		});

		let email = this.EmailRef.current?.value;

		xhttp.withCredentials = true;

		// When the request is sent
		xhttp.onloadend = () => {
			// If a 200 message is returned
			if (xhttp.status === 201)
			{
				
				let nhttp: XMLHttpRequest = new XMLHttpRequest();
				nhttp.open("get", `http://${Server}/api/account?email=${email}`, true);
				
				nhttp.withCredentials = true;
				
				nhttp.onloadend = () => {
					let x = JSON.parse(nhttp.responseText)[0];
					Data.AddUser({ID: Guid.parse(x.ID), 
						PermissionLevel: x.PermissionLevel, Username: x.Username})
					this.PopUpRef.current?.Hide();
				}

				nhttp.send(json)
			}
			// If a 400 message is returned
			else if (xhttp.status === 400)
				this.setState({ErrorMessage: "De gebruiker kon niet worden aangemaakt."});
		}

		// Send the json
		xhttp.send(json);
	}

	resetFields() {
		if (this.EmailRef.current) this.EmailRef.current.value = "";
		if (this.PasswordRef.current) this.PasswordRef.current.value = "";
		if (this.RepeatPasswordRef.current) this.RepeatPasswordRef.current.value = "";
	}

	Show(){
		this.PopUpRef.current?.Show();
	}
	
	// Checks if the given email is a valid email
	static isEmail(email: string): boolean{
		// eslint-disable-next-line
		return new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g).test(email);
	}
}
