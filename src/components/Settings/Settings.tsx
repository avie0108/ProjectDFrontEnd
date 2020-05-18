import React from "react";
import { PopUp } from "../Pop-up/Pop-up";
import { SetCookie, CheckCookie, GetCookie } from "./Cookies/Cookies";
import "./Settings.scss";

// the possible
export enum Theme
{
	Light= "light",
	Dark= "dark"
}

// the currentTheme
let currentTheme: Theme = Theme.Light;

// the events that happen when a setting is changed
let OnSettingChangedCallBacks: Array<(setting: Settings, value: any) => any> = Array<(setting: Settings, value: any) => any>();

// initializes the settings by reading the cookies.
export function Init(){
	if(CheckCookie("Theme"))
		currentTheme = GetCookie("Theme") as Theme;
}

// a pop-up especially for settings
export class SettingsPanel extends React.Component<{}, {}>
{
	PopUpRef: React.RefObject<PopUp>;

	constructor(props: Readonly<{}>)
	{
		super(props)
		this.PopUpRef = React.createRef<PopUp>()
	}

	render(){
		return <PopUp ref={this.PopUpRef} Header="Settings" canClose={true}>
			Thema<br/>
			<select defaultValue={currentTheme} onChange={ ev => SetSetting("Theme", ev.target.value)}>
				<option value={Theme.Light}>Licht</option>
				<option value={Theme.Dark}>Donker</option>
			</select>
		</PopUp>
	}

	Show(){
		this.PopUpRef.current?.Show();
	}
}

// sets the setting to value
function SetSetting(name: Settings, value: any){
	switch(name){
		case "Theme":
			currentTheme = value as Theme;
			SetCookie(name, currentTheme, new Date(9999, 12, 31));
			OnSettingChangedCallBacks.forEach(x => x(name, value));
			break;
	}
}

// adds a callback to when a setting is changed
export function AddOnSettingChangedCallBack(callback: ((setting: Settings, value: any) => any)){
	OnSettingChangedCallBacks.push(callback);
}

// gets the setting
export function GetSetting(setting: Settings){
	switch(setting){
		case "Theme":
			return currentTheme;
	}
}

// every possible setting
export type Settings = "Theme";