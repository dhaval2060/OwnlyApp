import React, { Component } from 'react';
import { AppRegistry ,YellowBox} from 'react-native';
import { Provider } from 'react-redux'
import configureStore from './App/Store/configureStore'
import App from './App';
const store = configureStore();

console.disableYellowBox = true;
const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)
AppRegistry.registerComponent('Syncitt', () => ReduxApp);
