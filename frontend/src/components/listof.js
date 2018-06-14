import React from 'react';
import { connect } from 'react-redux';
import {
    Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, FormText, Input
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { getAllSongsOfUser, deleteSong, toggleModalAddPlaylist } from '../actions/app';
import { addSongInPlaylist, removePlaylist, removeSongInPlaylist } from '../actions/playlists';
import { addToQueue, playMusic, pauseMusic } from '../actions/player';
import AddBtn from './addbtn';
import SpotifyDlBtn from './spotifydlbtn';
import '../assets/css/index.css';


class ListOf extends React.Component {

    constructor(props) {
        super(props);

        this.switchPlayer = this.switchPlayer.bind(this);
        this.item = null;


        this.props.getAllSong(this.props.app.user.song_list)

        this.interv = setInterval(() => {
            if (this.props.app.currentPlaylist == "library")
                this.props.getAllSong(this.props.app.user.song_list)
            else {
                let idx = this.props.app.playlists.findIndex(e => e.title == this.props.app.currentPlaylist);
                if (idx != -1)
                    this.props.getAllSong(this.props.app.playlists[idx].songs);
            }

        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interv);
    }

    switchPlayer(idx) {
        const didChange = idx != this.props.player.curIdxInQueue;

        if (this.props.player.playing) {
            if (didChange) {
                this.props.playSong(idx, this.props.app.queueSong);
            } else {
                this.props.pauseSong();
            }
        } else {
            this.props.playSong(idx, this.props.app.queueSong);
        }
    }

    render() {

        const playOrNot = (idx, itemid) => {
            if (this.props.player.metadata._id == itemid && this.props.player.playing)
                return <FontAwesome name="pause" />

            return <FontAwesome name="play" />
        };

        const btnAddToPlaylist = (item) => {
            if (this.props.app.currentPlaylist == "library") {
                return (

                    <td>
                        <Button color="secondary" onClick={() => {
                            this.item = item;
                            this.props.displayModal()
                        }}>
                            <FontAwesome name='list' /></Button>
                    </td>);
            }
        };

        const btnDeleteSong = (id, t) => {
            if (this.props.app.currentPlaylist == "library") {
                return (<td>
                    <Button color="danger" onClick={() => this.props.deleteSong(id, t)}>X</Button>{' '}
                </td>);
            } else {
                return (<td>
                    <Button color="danger" onClick={() => this.props.removeSongInPlaylist(this.props.app.currentPlaylist, id, this.props.app.queueSong)}>X</Button>{' '}
                </td>);
            }
        }

        const btnAddSong = () => {
            if (this.props.app.currentPlaylist == "library") {
                return (<tr>
                    <td colSpan="2"></td>
                    <td colSpan="3" style={{ 'textAlign': 'center' }}>
                        <AddBtn /><br />
                        {displaySpotifyBtn() }
                    </td>
                    <td colSpan="3"></td>
                </tr>);
            }
        }

        const displaySpotifyBtn = () => {
            if (this.props.app.user_atok_spotify != null && this.props.app.currentPlaylist == "library") {
                return <SpotifyDlBtn />
            }
        };

        const btnDeletePlaylist = (title) => {
            if (this.props.app.currentPlaylist != "library") {
                return (<tr>
                    <td colSpan="2"></td>
                    <td colSpan="3" style={{ 'textAlign': 'center' }}>
                        <Button color="danger" onClick={() => this.props.deletePlaylist(title, this.props.app.user.song_list)}>Delete playlist</Button>
                    </td>
                    <td colSpan="2"></td>
                </tr>)
            }
        }

        return (
            <div>
                <Table hover>
                    <thead>
                        <tr>
                            <th> <FontAwesome name='headphones' /> </th>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Duration</th>
                            <th>Added</th>
                            <th>Origin</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.props.app.queueSong.map((item, idx) => {
                                let min = parseInt(item.duration_sec / 60);
                                let sec = parseInt(item.duration_sec % 60);
                                return (
                                    <tr key={idx}>
                                        <th scope="row" onClick={() => this.switchPlayer(idx)}>
                                            {playOrNot(idx, item._id)}
                                        </th>
                                        <td>{item.name.substr(0, 25)}</td>
                                        <td>{item.artists}</td>
                                        <td>{min} : {sec}</td>
                                        <td>{item.added_at}</td>
                                        <td>{item.type}</td>

                                        {btnDeleteSong(item._id, idx)}
                                        {btnAddToPlaylist(item)}
                                    </tr>)
                            })
                        }
                        {btnAddSong()}

                        {btnDeletePlaylist(this.props.app.currentPlaylist)}
                    </tbody>
                </Table>

                <Modal isOpen={this.props.app.modalAddPlaylist} toggle={() => this.props.displayModal()}>
                    <ModalHeader toggle={this.props.displayModal}>Add song to specific playlist</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="playlists">Select a playlist</Label>
                                <Input type="select" name="select" id="playlists" onChange={(e) => this.playlistName = e.target.value}>
                                    <option> --- </option>
                                    {this.props.app.playlists.map((item, key) => <option key={key}>{item.title}</option>)}
                                </Input>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.props.addToPlaylist(this.item, this.playlistName)}>Add</Button>{' '}
                        <Button color="error" onClick={() => this.props.displayModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    app: state.app,
    player: state.player
});

const mapDispatchToProps = (dispatch) => ({

    getAllSong: (listsongs) => {
        dispatch(getAllSongsOfUser(listsongs));
    },

    playSong: (idx, q) => {
        dispatch(playMusic(idx, q));
    },

    pauseSong: () => {
        dispatch(pauseMusic());
    },

    displayModal: () => {

        dispatch(toggleModalAddPlaylist());
    },

    addToPlaylist: (item, title) => {
        dispatch(addSongInPlaylist(title, item._id)).then(res => {
            dispatch(toggleModalAddPlaylist());
        })

    },

    deletePlaylist: (title, listsongs) => {
        dispatch(removePlaylist(title)).then(() => {
            dispatch(getAllSongsOfUser(listsongs));
        });
    },

    removeSongInPlaylist: (title, idsong, listsongs) => {
        dispatch(removeSongInPlaylist(title, idsong)).then(() => {
            
        });
    },

    deleteSong: (id, idx) => {
        dispatch(deleteSong(id, idx))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListOf);