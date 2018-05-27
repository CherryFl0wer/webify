import React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardImg, CardText, CardBody, CardHeader, CardFooter,
    CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';


import { Route, Switch, withRouter, BrowserRouter as Router } from "react-router-dom";

import * as FontAwesome from 'react-fontawesome';

import { spotifyLoggin } from '../actions/app';

import Register from '../components/register';
import Logme from '../components/logme';
import SpotifyHandler from '../lib/SpotifyHandler';

import '../assets/css/index.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>



                <div className="container">
                    <div className="row align-items-center center-box" id="login">

                        <div className="col-md-12">

                            <h3><FontAwesome name='headphones' /> Webify</h3>
                            <Router>
                                <Switch>
                                    <Route exact path="/" component={Logme} />
                                    <Route path="/register" component={Register} />
                                    <Route path="/spotify-login" component={SpotifyHandler} />
                                </Switch>
                            </Router>
                        </div>
                    </div>


                </div>
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    spotifyConnexion: () => {
        dispatch(spotifyLoggin());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);