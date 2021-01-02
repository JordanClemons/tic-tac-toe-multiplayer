import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";

//Components
import LandingPage from './landingpage/landing-page';
import PlayPage from './playpage/play-page';
import LobbyPage from './lobbypage/lobby-page';

function Container() {
  return (
      <Router>
        
          <Switch>
            <Route path="/" exact component={LandingPage}/>
            <Route path ="/lobby" exact component={LobbyPage}/>
            <Route path ="/play" exact component={PlayPage}/>
          </Switch>
        </Router>
  );
}

export default Container;
