import { createStore, applyMiddleware, combineReducers } from 'redux';
import app from '../reducers/app';
import player from '../reducers/player';
import thunk from 'redux-thunk';

let store = createStore(combineReducers({app, player}), applyMiddleware(thunk))

export default store