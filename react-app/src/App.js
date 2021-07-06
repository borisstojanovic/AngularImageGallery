import React from "react";
import {Provider} from "react-redux";
import { Router } from "react-router"
import { Switch, Route } from "react-router-dom";

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

import ImageDetails from "./components/ImageDetails";
import Scroll from "./components/Scroll";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
}));

const App = () => {
    const classes = useStyles();
  return (
      <Provider store={store}>
          <div className="root">
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
                          <Route exact path="/details" component={ImageDetails} />
                      </Switch>
                        <Scroll showBelow={250}/>
                  </div>
              </Router>
          </div>
      </Provider>
  );
};

export default App;