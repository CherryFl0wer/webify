import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import { dlSpotifySong, getUserSongList } from '../actions/app';
import '../assets/css/index.css';

let songlist = null;
const SpotifyDlBtn = (props) => {
    if (!props.app.downloadedSpotifySong) {
        return (
            <div>
                <Button outline color="success" size="lg" onClick={() => props.dl50(props.app.user.access_token)}>Spotify last 50 songs</Button>
            </div>
        );
    } 
    return <div></div>
}

const mapStateToProps = (state, ownProps) => ({
    app: state.app,
    player: state.player
});

const mapDispatchToProps = (dispatch) => ({
    dl50: (at) => {
        dispatch(dlSpotifySong(at));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyDlBtn);