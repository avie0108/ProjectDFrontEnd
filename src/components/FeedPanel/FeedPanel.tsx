import React from "react";
import { FeedItem } from "./FeedItem";
import "./FeedPanel.scss";
import { sendAsJSON } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";

// The feed panel is a container for feed items
export class FeedPanel extends React.Component<{}, {}> {
  InputRef: React.RefObject<HTMLInputElement>;
  TextRef: React.RefObject<HTMLTextAreaElement>;
  CategoryRef: React.RefObject<HTMLSelectElement>;
  PopupRef: React.RefObject<PopUp>;

  constructor(props: {}) {
    super(props);
    //Creates a react reference for each feed item field in the form using this reference we can get the elements values
    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategoryRef = React.createRef<HTMLSelectElement>();
    this.PopupRef = React.createRef<PopUp>();
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

  // Sends a feed item to the server
  sendFeedItem() {
      sendAsJSON(
        {
          title: this.InputRef.current?.value,
          description: this.TextRef.current?.value,
          category: this.CategoryRef.current?.value
        },
        "POST",
        "http://192.168.2.17:12002/api/feedItem"
      );

      this.PopupRef.current?.Hide();
  }

  render() {
    return (
      <div className="feed-panel">
        <div className="feed-items">
          <h2>Feed Items</h2>
          <button className="feed-button" onClick={() => this.PopupRef.current?.Show()}>Feed Item aanmaken</button>

          {this.getFeedItems()}
        </div>

        <PopUp ref={this.PopupRef}>
          <div className="feed-form">
            <h2>Feed Item aanmaken</h2>
            <form onSubmit={() => this.sendFeedItem()}>
              <input type="text" className="form-element" placeholder="Titel" id="title" ref={this.InputRef} required></input><br/>
              <textarea className="form-element" placeholder="Type uw bericht" id="textfield" ref={this.TextRef} required></textarea><br/>
              <select id="category" className="form-element" ref={this.CategoryRef} required>
                <option value="" selected disabled>Kies een categorie...</option>
                <option value="General">Algemeen</option>
                <option value="Personal">Persoonlijk</option>
                <option value="Note">Notule</option>
              </select>
              <input type="submit" value="Aanmaken" className="feed-button"/>
            </form>
          </div>
        </PopUp>
      </div>
    );
  }
}
