import React, { Component } from "react";
import { FeedItem, FeedItemProps } from "./FeedItem";
import "./FeedPanel.scss";
import { sendAsJSON } from "../../ajax";
import { sendGetRequest } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";

export interface FeedPanelState
{
  feedItems:Array<FeedItem>;
  pageNumber:number
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
    this.state = {feedItems: Array<FeedItem>(new FeedItem({ID: '1', Title:'Test Title', Description:'test beschrijving'}), new FeedItem({ID: '1', Title:'Test Title', Description:'test beschrijving'},)),
                  pageNumber: 0}

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

  getFeedItems(l:number, o:number) {
    var result: Array<FeedItem> = sendGetRequest(`http://localhost/api/feedItem?limit=${l.toString()}&offset=${o.toString()}`)
    console.log(result)
  }

  updatePageNumber(amount:number){
    this.setState({pageNumber: this.state.pageNumber + amount})
    console.log(this.state.pageNumber)
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
            {this.state.feedItems.map((tag: FeedItem) => <FeedItem ID = {tag.props.ID} Title = {tag.props.Title} Description = {tag.props.Description}></FeedItem>)}
          </ul>
          {this.getFeedItems(7,this.state.pageNumber)}

        {this.state.pageNumber > 0 ? <button className="feed-button" onClick={()=>{this.updatePageNumber(-7)}}>back</button> : null} {this.state.feedItems.length === 7 ?<button className="feed-button" onClick={()=>{this.updatePageNumber(7)}}>forward</button>:null}
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
              className="feed-button"
            />
          </div>
        </PopUp>
      </div>
    );
  }
}
