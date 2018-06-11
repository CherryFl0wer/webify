import React from 'react';
import { connect } from 'react-redux';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';

import FontAwesome from 'react-fontawesome';
import { dlSpotifySong } from '../actions/app';
import '../assets/css/index.css';

const SpotifyDlBtn = (props) => {

    console.log(props.app);

    return (
        <div>
            <Button outline color="success" size="lg" onClick={() => props.dl50(props.app.user.access_token)}>Spotify last 50</Button>

        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    app: state.app,
    player: state.player
});

const mapDispatchToProps = (dispatch) => ({
    dl50: (at) => {
        console.log(at);
        dispatch(dlSpotifySong(at))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyDlBtn);