import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import user from "./user";
import model from "./model";

const rootReducer = combineReducers({
	routing: routerReducer,
	model,
	user
});

export default rootReducer;
