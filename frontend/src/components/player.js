import React from 'react';
import { connect } from 'react-redux';
import { Button, Progress } from 'reactstrap';
import * as FontAwesome from 'react-fontawesome';
import '../assets/css/index.css';


const Player = (props) => {

    return (
        <div>
            <div id="player">
                <div className="row">
                    <div class="col-md-2 action">
                        <div class="flex">
                            <span><FontAwesome name="step-backward" /></span>
                            <span><FontAwesome name="play" /></span>
                            <span><FontAwesome name="step-forward" /></span>
                        </div>
                    </div>
                    <div class="col-md-8 vcenter">
                        <span class="title">Pumped Kicks by IDontRemember</span>
                        <Progress animated value={45} className="timer" />
                    </div>
                    <div class="col-md-2 action">
                        <p>
                            0:00 - 3:15
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

export default connect(mapStateToProps)(Player);