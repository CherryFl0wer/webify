import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';

import { Route, Switch, withRouter, Router } from "react-router-dom";

import history from '../lib/history';

import ListOf from '../components/listof';
import Player from '../components/player';
import Playlist from '../components/playlist';

import '../assets/css/index.css';


const Body = (props) => {
    return (
        <div id={"page-content-wrapper"}>
            <div className={"container-fluid"}>

                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={ListOf} />
                        <Route path="/playlist-:title" component={Playlist} />
                    </Switch>
                </Router>
                <Player />
            </div>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    app: state.app
});



export default connect(mapStateToProps)(Body);