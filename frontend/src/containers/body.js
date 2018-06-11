import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';

import { Route, Switch, withRouter, BrowserRouter as Router } from "react-router-dom";

import history from '../lib/history';

import ListOf from '../components/listof';
import Player from '../components/player';
import '../assets/css/index.css';


const Body = (props) => {
    return (
        <div id={"page-content-wrapper"}>
            <div className={"container-fluid"}>

                <Router history={history}>
                    <Switch>
                        <Route path="/" component={ListOf} />
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