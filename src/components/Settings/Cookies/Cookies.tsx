// creates/edits a cookie
export function SetCookie(name: string, value: any, expires?: Date, path?: string){
	let newCookie = name + '=' + value;
	if(expires !== undefined)
		newCookie += "; expires" + expires.toUTCString();
	newCookie += "; path=" + (path !== undefined ? path : '/');

	document.cookie = newCookie;
}

// gets the value of a cookie
export function GetCookie(name: string){
	return document.cookie.replace(RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$", 'g'), "$1");
}

// checks if a cookie exists
export function CheckCookie(name: string): boolean{
	return document.cookie.split(';').some((item) => item.trim().startsWith(name + '='))
}