import React from 'react';
import ReactDOM from 'react-dom';
import FeedItem from './FeedItem';
import './FeedPanel.scss';

class FeedPanel extends React.Component {
    getFeedItems() {
        let rows = [];

        for (let i = 0; i < 8; i++) {
            rows.push(<FeedItem />);
        }

        return rows;
    }

    render() {
        return (
            <div className="feed-panel">
                <div className="feed-items">
                    <h2>Feed Items</h2>
                    {this.getFeedItems()}
                </div>
                <div className="feed-form">
                    <h2>Feed Item aanmaken</h2>
                    <form action="/" method="POST">
                        <input type="text" className="form-element" placeholder="Titel"></input><br/>
                        <textarea className="form-element" placeholder="Typ uw bericht"></textarea><br/>

                        <input type="submit" id="feed-form-submit" value="Aanmaken"></input>
                    </form>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<FeedPanel />, document.getElementById('root'));

export default FeedPanel;
