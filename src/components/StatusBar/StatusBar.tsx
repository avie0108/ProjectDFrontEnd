import React from "react";
import "./StatusBar.scss";
import { loggedInUser } from "../../AccountUtils";
import { LoginPanel } from "../LoginPanel/LoginPanel";
import { logOut } from "../../AccountUtils";

export interface StatusBarProps {
    // What happens when the user logs in
	LogedIn: () => void;
}

// The bar at the top that shows status of the currently logged in user, and the buttons to log in and out
export class StatusBar extends React.Component<StatusBarProps, {}> {
    // Login pop up
    LoginRef: React.RefObject<LoginPanel>;
    // Current user
    User: any;

    constructor(props: Readonly<StatusBarProps>) {
        super(props);

        this.LoginRef = React.createRef<LoginPanel>();
        this.User = loggedInUser;
    }

    render() {
        return (
            <div className="status-bar">
			    <LoginPanel LogedIn={() => this.props.LogedIn} ref={this.LoginRef}/>
                <h1>Meldkamer</h1>
                <div className="user-status">
                    {this.User ? (
                        <div className="logged-in">
                            <div className="logged-in-as">Ingelogd als {this.User["Email"]}</div>
                            |
                            <div className="logout-button" onClick={() => this.logOut()}>Uitloggen</div>
                        </div>
                    ) : (
                        <div className="login-button" onClick={() => this.logIn()}>Inloggen</div>
                    )}
                </div>
            </div>
        );
    }

    // Logs out the user
    logOut() {
        // Function in AccountUtils
        logOut();

        window.location.reload(true);
    }

    // Shows the log in pop up
    logIn() {
        this.LoginRef.current?.Show();
    }
}