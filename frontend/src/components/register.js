import React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardImg, CardText, CardBody, CardHeader, CardFooter,
    CardTitle, CardSubtitle, Button,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';


import { Route, Link, withRouter } from "react-router-dom";

import * as FontAwesome from 'react-fontawesome';

import { spotifyLoggin, userReg } from '../actions/app';

import '../assets/css/index.css';


const Register = (props) => {
    
    let data = {
        password: null,
        email:null
    };

    return (
        <div>
            <Card>

                <CardHeader>Register</CardHeader>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" placeholder="myemail@gmail.com" onChange={(e) => data.email = e.target.value}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" onChange={(e) => data.password = e.target.value} />
                        </FormGroup>
                    </Form>

                    <Button color="primary" onClick={() => props.register(data)}>Register me</Button>
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
    register: (data) => {
        dispatch(userReg(data));
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));