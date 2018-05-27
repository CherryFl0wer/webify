import React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardImg, CardText, CardBody, CardHeader, CardFooter,
    CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';


import { Route, Link, withRouter } from "react-router-dom";

import AnimatedWrapper from '../lib/Animated';

import * as FontAwesome from 'react-fontawesome';

import { spotifyLoggin } from '../actions/app';

import '../assets/css/index.css';


const Register = (props) => {
    return (
        <div>
            <Card>

                <CardHeader>Register</CardHeader>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" placeholder="myemail@gmail.com" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" />
                        </FormGroup>
                    </Form>

                    <Button color="primary">Register me</Button>
                </CardBody>
                <CardFooter>
                    <CardText>
                            <Link className={"btn btn-danger"} to="/">
                                <FontAwesome name='times' /> Cancel
                            </Link>
                    </CardText>

                </CardFooter>
            </Card>

        </div>
    );
};


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    spotifyConnexion: () => {
        dispatch(spotifyLoggin());
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));