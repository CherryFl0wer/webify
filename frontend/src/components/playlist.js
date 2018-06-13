import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import history from '../lib/history';
import { Route, Link, withRouter } from "react-router-dom";
import { getPlaylist } from '../actions/playlists';
import { getAllSongsOfUser, deleteSong } from '../actions/app';
import { playMusic, pauseMusic } from '../actions/player';


class Playlist extends React.Component {

    constructor(props) {
        super(props);

        this.switchPlayer = this.switchPlayer.bind(this);
        this.titleMatch = this.props.match.params.title;


        let found = this.props.app.playlists.find(e => e.title == this.titleMatch); 
        console.log(this.props.app.playlists)
        // idk why if I use find in componentDidMount, find return undefined
        // despite being totally valid at the line before so I use it in render

        if (!found || found.length > 1) {
            console.log(":'(")
        }

        this.props.getAllSongFromPlaylist(found.songs);
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
        const playOrNot = (idx) => {
            if (this.props.player.curIdxInQueue == idx && this.props.player.playing)
                return <FontAwesome name="pause" />

            return <FontAwesome name="play" />
        };


        return (
            <Table hover>
                <thead>
                    <tr>
                        <th> <FontAwesome name='headphones' /> </th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Duration</th>
                        <th>Added</th>
                        <th>Origin</th>
                        <th>Action</th>
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
                                        {playOrNot(idx)}
                                    </th>
                                    <td>{item.name.substr(0, 20)}</td>
                                    <td>{item.artists}</td>
                                    <td>{min} : {sec}</td>
                                    <td>{item.added_at}</td>
                                    <td>{item.type}</td>

                                </tr>)
                        })
                    }

                </tbody>
            </Table>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    app: state.app,
    player: state.player,
    error: state.error
});

const mapDispatchToProps = (dispatch) => ({
    playSong: (idx, q) => {
        dispatch(playMusic(idx, q));
    },
    getAllSongFromPlaylist: (songs) => {
        dispatch(getAllSongsOfUser(songs));
    },
    pauseSong: () => {
        dispatch(pauseMusic());
    },

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Playlist));