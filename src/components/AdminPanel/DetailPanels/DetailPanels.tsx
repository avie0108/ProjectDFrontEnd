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
	onClose(): void;
	ID: Guid;
}

interface ChatroomDetailPanelState{
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
	
	constructor(props: DetailPanelProps)
	{
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.NewUserRef = React.createRef<HTMLInputElement>();
		this.state = {Chatroom: Data.getChatroom(this.props.ID) ?? {ID: Guid.createEmpty(), LastMessage: null, Name: "", Private: false, Users: []}};
	}
	
	render(){
		return <PopUp canClose={true} Header="Chatroom aanpassen" onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="chatroom-detail-div">
				<h2>Naam:</h2>
				<input type="text" defaultValue={this.state.Chatroom.Name}/>
				<div className="user-div">
					<h2>Gebruikers:</h2>
					<div className="users">
						{this.state.Chatroom.Users.map(x=> <UserItem User={Data.getUser(x) ?? 
							{ID: Guid.createEmpty(), Username: "", PermissionLevel: 0}} OnExit={x=>this.RemoveUser(x)} Private={this.state.Chatroom.Private}/>)}
					</div>
					<input type="text" ref={this.NewUserRef}/> <button onClick={() => this.AddUser()}>Voeg Gebruiker Toe</button>
				</div>
				Prive: <input type="checkbox" defaultChecked={this.state.Chatroom.Private}/>
				<div className="save-buttons">
					<button>Oplsaan</button><button onClick={() => this.Delete()}>Verwijderen</button>
				</div>
			</div>
		</PopUp>
	}

	Show(){
		this.PopUpRef.current?.Show();
	}

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
}

interface UserItemProps{
	User: User;
	Private: boolean;
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
	User: User;
}

export class UserDetailPanel extends React.Component<DetailPanelProps, UserDetailPanelState>
{
	static defaultProps: DetailPanelProps = {
		onClose: () => {},
		ID: Guid.createEmpty()
	};

	PopUpRef: React.RefObject<PopUp>;
	
	constructor(props: DetailPanelProps)
	{
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.state = {User: Data.getUser(this.props.ID) ?? {ID: Guid.createEmpty(), Username: "", PermissionLevel: 0}};
	}
	
	render(){
		return <PopUp canClose={true} Header="Gebruiker aanpassen" onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="chatroom-detail-div">
				<h2>Naam:</h2>
				<input type="text" defaultValue={this.state.User.Username ?? ""}/>
				Permissie levels: <input type="select"/>
				<div className="save-buttons">
					<button>Opslaan</button><button onClick={() => this.Delete()}>Verwijderen</button>
				</div>
			</div>
		</PopUp>
	}

	Show(){
		this.PopUpRef.current?.Show();
	}

	Delete(){
		if(!window.confirm("Weet u zeker dat u deze gebruiker wilt verwijderen?"))
			return;
		
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
}
