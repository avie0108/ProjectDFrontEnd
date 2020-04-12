import React from "react";
import { FeedItem } from "./FeedItem";
import "./FeedPanel.scss";

// The feed panel is a container for feed items
export class FeedPanel extends React.Component<{}, {}> {
  InputRef: React.RefObject<HTMLInputElement>;
  TextRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: {}) {
    super(props);

    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
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

            <input type="submit" id="feed-form-submit" value="Aanmaken"></input>
          </form>
        </div>
      </div>
    );
  }

  handleFormSubmit() {
    var xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("post", "localhost:3001/endpoint", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    
    var json: string = JSON.stringify({
      Titel: this.InputRef.current?.value,
      Beschrijving: this.TextRef.current?.value,
    });
    
    xhttp.send(json);

  }
}
