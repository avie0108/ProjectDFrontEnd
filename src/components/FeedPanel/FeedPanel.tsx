import React from "react";
import { FeedItem } from "./FeedItem";
import "./FeedPanel.scss";

// The feed panel is a container for feed items
export class FeedPanel extends React.Component<{}, {}> {
  InputRef: React.RefObject<HTMLInputElement>;
  TextRef: React.RefObject<HTMLTextAreaElement>;
  CategorieRef: React.RefObject<HTMLInputElement>;

  constructor(props: {}) {
    super(props);
    //Creates a react reference for each feed item field in the form using this reference we can get the elements values
    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategorieRef = React.createRef<HTMLInputElement>();
  }

  // Add feed items to the panel
  getFeedItems() {
    let rows = [];

    // For now we add 8 feed items to the panel
    for (let i = 0; i < 8; i++) {
      rows.push(<FeedItem />);
    }

    return rows;
  }

  render() {
    return (
      <div className="feed-panel">
        <div className="feed-items">
          <h2>Feed Items</h2>
          <h3>this.state.test</h3>
          {this.getFeedItems()}
        </div>
        <div className="feed-form">
          <h2>Feed Item aanmaken</h2>
          <form action="#" onSubmit={() => this.handleFormSubmit()}>
            <input
              type="text"
              className="form-element"
              placeholder="Titel"
              id="Titel"
              ref={this.InputRef}
            ></input>
            <br />
            <textarea
              className="form-element"
              placeholder="Typ uw bericht"
              id="Tekstveld"
              ref={this.TextRef}
            ></textarea>
            <br />
            {/* this is for the form  */}
            <input 
              id="categorie"
              type="text" 
              list="datalist" 
              placeholder="Selecteer een categorie" 
              className="form-element"
              ref={this.CategorieRef}/>
              <datalist id="datalist">
	              <option>Algemene mededeling</option>
	              <option>Notule</option>
	              <option>Persoonlijk</option>
              </datalist>

            <input type="submit" id="feed-form-submit" value="Aanmaken"></input>
          </form>
        </div>
      </div>
    );
  }

  //sends formdata in JSON to the server server
  handleFormSubmit() {
    var xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("post", "localhost:3001/endpoint", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    var json: string = JSON.stringify({
      Titel: this.InputRef.current?.value,
      Beschrijving: this.TextRef.current?.value,
      Categorie: this.CategorieRef.current?.value,
    });
    console.log(json);
    xhttp.send(json);

  }
}
