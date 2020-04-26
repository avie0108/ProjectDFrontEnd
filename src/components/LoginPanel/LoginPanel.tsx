import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import "./LoginPanel.scss";

export interface LoginPanelState
{
	ErrorMessage: null | "incorrect Email" | "incorrect wachtwoord" | string
}

export class LoginPanel extends React.Component<{}, LoginPanelState>
{

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

	handleFormSubmit()
	{
		var xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("post", "localhost:3001/login", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		if(LoginPanel.isEmail(this.EmailRef.current?.value ?? ""))
		{
			var json: string = JSON.stringify({
				Email: this.EmailRef.current?.value,
				Password: this.PasswordRef.current?.value,
				RememberMe: this.RememberMeRef.current?.checked
			});
			console.log(json);
			xhttp.send(json);
			if(xhttp.status == 200)
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
		}
		else
		{
			this.setState({ErrorMessage: "incorrect Email"});
		}
	}

	static isEmail(email: string): boolean{
		return new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$").test(email);
	}
}