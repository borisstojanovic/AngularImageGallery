import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import ImagesList from "./components/image-list/ImagesList"
import Home from "./components/Home";
import Profile from "./components/Profile";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/apiMessage";

import { history } from "./helpers/history";
import Header from "./components/Header";

const App = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
      //blue-snow.png 8/10
      //circle-blues.png 3/10
      //cork-board.png 4/10
      //denim.png 8.2/10
      //denim_@2X.png 7/10
      //dot-grid.png 8/10

      <Router history={history}>
        <div className="root" style={{
          backgroundImage: "url(/images/ep_naturalblack.png)",
          backgroundRepeat: "repeat"
        }}>
          <Header/>

          <div className="container">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/images" component={ImagesList} />
            </Switch>
          </div>
        </div>
      </Router>
  );
};

export default App;