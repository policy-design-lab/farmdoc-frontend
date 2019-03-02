import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import user from "./user";
import model from "./model";
import results from "./results";

const rootReducer = combineReducers({
	routing: routerReducer,
	model,
	results,
	user
});

export default rootReducer;
