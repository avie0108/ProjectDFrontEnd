import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import "./LoginPanel.scss";

// The state of the login panel
export interface LoginPanelState
{
	// the current error
	ErrorMessage: null | string
}

// the actual login panel
export class LoginPanel extends React.Component<{}, LoginPanelState>
{
	// the references needed for the login
	PopUpRef: React.RefObject<PopUp>;
	EmailRef: React.RefObject<HTMLInputElement>;
	PasswordRef: React.RefObject<HTMLInputElement>;
	RememberMeRef: React.RefObject<HTMLInputElement>;

	constructor(props: {})
	{
		super(props)
		this.PopUpRef = React.createRef<PopUp>()
		this.EmailRef = React.createRef<HTMLInputElement>();
		this.PasswordRef = React.createRef<HTMLInputElement>();
		this.RememberMeRef = React.createRef<HTMLInputElement>();
		this.state = {ErrorMessage:null};
	}

	// show the login pop-up
	componentDidMount()
	{
		this.PopUpRef.current?.Show();
	}

	render()
	{
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

		// making the request that will be sent
		var xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("post", "http://localhost/api/login", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		var json: string = JSON.stringify({
			Email: this.EmailRef.current?.value,
			Password: this.PasswordRef.current?.value,
			RememberMe: this.RememberMeRef.current?.checked
		});
		
		// handle the response of the request
		xhttp.onloadend = () => {
			console.log(xhttp.status);
			if(xhttp.status == 200 || xhttp.status == 204)
			{
				this.PopUpRef.current?.Hide();
				return;
			}
			else if(xhttp.status == 401)
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

	// checks if email is an email
	static isEmail(email: string): boolean{
		return new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$").test(email);
	}
}
