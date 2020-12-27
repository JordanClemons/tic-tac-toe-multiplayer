import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";

//Components
import LandingPage from './landingpage/landing-page';
import PlayPage from './playpage/play-page';

function Container() {
  return (
      <Router>
        
          <Switch>
            <Route path="/" exact component={LandingPage}/>
            <Route path ="/play" exact component={PlayPage}/>
          </Switch>
        </Router>
  );
}

export default Container;
