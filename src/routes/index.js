import React from 'react';
import { NativeRouter, Switch, Route } from 'react-router-native';

import Signup from './Signup';
import Login from './Login';
import CheckToken from './CheckToken';
import Feed from "./Feed";

export default () => (
  <NativeRouter>
    <Switch>
      <Route exact path="/" component={Signup} />
      {/*<Route exact path="/" component={CheckToken} />*/}
      {/*<Route exact path="/" component={Feed} />*/}
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/feed" component={Feed} />
    </Switch>
  </NativeRouter>
);
