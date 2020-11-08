import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { Home } from './containers';

window.onload = () => {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Route exact path="/" component={Home} />
        </SnackbarProvider>
      </Switch>
    </BrowserRouter>
    , document.getElementById('app'),
  );
};
