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
	
	constructor(props: DetailPanelProps)
	{
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.state = {Chatroom: Data.getChatroom(this.props.ID) ?? {ID: Guid.createEmpty(), LastMessage: null, Name: "", Private: false, Users: []}};
	}
	
	render(){
		return <PopUp canClose={true} Header="Edit Chatroom" onClose={this.props.onClose} ref={this.PopUpRef}>
			<div className="chatroom-detail-div">
				<h2>Naam:</h2>
				<input type="text" defaultValue={this.state.Chatroom.Name}/>
				<div className="user-div">
					<h2>Gebruikers:</h2>
					<div className="users">
						{this.state.Chatroom.Users.map(x=> <UserItem User={Data.getUser(x) ?? 
							{ID: Guid.createEmpty(), Username: "", PermissionLevel: 0}}/>)}
					</div>
					<input type="text"/> <button>Voeg Gebruiker Toe</button>
				</div>
				Prive: <input type="checkbox" defaultChecked={this.state.Chatroom.Private}/>
				<div className="save-buttons">
					<button>Save</button><button onClick={() => this.Delete()}>Verwijder</button>
				</div>
			</div>
		</PopUp>
	}

	Show(){
		this.PopUpRef.current?.Show();
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
	User: User
}

class UserItem extends React.Component<UserItemProps,{}>{
	render(){
		return <div className="user">
			<div className="header"><h3 className="user-name">{this.props.User.Username}</h3><button><FontAwesomeIcon icon={faSignOutAlt} size="1x"/></button></div>
			<div>id: {this.props.User.ID.toString()}</div>
		</div>
	}
}