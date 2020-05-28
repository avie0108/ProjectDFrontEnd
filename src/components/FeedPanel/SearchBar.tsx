import * as React from "react";
import "./SearchBar.scss";

export interface SearchBarProps {
  action: any;
}

export interface SearchBarState {}

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  InputRef: React.RefObject<HTMLInputElement>;
  
  constructor(props: SearchBarProps) {
    super(props);

    this.InputRef = React.createRef<HTMLInputElement>();

    this.state = {};
  }

  render() {
    return (
      <div className="search-bar">
        {/* iframe is zodat de form submit de pagina niet refreshed */}
        <iframe title="formiframe" name="dummyframe" id="dummyframe"></iframe>
        <form action="#" onSubmit={this.props.action} target="dummyframe">
          <input className="search-term-input" type="text" placeholder="Uw zoekterm..." name="search" ref={this.InputRef} />
          <button className="search-submit" type="submit">Zoeken</button>
        </form>
      </div>
    );
  }
}
