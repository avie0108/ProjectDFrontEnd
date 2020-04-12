import React from "react";
import { FeedItem } from "./FeedItem";
import "./FeedPanel.scss";

// The feed panel is a container for feed items
export class FeedPanel extends React.Component {
  state = { titel: "", tekstveld: "" };

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
          <form action="#">
            <input
              type="text"
              className="form-element"
              placeholder="Titel"
              id="Titel"
              onChange={this.handleForm}
            ></input>
            <br />
            <textarea
              className="form-element"
              placeholder="Typ uw bericht"
              id="Tekstveld"
              onChange={this.handleForm}
            ></textarea>
            <br />

            <input type="submit" id="feed-form-submit" value="Aanmaken"></input>
          </form>
          <span>{this.state.titel}</span>
          <span>{this.state.tekstveld}</span>
        </div>
      </div>
    );
  }
  handleForm = (event: any) => {
    if (event.target.id === "Titel") {
      this.setState({ titel: event.target.value });
    }
    if (event.target.id === "Tekstveld") {
      this.setState({ tekstveld: event.target.value });
    }
  };
  handleFormSubmit = (event: any)
}
