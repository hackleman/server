import { combineReducers } from 'redux';
import postReducer from './postreducer';

export default combineReducers({
    posts: postReducer
})