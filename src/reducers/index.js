import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import user from "./user";
import model from "./model";
import results from "./results";
import insPremiums from "./insPremiums";
import insEvaluator from "./insEvaluator";
import priceDistribution from "./priceDistribution";
import arcplcCalculator from "./arcplcCalculator";

const rootReducer = combineReducers({
	routing: routerReducer,
	model,
	results,
	user,
	insPremiums,
	insEvaluator,
	priceDistribution,
	arcplcCalculator
});

export default rootReducer;
