import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import { toggleMenu } from '../actions/app';

import '../assets/css/index.css';


const Body = (props) => {
    return (
        <div id={"page-content-wrapper"}>
            <div className={"container-fluid"}>
                <Button onClick={props.toggleMenu} color="primary" size="lg" block>{(props.app.menu_visible) ? "Closed" : "Open"}</Button>
            </div>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

const mapDispatchToProps = dispatch => {
    return {
        toggleMenu: () => {
            dispatch(toggleMenu())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);