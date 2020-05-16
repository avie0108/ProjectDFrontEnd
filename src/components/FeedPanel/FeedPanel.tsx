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
  CategorieRef: React.RefObject<HTMLInputElement>;
  PopupRef: React.RefObject<PopUp>;

  constructor(props: {}) {
    super(props);
    //Creates a react reference for each feed item field in the form using this reference we can get the elements values
    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategorieRef = React.createRef<HTMLInputElement>();
    this.PopupRef = React.createRef<PopUp>();
    this.state = {
      feedItems: Array<FeedItem>(),
      pageNumber: 0,
    };
  }

  //since inputs without form don't have validations this function does, if everthings alright it sends the feed
  sentFeedItem() {
    var inputs:
      | NodeListOf<HTMLInputElement>
      | undefined = document
      .getElementsByClassName("feed-form")
      .item(0)
      ?.querySelectorAll("input[class = 'form-element']");
    var filledIn: Boolean = true;
    inputs?.forEach((x) =>
      x.value === "" || x.value === "aanmaken" ? (filledIn = false) : true
    );
    if (filledIn === true) {
      this.PopupRef.current?.Hide();
      sendAsJSON(
        {
          title: this.InputRef.current?.value,
          description: this.TextRef.current?.value,
          category: this.CategorieRef.current?.value,
        },
        "http://localhost/api/feedItem"
      );
    } else {
      alert("Vul alle velden in alstublieft.");
    }
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
  movePage(NextOrPrev: 'prev' | 'next') {

    var x:number = NextOrPrev === 'prev' ? -7 : 7
    this.setState({ pageNumber: this.state.pageNumber + x }, () => {this.getFeedItems(7, this.state.pageNumber)});

  }

  componentDidMount(){
    this.getFeedItems(7, this.state.pageNumber)
    setInterval(() => {this.getFeedItems(7, this.state.pageNumber)}, 5000)
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
          {this.state.pageNumber > 0 ? (
            <button
              className="feed-button"
              onClick={() => {
                this.movePage('prev');
              }}
            >
              back
            </button>
          ) : null}{" "}
          {this.state.feedItems.length === 7 ? (
            <button
              className="feed-button"
              onClick={() => {
                this.movePage('next');
              }}
            >
              forward
            </button>
          ) : null}
        </div>

        <PopUp ref={this.PopupRef} Header="Feed Item aanmaken">
          <div className="feed-form">
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
              className="feed-button"
            />
          </div>
        </PopUp>
      </div>
    );
  }
}
