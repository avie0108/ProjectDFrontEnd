import React from 'react';
import './FeedItem.scss';


export interface FeedItemProps
{
  ID:string
  Title:string;
  Description:string;
}
// Feed items are posts a user can make
// It contains a title, a description and optionally a picture
export class FeedItem extends React.Component<FeedItemProps,{}> {

  constructor(props: FeedItemProps) {
    super(props);

  }

  render() {
    return (
      <div className="feed-item">
        <div className="feed-item-text-container">
          <div className="feed-item-title">{this.props.Title}</div>
          <div className="feed-item-desc">{this.props.Description}</div>
          <div className="feed-item-reply-like-comment">Reply Like Comment</div>
        </div>
        <div className="feed-item-image-container">
          <div className="feed-item-image"></div>
        </div>
      </div>
    );
  }
}
