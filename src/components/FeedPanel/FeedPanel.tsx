import React from "react";
import { FeedItem } from "./FeedItem";
import "./FeedPanel.scss";
import { sendAsJSON } from "../../ajax"

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
          {this.getFeedItems()}
        </div>
        <div className="feed-form">
          <h2>Feed Item aanmaken</h2>
          <form action="#" onSubmit={() => sendAsJSON({
      title: this.InputRef.current?.value,
      description: this.TextRef.current?.value,
      category: this.CategorieRef.current?.value,
    }, "/api/feedItem")}>
            <input
              type="text"
              className="form-element"
              placeholder="Titel"
              id="title"
              ref={this.InputRef}
            ></input>
            <br />
            <textarea
              className="form-element"
              placeholder="Type uw bericht"
              id="textfield"
              ref={this.TextRef}
            ></textarea>
            <br />
            {/* this is for the form  */}
            <input
              id="category"
              type="text"
              list="datalist"
              placeholder="Selecteer een categorie"
              className="form-element"
              ref={this.CategorieRef}
            />
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
}
