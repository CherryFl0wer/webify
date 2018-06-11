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
        this._currentTime = 0.0;
        this._finishTime = 0.0;
        this._currentTimePercentage = 0;
        this._ntime = -1;
        this.updateTimerID = null;
        this.switchPlayer = this.switchPlayer.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.sliderChange = this.sliderChange.bind(this);
        this.playNextSongQueue = this.playNextSongQueue.bind(this);
        this.playPrevSongQueue = this.playPrevSongQueue.bind(this);
    }

    componentDidMount() {
        this.props.init(this._audio)
        this.updateTimerID = setInterval(this.updateTime, 1000)
    }


    switchPlayer() {
        if (this.props.player.playing) {
            this.props.pause();
        } else {
            if (this.props.player.urlSong == "" && this.props.app.queueSong.length > 0)
                this.props.play(0, this.props.app.queueSong);
            else
                this.props.play(this.props.player.curIdxInQueue, this.props.app.queueSong);
        }
    }

    updateTime() {

        if (this._audio) {
            if (this._ntime != -1)
                this._audio.currentTime = this._ntime; // DOES NOT WORK IDK WHY HELP MEEEE !! THIS SHIT SET TO 0 AUTOMATICALLY
                                                      // LEADING TO SLIDER NOT WORKING 
            this._currentTime = this._audio.currentTime;
            this._ntime = -1;
            let sec = Math.round(this._currentTime);
            let min = Math.floor(sec / 60);
            let nsec = sec % 60;
            nsec = (nsec >= 0 && nsec < 10) ? "0" + nsec.toString() : nsec.toString();

            let timer = Math.floor((sec * 100) / this.props.player.metadata.duration_sec);

            if (timer != this._currentTimePercentage && this.props.player.playing)
                this._timerPercentage.stepUp(1);

            this._currentTimePercentage = timer;

            if (this._currentTimePercentage < 100) {
                this._currentTimingSpan.innerHTML = min.toString() + ":" + nsec;
            }
            if (this._currentTimePercentage >= 100 || this._audio.currentTime.ended) {
                this.playNextSongQueue();
            }

        } else {
            if (!this._currentTimingSpan)
                clearInterval(this.updateTimerID);

            this._currentTimingSpan.innerHTML = "0:00";
        }
    }


    shouldComponentUpdate(nextProps) {
        const differentSong = (this.props.player.curIdxInQueue !== nextProps.player.curIdxInQueue)
            || (this.props.player.curIdxInQueue == 0 && nextProps.player.curIdxInQueue == 0);
        const hasSwitchedState = (this.props.player.playing != nextProps.player.playing)
            && (this.props.player.curIdxInQueue == nextProps.player.curIdxInQueue);

        if (differentSong)
            this._timerPercentage.stepDown(100);

        return differentSong || hasSwitchedState;
    }


    sliderChange(e) {
        let percentageSeek = e.target.value;
        if (this._audio && this.props.player.urlSong != "" && this._audio.readyState == 4) {
            this._ntime = parseInt((percentageSeek * this.props.player.metadata.duration_sec) / 100, 10);
        }
    }

    playNextSongQueue() {
        this._currentTimePercentage = 0;
        this._ntime = -1;

        this._timerPercentage.stepDown(100);

        if (this.props.player.curIdxInQueue + 1 >= this.props.app.queueSong.length)
            this.props.play(0, this.props.app.queueSong);
        else
            this.props.play(this.props.player.curIdxInQueue + 1, this.props.app.queueSong);
    }

    playPrevSongQueue() {
        this._currentTimePercentage = 0;
        this._ntime = -1;

        this._timerPercentage.stepDown(100);

        if (this.props.player.curIdxInQueue == 0)
            this.props.play(this.props.app.queueSong.length - 1, this.props.app.queueSong);
        else
            this.props.play(this.props.player.curIdxInQueue - 1, this.props.app.queueSong);
    }

    render() {
        const playOrNot = () => {
            if (this.props.player.playing)
                return <FontAwesome name="pause" />

            return <FontAwesome name="play" />
        };

        return (
            <div>
                <audio ref={(audio) => this._audio = audio}>
                </audio>
                <div id="player">
                    <div className="row">
                        <div className="col-md-1 action" style={{ 'top': '7px' }}>
                            <div className="flex">
                                <span onClick={() => this.playPrevSongQueue()}><FontAwesome name="step-backward" /></span>
                                <span onClick={() => this.switchPlayer()} className="playerbtn">
                                    {playOrNot()}
                                </span>
                                <span onClick={() => this.playNextSongQueue()}><FontAwesome name="step-forward" /></span>
                            </div>
                        </div>
                        <div className="col-md-1 action">
                            <span ref={(span) => this._currentTimingSpan = span} className="currentTiming">
                                {(this._currentTime == 0) ? "0:00" : this._currentTime}</span>
                        </div>
                        <div className="col-md-9 action">

                            <div className="slidecontainer">

                                <input ref={(progress) => this._timerPercentage = progress} onChange={(e) => this.sliderChange(e)} type="range" min="0" max="100" defaultValue="0" className="slider" id="myRange" />
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


const mapDispatchToProps = (dispatch) => ({
    init: (audio) => {
        dispatch(PlayerAction.setupAudio(audio));
    },
    play: (idx, q) => {
        dispatch(PlayerAction.playMusic(idx, q));
    },
    pause: () => {
        dispatch(PlayerAction.pauseMusic());
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Player);