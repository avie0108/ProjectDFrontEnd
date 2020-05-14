import React, { ReactHTML } from 'react';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons'
import './FeedItem.scss';
import { sendAsJSON } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface FeedItemProps {
  // The ID of the feed item
  ID: number;
}

// Feed items are posts a user can make
// It contains a title, a description and optionally a picture
export class FeedItem extends React.Component<FeedItemProps, {}> {
  InputRef: React.RefObject<HTMLInputElement>;
  TextRef: React.RefObject<HTMLTextAreaElement>;
  CategoryRef: React.RefObject<HTMLSelectElement>;
  EditPopupRef: React.RefObject<PopUp>;

  constructor(props: FeedItemProps) {
    super(props);

    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategoryRef = React.createRef<HTMLSelectElement>();
    this.EditPopupRef = React.createRef<PopUp>();
  }

  showEditPopup() {
    this.EditPopupRef.current?.Show();
  }

  editFeedItem() {
    sendAsJSON(
      {
        newTitle: this.InputRef.current?.value,
        newDescription: this.TextRef.current?.value,
        category: this.CategoryRef.current?.value
      },
      "PATCH",
      "http://192.168.2.15:12002/api/feedItem?id=" + this.props.ID
    );
  }

  render() {
    return (
      <div className="feed-item">
        <div className="feed-item-edit" onClick={() => this.showEditPopup()}><FontAwesomeIcon icon={faEdit} /></div>
        <div className="feed-item-text-container">
          <div className="feed-item-title">Lorem ipsum dolor sit amet et delectus</div>
          <div className="feed-item-desc">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</div>
          <div className="feed-item-reply-like-comment">
            <a href="/">Reply</a> | <a href="/">Like</a> | <a href="/">Comment</a>
          </div>
        </div>
        <div className="feed-item-image-container">
          <div className="feed-item-image"></div>
        </div>

        <PopUp ref={this.EditPopupRef} Header={"Feed item wijzigen"}>
          <div className="feed-form">
            <form onSubmit={() => this.editFeedItem()}>
              <input type="text" className="form-element" placeholder="Nieuwe titel" id="title" ref={this.InputRef} required></input><br/>
              <textarea className="form-element" placeholder="Type uw nieuwe bericht" id="textfield" ref={this.TextRef} required></textarea><br/>
              <select id="category" className="form-element" ref={this.CategoryRef} required>
                <option value="" selected disabled>Kies een nieuwe categorie...</option>
                <option value="General">Algemeen</option>
                <option value="Personal">Persoonlijk</option>
                <option value="Note">Notule</option>
              </select>
              <input type="submit" value="Wijzigen" className="feed-button"/>
            </form>
          </div>
        </PopUp>
      </div>
    );
  }
}
