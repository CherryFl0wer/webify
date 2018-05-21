import { createStore, applyMiddleware, combineReducers } from 'redux'
import app from '../reducers/app'
import thunk from 'redux-thunk'

let store = createStore(combineReducers({app}), applyMiddleware(thunk))

export default store