import React from "react";
import { FeedItem } from "./FeedItem";
import "./FeedPanel.scss";
import { sendAsJSON } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";

// The feed panel is a container for feed items
export class FeedPanel extends React.Component<{}, {}> {
  InputRef: React.RefObject<HTMLInputElement>;
  TextRef: React.RefObject<HTMLTextAreaElement>;
  CategorieRef: React.RefObject<HTMLInputElement>;
  PopupRef: React.RefObject<PopUp>;

  constructor(props: {}) {
    super(props);
    //Creates a react reference for each feed item field in the form using this reference we can get the elements values
    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategorieRef = React.createRef<HTMLInputElement>();
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

  render() {
    return (
      <div className="feed-panel">
        <div className="feed-items">
        <h2>Feed Items</h2><button onClick = {() =>this.PopupRef.current?.Show()} className= "feed-button">Feed Item aanmaken</button>
          {this.getFeedItems()}
          
        </div>
        
        <PopUp ref = {this.PopupRef}>
          <div className="feed-form">
            <h2>Feed Item aanmaken</h2>
            <form
              action="#"
              onSubmit={() =>
                sendAsJSON(
                  {
                    title: this.InputRef.current?.value,
                    description: this.TextRef.current?.value,
                    category: this.CategorieRef.current?.value,
                  },
                  "/api/feedItem"
                )
              }
            >
              <input
                type="text"
                className="form-element"
                placeholder="Titel"
                id="title"
                ref={this.InputRef}
                required
              ></input>
              <br />
              <select
                id="category"
                placeholder="Selecteer een categorie"
                className="form-element"
                ref={() => this.CategorieRef}>
                    <option disabled selected>Categorie...</option>
                    <option>Algemene mededeling</option>
                    <option>Persoonlijk bericht</option>
                    <option>Notule</option>
              </select>
              <br />
              <textarea
                className="form-element"
                placeholder="Typ uw bericht..."
                id="textfield"
                ref={this.TextRef}
              ></textarea>

              <input
                onClick = {() =>this.PopupRef.current?.Hide()}
                type="submit"
                id="feed-form-submit"
                value="Aanmaken"
              ></input>
            </form>
          </div>
        </PopUp>
      </div>
    );
  }
}
