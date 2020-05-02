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

  //since inputs without form don't have validations this function does, if everthings alright it sends the feed
  sentFeedItem() {
    var inputs:NodeListOf<HTMLInputElement> | undefined = document.getElementsByClassName("feed-form").item(0)?.querySelectorAll("input[class = 'form-element']");
    var filledIn: Boolean = true;
    inputs?.forEach((x) =>
      x.value === "" || x.value === "aanmaken"
        ? (filledIn = false)
        : true
    );
    if (filledIn === true) {
      this.PopupRef.current?.Hide();
      sendAsJSON(
        {
          title: this.InputRef.current?.value,
          description: this.TextRef.current?.value,
          category: this.CategorieRef.current?.value,
        },
        "http://192.168.2.19:12002/api/feedItem"
      );
    } else {
      alert("Vul alle velden in alstublieft.");
    }
  }

  render() {
    return (
      <div className="feed-panel">
        <div className="feed-items">
          <h2>Feed Items</h2>
          <button
            onClick={() => this.PopupRef.current?.Show()}
            className="feed-button"
          >
            Creëer feed item
          </button>
          {this.getFeedItems()}
        </div>

        <PopUp ref={this.PopupRef}>
          <div className="feed-form">
            <h2>Feed Item aanmaken</h2>
            <input
              type="text"
              className="form-element"
              placeholder="Titel"
              id="title"
              ref={this.InputRef}
              required
            ></input>
            <br />
            <textarea
              className="form-element"
              placeholder="Type uw bericht"
              id="textfield"
              ref={this.TextRef}
              required
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
              required
            />
            <datalist id="datalist">
              <option>Algemene mededeling</option>
              <option>Notule</option>
              <option>Persoonlijk</option>
            </datalist>

            <input
              onClick={() => this.sentFeedItem()}
              type="button"
              value="aanmaken"
            />
          </div>
        </PopUp>
      </div>
    );
  }
}
