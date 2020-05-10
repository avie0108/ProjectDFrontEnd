import React from 'react';
import './FeedItem.scss';


interface FeedItemProps
{
  id:string
  title:string;
  description:string;
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
          <div className="feed-item-title">{this.props.title}</div>
          <div className="feed-item-desc">{this.props.description}</div>
          <div className="feed-item-reply-like-comment">Reply Like Comment</div>
        </div>
        <div className="feed-item-image-container">
          <div className="feed-item-image"></div>
        </div>
      </div>
    );
  }
}
