import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import store from './redux/store'
import ListRooms from './pages/ListRooms';
import constants from '../../common/CONSTANTS'

store.subscribe(() => {
  console.log('Redux toolkit state: ' + store.getState())
});

const routing = (
  <Router>
    <Provider store={store}>
      <div>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path={"/" + constants.APP_PATH.LIST_ROOMS} element={<ListRooms />} />
        </Routes>
      </div>
    </Provider>
  </Router>
);



ReactDOM.render(
  routing,
  document.getElementById('root')
);
