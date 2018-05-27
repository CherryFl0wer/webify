import React from 'react';
import { withRouter, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as queryString from 'query-string';

import { spotifyConfirmLogAction } from '../actions/app'

class SpotifyHandler extends React.Component {
    constructor(props) {
        super(props);
        let params = queryString.parse(this.props.location.search);
        this.props.confirmSpotifyLoggin(params.code, params.state);
    }

    render() {
        return (<div><p>Redirection... <Redirect to='/'/></p></div>);
    }
}
const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = (dispatch) => ({
    confirmSpotifyLoggin: (code, state) => {
        dispatch(spotifyConfirmLogAction(code, state));
    }
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotifyHandler));