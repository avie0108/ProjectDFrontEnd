import * as React from "react";
import "./MessageBox.scss";

export interface MessageBoxProps
{
	Name: string;
}

export class MessageBox extends React.Component<MessageBoxProps,{}>
{
	render()
	{
		return <div className="messagebox">
			<input type="text" placeholder={"stuur een bericht naar " + this.props.Name}/>
			{/*TODO: fix sizing issue*/}
			<input type="button" value="&#xf061;"/>
		</div>
	}
}