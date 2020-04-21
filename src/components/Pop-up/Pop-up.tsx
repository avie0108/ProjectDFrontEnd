import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import "./Pop-up.scss";

export interface PopUpProps{
	// If the PopUp is able to close
	canClose: boolean;
	// The header of the pop
	Header: string;
	// The function that is called when shown
	onOpen(): void;
	// The function that is called when hidden
	onClose(): void;
}

export interface PopUpState{
	// If the pop up is hidden
	hidden: boolean;
}

export class PopUp extends React.Component<PopUpProps,PopUpState>
{

	// Default prop values
	static defaultProps: PopUpProps = {
		canClose: true,
		Header: "",
		onOpen: () => {},
		onClose: () => {},
	}

	constructor(props: PopUpProps){
		super(props);
		this.state = {hidden: true};
	}

	// opens the pop-up
	Show(){
		if(!this.state.hidden)
		return;
		this.setState({...this.state, hidden: false});
		this.props.onOpen();
	}
	
	// closes the pop-up
	Hide(){
		if(this.state.hidden)
		return;
		this.setState({...this.state, hidden: true});
		this.props.onClose();
	}

	// toggles between open and closed
	Toggle(){
		if(this.state.hidden)
			this.Show();
		else
			this.Hide();
	}

	render(){
		if(this.state.hidden)
			return null;
		return <div className="pop-up-bg">
			<div className="pop-up-div">
				<h1>
					{this.props.Header}
					{/* only show the close button when it can actually close */}
					{this.props.canClose && <button onClick={()=> this.Hide()}><FontAwesomeIcon icon={faTimes} size="1x"/></button>}
				</h1>
				{this.props.children}
			</div>
		</div>;
	}
}