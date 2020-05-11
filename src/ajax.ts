//sends formdata in JSON to the server
export function sendAsJSON(object:{}, endpoint:string){
    var xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("post", endpoint, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    var json: string = JSON.stringify(object);
    console.log(json);
    xhttp.send(json);
    xhttp.onreadystatechange = function() {
        if (this.status === 0 || (this.status >= 200 && this.status < 400)) {
          console.log(this.responseText);
        }
    }
}