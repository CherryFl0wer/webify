import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { getAllSongsOfUser } from '../actions/app';
import { addToQueue, playMusic, pauseMusic } from '../actions/player';
import AddBtn from './addbtn';
import '../assets/css/index.css';


class ListOf extends React.Component {

    constructor(props) {
        super(props);

        this.switchPlayer = this.switchPlayer.bind(this);

    }

    componentWillMount() {
        this.props.getAllSong(this.props.app.user.song_list);
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
                    </tr>
                </thead>
                <tbody>

                    {
                        this.props.app.queueSong.map((item, idx) => {
                            let time = item.duration_sec / 60;
                            return (
                                <tr key={idx}>
                                    <th scope="row" onClick={() => this.switchPlayer(idx)}>
                                        {playOrNot(idx)}
                                    </th>
                                    <td>{item.name}</td>
                                    <td>{item.artists}</td>
                                    <td>{time.toString().replace('.', ':').slice(0, 4)}</td>
                                    <td>{item.added_at}</td>
                                    <td>{item.type}</td>
                                </tr>)
                        })
                    }
                    <tr>
                        <td colSpan="2"></td>
                        <td colSpan="2" style={{ 'textAlign': 'center' }}>
                            <AddBtn />
                        </td>
                        <td colSpan="2"></td>
                    </tr>
                </tbody>
            </Table>
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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListOf);