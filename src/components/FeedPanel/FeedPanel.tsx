import React, { Component } from "react";
import { FeedItem, FeedItemProps } from "./FeedItem";
import "./FeedPanel.scss";
import { sendAsJSON } from "../../ajax";
import { sendGetRequest } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";

export interface FeedPanelState {
  feedItems: Array<FeedItem>;
  pageNumber: number;
}
// The feed panel is a container for feed items
export class FeedPanel extends React.Component<{}, FeedPanelState> {
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
    this.state = {
      feedItems: Array<FeedItem>(
        new FeedItem({
          ID: "1",
          Title: "Test Title",
          Description: "test beschrijving",
        }),
        new FeedItem({
          ID: "1",
          Title: "Test Title",
          Description: "test beschrijving",
        })
      ),
      pageNumber: 0,
    };
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
        "http://192.168.2.15:12002/api/feedItem"
      );

      this.PopupRef.current?.Hide();
  }
  //gets the results of the get request and puts them into the state to be rendered out on the screen
  getFeedItems(l: number, o: number) {
    var result: Promise<string> = sendGetRequest(`http://localhost/api/feedItem?limit=${l.toString()}&offset=${o.toString()}`);
    result.then((res:string)=> {
      var feedItemArray:Array<FeedItemProps> = JSON.parse(res);
      var feedItems: Array<FeedItem> = [];
      feedItemArray.forEach(f => {
        var fItem:FeedItem = new FeedItem({ID: f.ID, Title: f.Title, Description: f.Description})
        feedItems.push(fItem);
      });
      this.setState({feedItems: feedItems})
    })
    }

  //Keeps track of the current page of feedItems the customers is viewing 
  updatePageNumber(amount: number) {
    this.setState({ pageNumber: this.state.pageNumber + amount });
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
          <ul>
            {this.state.feedItems.map((tag: FeedItem) => (
              <FeedItem
                key= {tag.props.ID}
                ID={tag.props.ID}
                Title={tag.props.Title}
                Description={tag.props.Description}
              ></FeedItem>
            ))}
          </ul>
          {this.getFeedItems(7, this.state.pageNumber)}
          {this.state.pageNumber > 0 ? (
            <button
              className="feed-button"
              onClick={() => {
                this.updatePageNumber(-7);
              }}
            >
              back
            </button>
          ) : null}{" "}
          {this.state.feedItems.length === 7 ? (
            <button
              className="feed-button"
              onClick={() => {
                this.updatePageNumber(7);
              }}
            >
              forward
            </button>
          ) : null}
        </div>

        <PopUp ref={this.PopupRef} Header="Feed Item aanmaken">
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
