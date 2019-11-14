import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import user from "./user";
import model from "./model";
import results from "./results";
import insPremiums from "./insPremiums";

const rootReducer = combineReducers({
	routing: routerReducer,
	model,
	results,
	user,
	insPremiums
});

export default rootReducer;
