import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import "./RegisterPanel.scss";

// The state of the register panel
export interface RegisterPanelState
{
    // The success message
    SuccessMessage: null | string,
	// The error message
    ErrorMessage: null | string
}

// A pop-up to register a user
export class RegisterPanel extends React.Component<{}, RegisterPanelState>
{
    PopUpRef: React.RefObject<PopUp>;
	EmailRef: React.RefObject<HTMLInputElement>;
    PasswordRef: React.RefObject<HTMLInputElement>;
    RepeatPasswordRef: React.RefObject<HTMLInputElement>;

	constructor(props: Readonly<{}>)
	{
        super(props);
        
        this.PopUpRef = React.createRef<PopUp>();
		this.EmailRef = React.createRef<HTMLInputElement>();
        this.PasswordRef = React.createRef<HTMLInputElement>();
        this.RepeatPasswordRef = React.createRef<HTMLInputElement>();
        
        this.state = { SuccessMessage: null, ErrorMessage: null }
	}

	render() {
		return <PopUp Header="Gebruiker registreren" canClose={true} ref={this.PopUpRef}>
            <div className="register-form">
                <form className="register-div" onSubmit={() => this.registerUser()} action="#">
                    {this.state.SuccessMessage !== null && <div className="success">{this.state.SuccessMessage}</div>}
                    {this.state.ErrorMessage !== null && <div className="error">{this.state.ErrorMessage}</div>}

                    <input type="email" placeholder="E-mailadres" className="form-element" ref={this.EmailRef}/><br/>
                    <input type="password" placeholder="Wachtwoord" className="form-element" ref={this.PasswordRef}/><br/>
                    <input type="password" placeholder="Wachtwoord herhalen" className="form-element" ref={this.RepeatPasswordRef}/><br/>
                    <input type="submit" value="Gebruiker registreren" className="form-element"/>
                </form>
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
		if (!RegisterPanel.isEmail(this.EmailRef.current?.value ?? "") && this.EmailRef.current?.value !== "Administrator") {
			this.setState({ErrorMessage: "Het e-mailadres is niet geldig."});
			return;
        }
        
        // Send a POST request to create the account
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", `http://${Server}/api/account`, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        let json: string = JSON.stringify({
            Email: this.EmailRef.current?.value,
            Password: this.PasswordRef.current?.value,
        });

        // When the request is sent
        xhttp.onloadend = () => {
            // If a 2xx message is returned
            if (xhttp.status >= 200 && xhttp.status < 300)
            {
                this.setState({SuccessMessage: "De gebruiker met e-mailadres " + this.EmailRef.current?.value + " is succesvol aangemaakt."});
                this.resetFields();

                return;
            // If a 400 message is returned
            } else if (xhttp.status === 400) {
                this.setState({ErrorMessage: "De gebruiker kon niet worden aangemaakt."});
                
                return;
            }
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