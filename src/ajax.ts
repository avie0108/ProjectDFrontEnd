import { FeedItem } from "./components/FeedPanel/FeedItem";
import { FeedItemProps } from "./components/FeedPanel/FeedItem";

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

//gets data from the requested endpoint
export function sendGetRequest(endpoint:string): Array <FeedItem>{
  var xhttp: XMLHttpRequest = new XMLHttpRequest();
  var result: Array <FeedItemProps>;
  var FeeditemArray = Array <FeedItem>();
  xhttp.onreadystatechange = function() {
    if (this.status === 0 || (this.status >= 200 && this.status < 400)) {
      result = JSON.parse(this.responseText);
      result.forEach(element => {
        var Elementprops:FeedItemProps = {ID: element.ID, Title: element.Title, Description:element.Description}
        var feedItem: FeedItem = new FeedItem(Elementprops);
        FeeditemArray.push(feedItem)
      });
    }
  }

  xhttp.open("GET", endpoint, true);
  xhttp.send();
  return FeeditemArray;
}