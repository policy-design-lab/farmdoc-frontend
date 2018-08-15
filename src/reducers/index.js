import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import analysis from "./analysis";
import user from "./user";
import model from "./model";

const rootReducer = combineReducers({
	routing: routerReducer,
	model,
	analysis,
	user
});

export default rootReducer;
