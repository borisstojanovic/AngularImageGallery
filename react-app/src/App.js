import React from "react";
import {Provider} from "react-redux";
import { Router } from "react-router"
import { Switch, Route, Link } from "react-router-dom";

import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import ImagesList from "./components/image-list/ImagesList"
import Home from "./components/Home";
import Profile from "./components/Profile";

import { history } from "./helpers/history";
import Header from "./components/Header";
import store from "./helpers/store";

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
}));

const App = () => {
    const classes = useStyles();
  return (
//blue-snow.png 8/10
      //circle-blues.png 3/10
      //cork-board.png 4/10
      //denim.png 8.2/10
      //denim_@2X.png 7/10
      //dot-grid.png 8/10
      //fff4eb background with ep_naturalwhite.png 8/10
      //halftone-yellow.png 7.5/10
      <Provider store={store}>
          <div className="root" style={{
            backgroundRepeat: "repeat"
          }}>
              <Router history={history}>
                  <Header/>

                  <div className={classes.toolbar}/>
                  <div className="container">
                      <Switch>
                          <Route exact path={["/", "/home"]} component={Home} />
                          <Route exact path="/login" component={Login} />
                          <Route exact path="/register" component={Register} />
                          <Route exact path="/profile" component={Profile} />
                          <Route exact path="/images" component={ImagesList} />
                      </Switch>

                  </div>
              </Router>
          </div>
      </Provider>
  );
};

export default App;