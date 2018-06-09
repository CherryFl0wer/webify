import React from 'react';
import { connect } from 'react-redux';
import { Button, Progress } from 'reactstrap';
import * as FontAwesome from 'react-fontawesome';
import '../assets/css/index.css';
import * as PlayerAction from '../actions/player';
// Delete sockette ?

class Player extends React.Component {


    constructor(props) {
        super(props);
        this._audio = null;
        this._currentSongName = "No song playing";
        this._currentTime = 0.0;
        this._finishTime = 0.0;
        this._currentTimePercentage = 0;
        this.switchPlayer = this.switchPlayer.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.sliderChange = this.sliderChange.bind(this);
    }

    componentDidMount() {

        this.props.init(this._audio)

        this.updateTimerID = setInterval(this.updateTime, 1000)
    }


    switchPlayer() {
        if (this.props.player.playing) {
            this.props.player.strplay = "play";
            this.props.pause();
        } else {
            this.props.player.strplay = "pause";
            this.props.play();
        }
    }

    updateTime() {
        if (this._audio) {
            this._currentTime = this._audio.currentTime;
            let sec = Math.round(this._currentTime);
            let min = Math.floor(sec / 60);
            let nsec = sec % 60;
            nsec = (nsec >= 0 && nsec < 10) ? "0" + nsec.toString() : nsec.toString();

            let timer = Math.floor((this._currentTime * 100) / this.props.player.metadata.duration_ms);
            if (timer != this._currentTimePercentage && this.props.player.playing)
                this._timerPercentage.stepUp(1);

            this._currentTimePercentage = timer;

            if (this._currentTimePercentage <= 100)
                this._currentTimingSpan.innerHTML = min.toString() + ":" + nsec;

        } else {
            this._currentTimingSpan.innerHTML = "0:00";
        }
    }

    sliderChange(e) {
        let percentageSeek = e.target.value;
        if (this._audio && this.props.player.urlSong != "") {
            this._audio.currentTime = (percentageSeek * this.props.player.metadata.duration_ms) / 100;
        }
    }


    render() {
        return (
            <div>
                <audio ref={(audio) => this._audio = audio}>
                </audio>
                <div id="player">
                    <div className="row">
                        <div className="col-md-2 action">
                            <div className="flex">
                                <span><FontAwesome name="step-backward" /></span>
                                <span onClick={() => this.switchPlayer()} className="playerbtn"><FontAwesome name={this.props.player.strplay} /></span>
                                <span><FontAwesome name="step-forward" /></span>
                            </div>
                        </div>
                        <div className="col-md-1">
                        <span ref={(span) => this._currentTimingSpan = span} className="currentTiming">
                                {(this._currentTime == 0) ? "0:00" : this._currentTime}</span>
                        </div>
                        <div className="col-md-7 vcenter">

                            <div className="slidecontainer">
    
                                 <input ref={(progress) => this._timerPercentage = progress} onChange={(e) => this.sliderChange(e)} type="range" min="1" max="100" defaultValue="0" className="slider" id="myRange" />
                            </div>

                        </div>
                        <div className="col-md-1 action">
                            <p>
                                 {this.props.player.finish}
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

}


const mapStateToProps = (state, ownProps) => ({
    app: state.app,
    player: state.player
});


const mapDispatchToProps = (dispatch, ownProps) => ({
    init: (audio) => {
        dispatch(PlayerAction.setupAudio(audio));
    },
    play: () => {
        dispatch(PlayerAction.playMusic());
    },
    pause: () => {
        dispatch(PlayerAction.pauseMusic());
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Player);