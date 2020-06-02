import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import { NewChatroomPanel, NewUserPanel } from "./NewPanels/NewPanels";
import * as Data from "../../Data";
import "./AdminPanel.scss";
import { Chatroom, User } from "../ChatPanel/Sockets/Sockets";
import { ChatroomDetailPanel, UserDetailPanel } from "./DetailPanels/DetailPanels";
import { Guid } from "guid-typescript";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface AdminPanelState{
	DetailChatroom: Guid;
	DetailUser: Guid;
}

export class AdminPanel extends React.Component<{}, AdminPanelState>
{
	PopUpRef: React.RefObject<PopUp>;
	NewChatroomRef: React.RefObject<NewChatroomPanel>;
	ChatroomDetailRef: React.RefObject<ChatroomDetailPanel>;
	NewUserPanelRef: React.RefObject<NewUserPanel>;
	UserDetailRef: React.RefObject<UserDetailPanel>;

	constructor(props: Readonly<{}>)
	{
		super(props);
		this.PopUpRef = React.createRef<PopUp>();
		this.NewChatroomRef = React.createRef<NewChatroomPanel>();
		this.ChatroomDetailRef = React.createRef<ChatroomDetailPanel>();
		this.NewUserPanelRef = React.createRef<NewUserPanel>();
		this.UserDetailRef = React.createRef<UserDetailPanel>();
		this.state = {DetailChatroom: Guid.createEmpty(), DetailUser: Guid.createEmpty(),};
	}

	render(){
		return<div>
			<PopUp ref={this.PopUpRef} Header="Administrator Paneel" canClose={true}>
				<div className="admin-div">
					<div className="chatroom-div">
						<h2>Chatroom's:</h2>
						<div className="chatrooms">
							{Data.getChatrooms().map(x=> <ChatroomItem Chatroom={x} OnEdit={x => {
								this.setState({...this.state, DetailChatroom: x.ID});
								this.ChatroomDetailRef.current?.setState({Chatroom: x});
								this.ChatroomDetailRef.current?.Show();
								this.PopUpRef.current?.Hide();
							}}/>)}
						</div>
						<button onClick={()=>{this.PopUpRef.current?.Hide(); this.NewChatroomRef.current?.Show();}}>Nieuwe Chatroom</button>
					</div>
					<div className="user-div">
						<h2>Gebruikers:</h2>
						<div className="users">
							{Data.getUsers().map(x=> <UserItem User={x} OnEdit={x => {
								this.setState({...this.state, DetailUser: x.ID});
								this.UserDetailRef.current?.setState({User: x});
								this.UserDetailRef.current?.Show();
								this.PopUpRef.current?.Hide();
							}}/>)}
						</div>
						<button onClick={()=>{this.PopUpRef.current?.Hide(); this.NewUserPanelRef.current?.Show();}}>Nieuwe gebruiker</button>
					</div>
				</div>
			</PopUp>
			<NewChatroomPanel onClose={() => this.PopUpRef.current?.Show()} ref={this.NewChatroomRef}/>
			<ChatroomDetailPanel onClose={() => this.PopUpRef.current?.Show()} ID={this.state.DetailChatroom} ref={this.ChatroomDetailRef}/>
			<NewUserPanel onClose={() => {this.PopUpRef.current?.Show(); this.forceUpdate()}} ref={this.NewUserPanelRef}/>
			<UserDetailPanel onClose={() => {this.PopUpRef.current?.Show(); this.forceUpdate()}} ID={this.state.DetailUser} ref={this.UserDetailRef}/>
		</div>
	}

	Show(){
		this.PopUpRef.current?.Show();
	}
}

interface ChatroomItemProps{
	Chatroom: Chatroom
	OnEdit(Chatroom: Chatroom): void
}

class ChatroomItem extends React.Component<ChatroomItemProps,{}>{
	render(){
		return <div className="chatroom">
			<div className="header"><h3 className="chatroom-name">{this.props.Chatroom.Name}</h3>
			<button onClick={() => this.props.OnEdit(this.props.Chatroom)}><FontAwesomeIcon icon={faEdit} /></button></div>
			<div>id: {this.props.Chatroom.ID.toString()}</div>
		</div>
	}
}

interface UserItemProps{
	User: User
	OnEdit(User: User): void
}

class UserItem extends React.Component<UserItemProps,{}>{
	render(){
		return <div className="user">
			<div className="header"><h3 className="user-name">{this.props.User.Username}</h3>
			<button onClick={() => this.props.OnEdit(this.props.User)}><FontAwesomeIcon icon={faEdit} /></button></div>
			<div>id: {this.props.User.ID.toString()}</div>
		</div>
	}
}
