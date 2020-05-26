import * as React from "react";
import { sendGetRequest } from "../../ajax";
import "./SearchBar.scss";

export interface SearchBarProps {
  action: any;
}

export interface SearchBarState {}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: SearchBarProps) {
    super(props);

    this.inputRef = React.createRef<HTMLInputElement>();

    this.state = {};
  }

  getSearchResult(limit: number, offset: number): Promise<string> {
    console.log(this.inputRef.current?.value);
    return sendGetRequest(
      `http://localhost/api/feedItem?searchString=${this.inputRef.current?.value}&limit=${limit}&offset=${offset}`
    );
  }

  render() {
    return (
      <div>
        {/* iframe is zodat de form submit de pagina niet refreshed */}
        <iframe title="formiframe" name="dummyframe" id="dummyframe"></iframe>
        <form action="#" onSubmit={this.props.action} target="dummyframe">
          <input
            type="text"
            placeholder="Search.."
            name="search"
            ref={this.inputRef}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
