import React from 'react';
import { hot } from 'react-hot-loader';

import { connect } from 'react-redux';

import Body from './containers/body';
import Menu from './containers/menu';

let submenu = ["Contact", "Test"]
const App = ({ app }) => {
    return (
        <div id="wrapper" className={ (app.menu_visible)  ? "toggled" : ""}>
            <Menu title="Webify" elements={submenu} />
            <Body />
        </div>
    )
}


const mapStateToProps = (state, ownProps) => ({
    app: state.app
});

export default connect(mapStateToProps)(hot(module)(App))