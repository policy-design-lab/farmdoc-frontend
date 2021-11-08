import axios from "axios";
import appConfig from "./app.config";

//TODO: Remove the default email id - it won't be needed
let kcEmail = (localStorage.getItem("kcEmail") != null) ? localStorage.getItem(
	"kcEmail") : "demouser1@illinois.edu";
let kcToken = (localStorage.getItem("kcToken") != null) ? localStorage.getItem(
	"kcToken") : "";

let header = {"X-Userinfo": btoa(`{"email": "${kcEmail}"}`)};
if (process.env.REACT_APP_ENV != null) {
	if (["production", "development"].includes(process.env.REACT_APP_ENV)) {
		header = {"Authorization": `Bearer ${kcToken}`};
	}
}

export const apiClient = axios.create({
	baseURL: appConfig.apiUrl,
	timeout: 3000,
	headers: header,
});
