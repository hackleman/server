import React, {Component} from 'react';
import AppNavbar from './components/appnavbar';
import ShoppingList from './components/shoppinglist';

import { Provider } from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppNavbar/>
        <ShoppingList/>
      </div>
    </Provider>

  );
}

export default App;
