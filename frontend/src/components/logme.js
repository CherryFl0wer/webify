import React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardImg, CardText, CardBody, CardHeader, CardFooter,
    CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';

import * as FontAwesome from 'react-fontawesome';

import { Route, Link, withRouter } from "react-router-dom";

import AnimatedWrapper from '../lib/Animated';

import { spotifyLoggin, userLoggin } from '../actions/app';

import '../assets/css/index.css';


let pwd = "";
let email = "";

const Logme = (props) => {
    return (
        <div>
            <Card>

                <CardHeader>Connexion</CardHeader>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" placeholder="myemail@gmail.com" onChange={ (val) => email = val.target.value } />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" onChange={ (val) => pwd = val.target.value }/>
                        </FormGroup>
                    </Form>

                    <Button color="primary" onClick={() => props.userloggin({ password: pwd, email: email}) }>Login</Button>
                </CardBody>
                <CardFooter>
                    <CardText>You can also log in with <Button color="success" onClick={() => props.spotifyConnexion()}>
                        <FontAwesome name='spotify' /> Spotify</Button>
                    </CardText>

                </CardFooter>
            </Card>

            <p>
                <small>
                    <Link to="/register">Not registered yet ?</Link>
                </small>
            </p>
        </div>
    );
};


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    spotifyConnexion: () => {
        dispatch(spotifyLoggin());
    },

    userloggin : (data) => {
        dispatch(userLoggin(data))
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logme));