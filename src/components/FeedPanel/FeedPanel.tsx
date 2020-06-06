import React from "react";
import { FeedItem, FeedItemProps } from "./FeedItem";
import "./FeedPanel.scss";
import { sendAsJSON, sendGetRequest } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";
import { SearchBar } from "./SearchBar";
import { Server } from "../../Data";


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
  SeachBarRef: React.RefObject<SearchBar>;
  FilterBarRef: React.RefObject<HTMLSelectElement>;

  constructor(props: {}) {
    super(props);

    //Creates a react reference for each feed item field in the form using this reference we can get the elements values
    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategoryRef = React.createRef<HTMLSelectElement>();
    this.PopupRef = React.createRef<PopUp>();
    this.SeachBarRef = React.createRef<SearchBar>();
    this.FilterBarRef = React.createRef<HTMLSelectElement>();

    this.state = {
      feedItems: Array<FeedItem>(),
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
      `http://${Server}/api/feedItem`
    );

    this.PopupRef.current?.Hide();
  }

  getFilterResult(){
    this.SeachBarRef.current!.InputRef.current!.value = "";
    document.getElementById("search-term-label")!.style.display = "none";

    if(this.FilterBarRef.current?.value != ""){
      var result: Promise<string> = sendGetRequest(`http://${Server}/api/feedItem?category=${this.FilterBarRef.current?.value}&limit=7&offset=${this.state.pageNumber}`);
      result.then((res: string) => {
        if (res) {
          try {
            var feedItemArray: Array<FeedItemProps> = JSON.parse(res);
            var feedItems: Array<FeedItem> = [];
            feedItemArray.forEach(f => {
              var fItem: FeedItem = new FeedItem({ ID: f.ID, Title: f.Title, Description: f.Description, Category: f.Category, UserEmail: f.UserEmail })
              feedItems.push(fItem);
            });
            this.setState({ feedItems: feedItems });
            this.setFilter(this.getDutchCategoryName(this.FilterBarRef.current!.value));
          } catch {}
      }
    })
  }
}

  setFilter(filter: string) {
    if (!filter) {
      document.getElementById("filter-label")!.style.display = "none";
      return;
    } else {
      document.getElementById("filter-label")!.style.display = "block";
    }

    document.getElementById("filter-choice")!.innerText = filter;
  }

  resetFilter() {
    this.getFeedItems(7, this.state.pageNumber, "");

    this.FilterBarRef.current!.selectedIndex = 0;

    document.getElementById("filter-label")!.style.display = "none";
  }

  // Gets the results of the get request and puts them into the state to be rendered out on the screen
  getFeedItems(limit: number, offset: number, searchString: any) {
    this.FilterBarRef.current!.selectedIndex = 0;
    document.getElementById("filter-label")!.style.display = "none";

    // If the searchString has no value, assign the empty string.
    searchString = !searchString ? "" : searchString;

    var result: Promise<string> = sendGetRequest(`http://${Server}/api/feedItem?search_string=${searchString.toString()}&limit=${limit.toString()}&offset=${offset.toString()}`);

    result.then((res: string) => {
      if (res) {
        try {
          var feedItemArray: Array<FeedItemProps> = JSON.parse(res);
          var feedItems: Array<FeedItem> = [];
          feedItemArray.forEach(f => {
            var fItem: FeedItem = new FeedItem({ ID: f.ID, Title: f.Title, Description: f.Description, Category: f.Category, UserEmail: f.UserEmail })
            feedItems.push(fItem);
          });
          this.setState({ feedItems: feedItems });
          this.setSearchTerm(searchString);
        } catch {}
      }
    })
  }

  setSearchTerm(searchString: string) {
    if (!searchString) {
      document.getElementById("search-term-label")!.style.display = "none";
      return;
    } else {
      document.getElementById("search-term-label")!.style.display = "block";
    }

    document.getElementById("search-term")!.innerText = searchString;
  }

  resetSearch() {
    this.getFeedItems(7, this.state.pageNumber, "");

    if (this.SeachBarRef.current?.InputRef && this.SeachBarRef.current!.InputRef.current?.value) {
      this.SeachBarRef.current!.InputRef.current!.value = "";
    }
  }

  //gets the items of the next or previous page
  movePage(NextOrPrev: 'prev' | 'next') {

    var x:number = NextOrPrev === 'prev' ? -7 : 7
    this.setState({ pageNumber: this.state.pageNumber + x }, () => {this.getFeedItems(7, this.state.pageNumber, "")});

  }

  // gets this items category in dutch
  getDutchCategoryName(category: string) {
    switch (category) {
      case "General":
        return "Algemeen";
      case "Personal":
        return "Persoonlijk";
      case "Note":
        return "Opmerking";
      default:
        return "";
    }
  }

  // sets the interval for getting feed items
  componentDidMount(){
    this.getFeedItems(7, this.state.pageNumber, "");
    // setInterval(() => {this.getFeedItems(7, this.state.pageNumber)}, 5000)
  }

  render() {
    return (
      <div className="feed-panel">
        <div className="feed-items">
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <h2>Feed Items</h2>
          </div>
          <button
            onClick={() => this.PopupRef.current?.Show()}
            className="feed-button"
          >
            Nieuw Feed Item
          </button>
          
          <SearchBar ref={this.SeachBarRef} action= {()=>{this.getFeedItems(7, this.state.pageNumber, this.SeachBarRef.current?.InputRef.current?.value);}}/>
          <select id="category-filter" className="form-element" required ref={this.FilterBarRef} onChange={() => {this.getFilterResult()}}>
            <option value="" selected disabled>Filter feed items...</option>
            <option value="General">Algemeen</option>
            <option value="Personal">Persoonlijk</option>
            <option value="Note">Opmerking</option>
          </select>
          <div id="filter-label">
            Feed items met categorie <span id="filter-choice"></span>
            <span title="Filter resetten" id="filter-reset" onClick={() => this.resetFilter()}>Reset ❌</span>
          </div>

          <div id="search-term-label">
            Feed items met term <span id="search-term"></span>
            <span title="Zoekterm resetten" id="search-term-reset" onClick={() => this.resetSearch()}>Reset ❌</span>
          </div>
          <ul>
            {this.state.feedItems.map((tag: FeedItem) => (
              <FeedItem
                key={tag.props.ID}
                ID={tag.props.ID}
                Title={tag.props.Title}
                Description={tag.props.Description}
                Category={tag.props.Category}
                UserEmail={tag.props.UserEmail}
              ></FeedItem>
            ))}
          </ul>
          {this.state.pageNumber > 0 ? (
            <button className="feed-button feed-button-prev" onClick={() => { this.movePage('prev'); }}>Vorige</button>) : null}{" "}
          {this.state.feedItems.length === 7 ? (
            <button className="feed-button feed-button-next" onClick={() => { this.movePage('next'); }}>Volgende</button>) : null}
        </div>

        <PopUp ref={this.PopupRef} Header="Feed Item aanmaken">
          <div className="feed-form">
            <form onSubmit={() => this.sendFeedItem()}>
              <input type="text" className="form-element" placeholder="Titel" id="title" ref={this.InputRef} required></input><br />
              <textarea className="form-element" placeholder="Type uw bericht" id="textfield" ref={this.TextRef} required></textarea><br />
              <select id="category" className="form-element" ref={this.CategoryRef} required>
                <option value="" selected disabled>Kies een categorie...</option>
                <option value="General">Algemeen</option>
                <option value="Personal">Persoonlijk</option>
                <option value="Note">Opmerking</option>
              </select>
              <input type="submit" value="Aanmaken" className="feed-button" />
            </form>
          </div>
        </PopUp>
      </div>
    );
  }
}
