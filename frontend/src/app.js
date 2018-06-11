import React from 'react';
import { hot } from 'react-hot-loader';

import { connect } from 'react-redux';


import Body from './containers/body';
import Menu from './containers/menu';
import Login from './containers/login';

import { getUserSession } from './actions/app';

import './assets/css/main.css'

const libs = ["Songs", "Listened recently", "Youtube"];
const playlists = ["Playlist 1", "Playlist 2", "Playlist 3"];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.props.userSession();
    }

    render() {
        if (this.props.app.is_connected) {
            return (
                <div id="wrapper" className={"toggled"}>
                    <Menu title="Webify" libs={libs} playlists={playlists} />
                    <Body />
                </div>
            );
        } else {
            return (
                <Login />
            )
        }
    }
}


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({

    userSession: () => {
        dispatch(getUserSession());
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App))