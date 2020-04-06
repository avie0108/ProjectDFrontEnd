import React from 'react';
import ReactDOM from 'react-dom';
import './FeedItem.scss';

class FeedItem extends React.Component {
  render() {
    return (
      <div className="feed-item">
        <div className="feed-item-text-container">
          <div className="feed-item-title">Lorem ipsum dolor sit amet et delectus</div>
          <div className="feed-item-desc">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</div>
          <div className="feed-item-reply-like-comment">Reply Like Comment</div>
        </div>
        <div className="feed-item-image-container">
          <div className="feed-item-image"></div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<FeedItem />, document.getElementById('root'));

export default FeedItem;
