import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import "./LoginPanel.scss";

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

	// show the login pop-up
	componentDidMount()
	{
		this.PopUpRef.current?.Show();
	}

	render()
	{
		//return () => console.log("Login pop-up");
		return <PopUp Header="Login" canClose={false} ref={this.PopUpRef}>
			<div className="login-div">
				{this.state.ErrorMessage !== null && <div className="error">{this.state.ErrorMessage}</div>}
				Email:<br/>
				<input type="email" ref={this.EmailRef}/><br/>
				Wachtwoord:<br/>
				<input type="password" ref={this.PasswordRef}/><br/>
				<input type="checkbox" ref={this.RememberMeRef}/> <label className="checkbox-text">houd mij ingelogd </label>
			</div>
			<input type="submit" value="login" onClick={()=> this.handleFormSubmit()}/>
		</PopUp>
	}

	// sends the data to the backend
	handleFormSubmit()
	{
		// client side error checking
		if(!LoginPanel.isEmail(this.EmailRef.current?.value ?? "") && this.EmailRef.current?.value !== "Administrator")
		{
			this.setState({ErrorMessage: "incorrect Email"});
			return;
		}
		if(this.PasswordRef.current?.value?.trim() === ""){
			this.setState({ErrorMessage: "leeg Wachtwoord"});
			return;
		}
		if(!this.Sending)
		{
			this.Sending = true;
			// making the request that will be sent
			let xhttp: XMLHttpRequest = new XMLHttpRequest();
			xhttp.open("post", "http://localhost/api/login", true);
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
					this.setState({ErrorMessage: "incorrect wachtwoord"});
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
