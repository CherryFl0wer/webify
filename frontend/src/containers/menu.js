import React from 'react';
import { connect } from 'react-redux';
import '../assets/css/index.css';

import * as FontAwesome from 'react-fontawesome';
import {
    Form, FormGroup, Label, Input, FormText, Button
} from 'reactstrap';

import { displayAddingPlaylist, userLogout } from '../actions/app';

const Menu = (props) => {
    const isAdding = props.app.adding_playlist ? (
        <div>
            <li className="input-playlist">
                <Form>
                    <FormGroup>
                        <Input type="text" name="playlistname" placeholder="playlist name" />
                    </FormGroup>
                </Form>
            </li>
            <li className="add-playlist" onClick={() => props.displayPlaylistAdd()}><FontAwesome name="minus-square" /></li>
        </div>
    ) : (
            <li className="add-playlist" onClick={() => props.displayPlaylistAdd()}><FontAwesome name="plus-square" /></li>
        );

    return (
        <div id="sidebar-wrapper">
            <ul className="sidebar-nav">
                <li className="sidebar-brand">
                    <a href="#">
                        {props.title} - {props.app.user_data_spotify.id || props.app.user.email }
                    </a>
                </li>

                <li className="sidebar-brand logout">
                    <Button color="danger" onClick={() => props.disconnect()}>Logout</Button>
                </li>

                <li> <a href="#"> Library </a> </li>

                

                <hr />

                <li> Playlists </li>

                {
                    props.playlists.map((d, idx) => {
                        return (<li key={idx}> <a href="#"> {d} </a> </li>) // ex: <Link to="/playlist/:username/:id" /> 
                    })
                }

                {isAdding}

            </ul>

        </div>
    );
};


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    displayPlaylistAdd: () => {
        dispatch(displayAddingPlaylist())
    },

    disconnect: () => {
        dispatch(userLogout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);