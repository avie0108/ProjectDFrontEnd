import * as React from 'react';
import { Component } from 'react';
import { sendGetRequest } from "../../ajax";
 
export interface SearchBarProps {
    action:any
}
 
export interface SearchBarState {
    
}
 
export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
    constructor(props: SearchBarProps) {
        super(props);
        this.state = {};
    }

    getSearchResult(limit:number, offset:number):Promise<string>{
        var searchString:string = (document.getElementsByClassName("search-bar-input") as any).value
        return(sendGetRequest(`http://localhostapi/feedItem?searchString=${searchString}&limit=${limit}&offset=${offset}`))
    }

    render() { 
        return (
            <form action="#" onSubmit={this.props.action}>
                <input type="text" placeholder="Search.." name="search" className="search-bar-input"/>
                <button type="submit">Submit</button>
            </form>
          );
    }
}
 
