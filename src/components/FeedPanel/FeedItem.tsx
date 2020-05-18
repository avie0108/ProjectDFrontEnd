import React from 'react';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import './FeedItem.scss';
import { sendAsJSON } from "../../ajax";
import { PopUp } from "../Pop-up/Pop-up";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface FeedItemProps {
  // ID of the feed item
  ID: string
  // This of the feed item
  Title: string;
  // Description of the feed item
  Description: string;
  // Category of the feed item
  Category: string;
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

    // The form elements
    this.InputRef = React.createRef<HTMLInputElement>();
    this.TextRef = React.createRef<HTMLTextAreaElement>();
    this.CategoryRef = React.createRef<HTMLSelectElement>();

    // The edit pop up
    this.EditPopupRef = React.createRef<PopUp>();
  }

  // Shows the edit pop up
  showEditPopup() {
    this.EditPopupRef.current?.Show();
  }

  showDeletePopup() {
    if (window.confirm("Weet u zeker dat u deze feed item wilt verwijderen?")) {
      this.deleteFeedItem();
    }
  }

  // Makes a call to edit the feed item
  // Uses the values in the pop up that is displayed
  editFeedItem() {
    sendAsJSON(
      {
        newTitle: this.InputRef.current?.value,
        newDescription: this.TextRef.current?.value,
        newCategory: this.CategoryRef.current?.value
      },
      "PATCH",
      "http://192.168.2.15:12002/api/feedItem?id=" + this.props.ID
    );
  }

  deleteFeedItem() {
    sendAsJSON(
      {},
      "DELETE",
      "http://192.168.2.15:12002/api/feedItem?id=" + this.props.ID
    );
  }

  getDutchCategoryName() {
    switch (this.props.Category) {
      case "General":
        return "Algemeen";
      case "Personal":
        return "Persoonlijk";
      case "Note":
        return "Notule";
    }
  }

  render() {
    return (
      <div className="feed-item">
        <div className="feed-item-options">
          <div onClick={() => this.showEditPopup()}><FontAwesomeIcon icon={faEdit} /></div>
          <div>&nbsp;</div>
          <div onClick={() => this.showDeletePopup()}><FontAwesomeIcon icon={faTrashAlt} /></div>
        </div>
        <div className="feed-item-text-container">
          <div className="feed-item-title">{this.props.Title}</div>
          <div className="feed-item-description">{this.props.Description}</div>
          <div className={'feed-item-category ' + this.props.Category}>{this.getDutchCategoryName()}</div>
        </div>
        <div className="feed-item-image-container">
          <div className="feed-item-image"></div>
        </div>

        <PopUp ref={this.EditPopupRef} Header={"Feed item wijzigen"}>
          <div className="feed-form">
            <form onSubmit={() => this.editFeedItem()}>
              <input type="text" className="form-element" placeholder="Nieuwe titel" id="title" ref={this.InputRef} required></input><br />
              <textarea className="form-element" placeholder="Type uw nieuwe bericht" id="textfield" ref={this.TextRef} required></textarea><br />
              <select id="category" className="form-element" ref={this.CategoryRef} required>
                <option value="" selected disabled>Kies een nieuwe categorie...</option>
                <option value="General">Algemeen</option>
                <option value="Personal">Persoonlijk</option>
                <option value="Note">Notule</option>
              </select>
              <input type="submit" value="Wijzigen" className="feed-button" />
            </form>
          </div>
        </PopUp>
      </div>
    );
  }
}
