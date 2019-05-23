import React, {Component} from 'react';

import Posts from './components/posts';
import PostForm from './components/postform';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Provider } from 'react-redux';

import store from './store';

function App() {

  return (
    <Provider store={store}>
    <div className="App">
      <PostForm />
      <hr />
      <Posts />
    </div>
    </Provider>
    
  );
}

export default App;
