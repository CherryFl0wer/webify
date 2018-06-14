import React from 'react';
import { connect } from 'react-redux';
import { createPlaylist, getPlaylists, switchPlaylist } from '../actions/playlists';
import { displayAddingPlaylist, userLogout, getAllSongsOfUser } from '../actions/app';
import history from '../lib/history';
import { Route, Link, withRouter } from "react-router-dom";

import * as FontAwesome from 'react-fontawesome';
import {
    Form, FormGroup, Label, Input, FormText, Button, InputGroup, InputGroupAddon
} from 'reactstrap';

import '../assets/css/index.css';

class Menu extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getallplaylists();
    }



    render() {
        let title = null;

        const isAdding = this.props.app.adding_playlist ? (
            <div>
                <li className="input-playlist">
                    <Form>
                        <FormGroup>

                            <InputGroup>
                                <Input type="text" name="playlistname" placeholder="playlist name"
                                    onChange={(e) => title = e.target.value} />
                                <InputGroupAddon addonType="append">
                                    <Button onClick={() => this.props.create(title)}>+</Button>
                                </InputGroupAddon>

                            </InputGroup>
                        </FormGroup>
                    </Form>
                </li>
                <li className="add-playlist" onClick={() => this.props.displayPlaylistAdd()}><FontAwesome name="minus-square" /></li>
            </div>
        ) : (
                <li className="add-playlist" onClick={() => this.props.displayPlaylistAdd()}><FontAwesome name="plus-square" /></li>
            );



        const displayID = () => {
            return (!this.props.app.user.spotify_id) ? this.props.app.user.email : this.props.app.user.spotify_id;
        }

        return (
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li className="sidebar-brand">
                        <a href="#">
                            {this.props.title} - {displayID().substr(0, 15)}
                        </a>
                    </li>

                    <li className="sidebar-brand logout">
                        <Button color="danger" onClick={() => this.props.disconnect()}>Logout</Button>
                    </li>

                    <li> <a href="#library" onClick={() => this.props.switchPlaylist("library")}>Library </a> </li>


                    <hr />

                    <li> Playlists </li>

                    {
                        this.props.app.playlists.map((d, idx) => {
                            if (this.props.app.currentPlaylist == d.title) {
                                return (<li key={idx} className="selectedPlaylist" onClick={() => this.props.switchPlaylist(d.title)}> <a href={"#" + d.title}> {d.title} </a> </li>)
                            }
                            return (<li key={idx} onClick={() => this.props.switchPlaylist(d.title)}> <a href={"#" + d.title}> {d.title} </a> </li>)
                        })
                    }

                    <hr />

                    {isAdding}

                </ul>

            </div>
        );
    }
}



const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    displayPlaylistAdd: () => {
        dispatch(displayAddingPlaylist())
    },
    create: (title) => {
        if (title)
            dispatch(createPlaylist(title));
    },

    getallplaylists: () => {
        dispatch(getPlaylists());
    },

    switchPlaylist: (title) => {
        dispatch(switchPlaylist(title)).then((props) => {

            let idx = props.app.playlists.findIndex(e => e.title == title);
            if (idx == -1 || title == "library")
                dispatch(getAllSongsOfUser(props.app.user.song_list));
            else
                dispatch(getAllSongsOfUser(props.app.playlists[idx].songs));

        });
    },

    disconnect: () => {
        dispatch(userLogout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);