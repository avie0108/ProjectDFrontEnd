// Sends formdata in JSON to the server
export function sendAsJSON(object: {}, method: string, endpoint: string) {
	var xhttp: XMLHttpRequest = new XMLHttpRequest();
	xhttp.open(method, endpoint, true);
	xhttp.setRequestHeader("Content-type", "application/json");

	xhttp.withCredentials = true;

	var json: string = JSON.stringify(object);
	xhttp.send(json);
	xhttp.onreadystatechange = function () {
		if (this.status === 0 || (this.status >= 200 && this.status < 400)) {
			console.log(this.responseText);
		}
	};
}

// Gets data from the requested endpoint
export function sendGetRequest(endpoint: string): Promise<string> {
	return new Promise((resolve, reject) => {
		var xhttp: XMLHttpRequest = new XMLHttpRequest();
		xhttp.open("GET", endpoint, true);
		xhttp.setRequestHeader("Content-type", "application/json");
		
		xhttp.withCredentials = true;
		
		let result: string = "";
		xhttp.onloadend = function () {
			result = this.responseText;
			resolve(result)
		};
		xhttp.send();
	})
}
