import * as React from "react";
import * as Socket from "./Sockets/Sockets";
import "./MessageBox.scss";

export interface MessageBoxProps
{
	Name: string;
	OnSendCallBack: (Message: string)=> void;
}

export class MessageBox extends React.Component<MessageBoxProps,{}>
{
	
	InputRef: React.RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
	render()
	{
		return <div className="messagebox">
			<input type="text" placeholder={"stuur een bericht naar " + this.props.Name} ref={this.InputRef}/>
			<input type="button" value="&#xf061;" onClick={() => this.SendMessage()}/>
		</div>
	}

	SendMessage()
	{
		
		this.props.OnSendCallBack(this.InputRef.current?.value ?? "");
	}
}