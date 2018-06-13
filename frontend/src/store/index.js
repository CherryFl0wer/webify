import { createStore, applyMiddleware, combineReducers } from 'redux';
import app from '../reducers/app';
import player from '../reducers/player';
import error from '../reducers/error';
import thunk from 'redux-thunk';

let store = createStore(combineReducers({app, player, error}), applyMiddleware(thunk))

export default store