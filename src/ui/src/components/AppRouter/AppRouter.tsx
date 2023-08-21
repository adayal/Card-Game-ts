import * as React from 'react';
import { HashRouter, Route } from 'react-router-dom';
//import Navigation from '../Navigation/Navigation';
//import ChatPage from '../pages/Chat/ChatPage';
//import SettingsPage from '../pages/Settings/SettingsPage';
import { ComponentType } from 'react';

// Fix React Router active class setting for redux connected components

export const AppRouter: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <React.Fragment>
          <switch>
          </switch>
      </React.Fragment>
    </HashRouter>
  );
};

export default AppRouter;