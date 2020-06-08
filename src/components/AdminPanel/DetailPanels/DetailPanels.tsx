import React from "react";
import { Guid } from "guid-typescript";
import { PopUp } from "../../Pop-up/Pop-up";
import { Chatroom, User } from "../../ChatPanel/Sockets/Sockets";
import * as Socket from "../../ChatPanel/Sockets/Sockets";
import * as Data from "../../../Data";
import "./DetailPanels.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";


export interface DetailPanelProps{
	// what happens when this panel is closed
	onClose(): void;
	// what item this panel is showing
	ID: Guid;
}

interface ChatroomDetailPanelState{
	// the chatroom that is being shown
	Chatroom: Chatroom;
}

export class ChatroomDetailPanel extends React.Component<DetailPanelProps, ChatroomDetailPanelState>
{
	static defaultProps: DetailPanelProps = {
		onClose: () => {},
		ID: Guid.createEmpty()
	};

	PopUpRef: React.RefObject<PopUp>;
	NewUserRef: React.RefObject<HTMLInputElement>;
	NameRef: React.RefObject<HTMLInputElement>;
	PrivateRef: React.RefObject<HTMLInputElement>;
	
	constructor(props: DetailPanelProps)
	{
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.NewUserRef = React.createRef<HTMLInputElement>();
		this.NameRef = React.createRef<HTMLInputElement>();
		this.PrivateRef = React.createRef<HTMLInputElement>();
		this.state = {Chatroom: Data.getChatroom(this.props.ID) ?? {ID: Guid.createEmpty(), LastMessage: null, Name: "", Private: false, Users: []}};
	}
	
	render(){
		return <PopUp canClose={true} Header="Chatroom aanpassen" onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="chatroom-detail-div">
				<h2>Naam:</h2>
				<input type="text" defaultValue={this.state.Chatroom.Name} ref={this.NameRef}/>
				<div className="user-div">
					<h2>Gebruikers:</h2>
					<div className="users">
						{this.state.Chatroom.Users.map(x=> <UserItem User={Data.getUser(x) ?? 
							{ID: Guid.createEmpty(), Username: "", PermissionLevel: 0}} OnExit={x=>this.RemoveUser(x)} Private={this.state.Chatroom.Private}/>)}
					</div>
					<input type="text" ref={this.NewUserRef}/> <button onClick={() => this.AddUser()}>Voeg Gebruiker Toe</button>
				</div>
				Prive: <input type="checkbox" defaultChecked={this.state.Chatroom.Private} ref={this.PrivateRef}/>
				<div className="save-buttons">
					<button onClick={() => this.Save()}>Oplsaan</button><button onClick={() => this.Delete()}>Verwijderen</button>
				</div>
			</div>
		</PopUp>
	}

	Show(){
		this.PopUpRef.current?.Show();
	}

	// send a message to add a user to this chatroom
	AddUser(){
		let ID: Guid = Data.getUsers().find(x => x.Username === this.NewUserRef.current?.value)?.ID ?? Guid.createEmpty();
		let mes: Socket.SocketJsonMessage = {
			MessageID: Guid.create(),
			Command: "ChangeAccess",
			Data: {
				ChatroomID: this.state.Chatroom.ID,
				UserID: ID,
				AllowAccess: true
			}
		}

		Socket.Send(mes);
	}
	
	// send a message to remove a user from this chatroom
	RemoveUser(ID: Guid)
	{
		let mes: Socket.SocketJsonMessage = {
			MessageID: Guid.create(),
			Command: "ChangeAccess",
			Data: {
				ChatroomID: this.state.Chatroom.ID,
				UserID: ID,
				AllowAccess: false
			}
		}

		Socket.Send(mes);
	}

	
	// send a message to remove this chatroom
	Delete(){
		if(!window.confirm("Weet u zeker dat u deze chatroom wilt verwijderen?"))
			return;
			
		let message: Socket.SocketJsonMessage = {
			MessageID: Guid.create(),
			Command: "DeleteChatroom",
			Data:{
				ChatroomID: this.props.ID
			},
		};

		Socket.Send(message);
		this.PopUpRef.current?.Hide();
	}

	// send a message to update this chatroom
	Save(){
		if(this.state.Chatroom.Private === true && this.PrivateRef.current?.checked === false)
			if(!window.confirm("Weet u zeker dat u deze chatroom wilt publiek wilt maken?"))
				return;

		let message: Socket.SocketJsonMessage = {
			MessageID: Guid.create(),
			Command: "EditChatroom",
			Data:{
				ChatroomID: this.props.ID,
				Name: this.NameRef.current?.value,
				Private: this.PrivateRef.current?.checked
			},
		};

		Socket.Send(message);
		this.PopUpRef.current?.Hide();
	}
}

interface UserItemProps{
	// the user this item represents
	User: User;
	// whether the chatroom where this item is in is private or not
	Private: boolean;
	// what happens when the exit icon is pressed
	OnExit(ID: Guid): void;
}

class UserItem extends React.Component<UserItemProps,{}>{
	render(){
		return <div className="user">
			<div className="header"><h3 className="user-name">{this.props.User.Username}</h3>{this.props.Private ? <button onClick={() => this.props.OnExit(this.props.User.ID)}><FontAwesomeIcon icon={faSignOutAlt} size="1x"/></button> : null}</div>
			<div>id: {this.props.User.ID.toString()}</div>
		</div>
	}
}

interface UserDetailPanelState{
	// the user that is being shown
	User: User;
	// the errors that can occur while editing a user
	Error: string | undefined;
}

export class UserDetailPanel extends React.Component<DetailPanelProps, UserDetailPanelState>
{
	static defaultProps: DetailPanelProps = {
		onClose: () => {},
		ID: Guid.createEmpty()
	};

	PopUpRef: React.RefObject<PopUp>;
	NameRef: React.RefObject<HTMLInputElement>;
	EmailRef: React.RefObject<HTMLInputElement>;
	SelectRef: React.RefObject<HTMLSelectElement>;
	PasswordRef: React.RefObject<HTMLInputElement>;
	RepeatPasswordRef: React.RefObject<HTMLInputElement>;
	
	constructor(props: DetailPanelProps)
	{
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.NameRef = React.createRef<HTMLInputElement>();
		this.EmailRef = React.createRef<HTMLInputElement>();
		this.SelectRef = React.createRef<HTMLSelectElement>();
		this.PasswordRef = React.createRef<HTMLInputElement>();
		this.RepeatPasswordRef = React.createRef<HTMLInputElement>();
		this.state = {User: Data.getUser(this.props.ID) ?? {ID: Guid.createEmpty(), Username: "", PermissionLevel: 0}, Error: undefined};
	}
	
	render()
	{
		return <PopUp canClose={true} Header="Gebruiker aanpassen" onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="chatroom-detail-div">
				<div style={{paddingLeft: 10}}>
				<div className="user-error">{this.state.Error}</div>
				<h2>Naam:</h2>
				<input type="text" defaultValue={this.state.User.Username ?? ""} ref={this.NameRef}/>
				<h2>E-mail:</h2>
				<input type="text" ref={this.EmailRef}/>
				Permissie levels: 
				<select defaultValue={this.state.User.PermissionLevel} ref={this.SelectRef}>
					<option value={Socket.PermissionLevels.User}>User</option>
					<option value={Socket.PermissionLevels.Admin}>Admin</option>
				</select>

				<h2>Nieuw wachtwoord:</h2>
				</div>
				<input type="password" placeholder="Wachtwoord" className="form-element" ref={this.PasswordRef}/><br/>
				<input type="password" placeholder="Wachtwoord herhalen" className="form-element" ref={this.RepeatPasswordRef}/><br/>
				
				<div className="save-buttons">
					<button onClick={() => this.Save()}>Opslaan</button><button onClick={() => this.Delete()}>Verwijderen</button>
				</div>
			</div>
		</PopUp>
	}

	Show()
	{
		this.PopUpRef.current?.Show();
	}

	// deletes this user
	Delete()
	{
		if(!window.confirm("Weet u zeker dat u deze gebruiker wilt verwijderen?"))
		{
			return;
		}
		let xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("delete", `http://${Data.Server}/api/account`);
		xhttp.setRequestHeader("Content-type", "application/json");
		let json: string = JSON.stringify({
			ID: this.state.User.ID.toString(),
		});

		xhttp.withCredentials = true;

		xhttp.onloadend = () => {
			if(xhttp.status === 200)
			{
				Data.removeUser(this.state.User.ID);
				this.PopUpRef.current?.Hide();
			}
		};

		// Send the json
		xhttp.send(json);
	}

	// updates this user
	Save()
	{
		if(this.PasswordRef.current?.value !== this.RepeatPasswordRef.current?.value)
		{
			this.setState({...this.state, Error: "De ingevulde wachtwoorden zijn niet hetzelfde."});
			return;
		}
		
		if(this.EmailRef.current?.value === "" && UserDetailPanel.isEmail(this.EmailRef.current?.value ?? ""))
		{
			this.setState({...this.state, Error: "Het e-mailadres is niet geldig."});
			return;
		}

		let xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("patch", `http://${Data.Server}/api/account`);
		xhttp.setRequestHeader("Content-type", "application/json");
		let json: string = JSON.stringify({
			ID: this.state.User.ID.toString(),
			Username: this.NameRef.current?.value,
			PermissionLevel: this.SelectRef.current?.selectedIndex,
			Email: this.EmailRef.current?.value !== "" ? this.EmailRef.current?.value : undefined
		});

		xhttp.withCredentials = true;

		xhttp.onloadend = () => {
			if(xhttp.status === 200)
			{
				Data.updateUser({
					ID: this.state.User.ID,
					PermissionLevel: this.SelectRef.current?.selectedIndex ?? this.state.User.PermissionLevel,
					Username: this.NameRef.current?.value ?? this.state.User.Username
				});
				this.PopUpRef.current?.Hide();
			}
			else if(xhttp.status === 403)
			{
				this.setState({...this.state, Error: "Administrators kan niet worden veranderd."});
			}
			else if(xhttp.status === 400)
			{
				if(xhttp.responseText.includes("Email"))
				{
					this.setState({...this.state, Error: "De opgegeven Email is al ingebruik."});
				}
				else
				{
					this.setState({...this.state, Error: "Het opegegeven wachtwoord is niet geldig."});
				}
			}
		};

		// Send the json
		xhttp.send(json);
	}
	
	// Checks if the given email is a valid email
	static isEmail(email: string): boolean{
		// eslint-disable-next-line
		return new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g).test(email);
	}
}