import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import "./LoginPanel.scss";
import { logOut, updateLoggedInUser } from "../../AccountUtils";
import { Server } from "../../Data";

export interface LoginPanelProps{
	// what happens when the user is logged in
	LogedIn: () => void;
}

// The state of the login panel
export interface LoginPanelState
{
	// the current error
	ErrorMessage: null | string
}

// the actual login panel
export class LoginPanel extends React.Component<LoginPanelProps, LoginPanelState>
{
	// the references needed for the login
	PopUpRef: React.RefObject<PopUp>;
	EmailRef: React.RefObject<HTMLInputElement>;
	PasswordRef: React.RefObject<HTMLInputElement>;
	RememberMeRef: React.RefObject<HTMLInputElement>;

	Sending: boolean;

	constructor(props: Readonly<LoginPanelProps>)
	{
		super(props)
		this.PopUpRef = React.createRef<PopUp>()
		this.EmailRef = React.createRef<HTMLInputElement>();
		this.PasswordRef = React.createRef<HTMLInputElement>();
		this.RememberMeRef = React.createRef<HTMLInputElement>();
		this.Sending = false;
		this.state = {ErrorMessage:null};
	}

	// checks if the session is correct and if so logs in
	// else it asks the user to login
	componentDidMount()
	{
		let xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("post", `http://${Server}/api/login`, true);
		xhttp.setRequestHeader("Content-type", "application/json");
		let json: string = JSON.stringify({});
			
		xhttp.withCredentials = true;
		// handle the response of the request
		xhttp.onloadend = () => {
			this.Sending = false;
			if(xhttp.status === 200 || xhttp.status === 204)
			{
				this.props.LogedIn();
				return;
			}
			this.PopUpRef.current?.Show();
		};
		// send the request
		xhttp.send(json);
	}

	render()
	{
		return <PopUp Header="Inloggen" canClose={false} ref={this.PopUpRef}>
			<div className="login-div">
				{this.state.ErrorMessage !== null && <div className="error">{this.state.ErrorMessage}</div>}
				E-mailadres:<br/>
				<input type="email" ref={this.EmailRef}/><br/>
				Wachtwoord:<br/>
				<input type="password" ref={this.PasswordRef}/><br/>
				<input type="checkbox" ref={this.RememberMeRef}/> <label className="checkbox-text">Ingelogd blijven</label>
			</div>
			<input type="submit" value="Inloggen" onClick={()=> this.handleFormSubmit()}/>
		</PopUp>
	}

	// show the login pop-up
	Show(){
		this.PopUpRef.current?.Show();
	}

	// sends the data to the backend
	handleFormSubmit()
	{
		// client side error checking
		if(!LoginPanel.isEmail(this.EmailRef.current?.value ?? "") && this.EmailRef.current?.value !== "Administrator")
		{
			this.setState({ErrorMessage: "Het e-mailadres is niet geldig."});
			return;
		}
		if(this.PasswordRef.current?.value?.trim() === ""){
			this.setState({ErrorMessage: "U dient een wachtwoord in te vullen."});
			return;
		}
		
		logOut();

		if(!this.Sending)
		{
			this.Sending = true;
			// making the request that will be sent
			let xhttp: XMLHttpRequest = new XMLHttpRequest();
			xhttp.open("post", `http://${Server}/api/login`, true);
			xhttp.setRequestHeader("Content-type", "application/json");
			let json: string = JSON.stringify({
				Email: this.EmailRef.current?.value,
				Password: this.PasswordRef.current?.value,
				RememberMe: this.RememberMeRef.current?.checked
			});
			
			xhttp.withCredentials = true;
			
			// handle the response of the request
			xhttp.onloadend = () => {
				this.Sending = false;
				if(xhttp.status === 200 || xhttp.status === 204)
				{
					this.PopUpRef.current?.Hide();
					this.props.LogedIn();
					return;
				}
				else if(xhttp.status === 401)
				{
					this.setState({ErrorMessage: "Het ingevulde wachtwoord is niet correct."});
				}
				else
				{
					this.setState({ErrorMessage: xhttp.responseText});
				}
			};
			// send the request
			xhttp.send(json);
		}
	}

	// checks if email is an email
	static isEmail(email: string): boolean{
		// eslint-disable-next-line
		return new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g).test(email);
	}
}
