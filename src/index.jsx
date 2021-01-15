// Set up your application entry point here...
///* eslint-disable import/default */

import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {browserHistory} from "react-router";
import App from "./components/App";

import configureStore from "./store/configureStore";

import "./styles/styles.scss";
import {syncHistoryWithStore} from "react-router-redux";

require("./images/card_bg.jpg");
require("./images/farmdoc-rep-image.png");
require("./images/map-marker.png");

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
syncHistoryWithStore(browserHistory, store);

render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById("app")
);
