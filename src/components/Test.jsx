import React, {Component} from "react";
import "../styles/header-footer.css";
import {Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";

import Keycloak from "keycloak-js";
// import {KeycloakProvider, withKeycloak} from "react-keycloak";

const keycloak = Keycloak("/../../keycloak.json");

class Test extends Component {

	constructor(props) {
		super(props);
		this.state = {keycloak: null, authenticated: false};
	}

	componentDidMount() {


		keycloak.init({onLoad: "login-required"}).success(
			function(authenticated){
				this.setState({keycloak: keycloak, authenticated: authenticated});
				alert(this.state.authenticated);
			}.bind(this));
	}

	render() {
		if (this.state.keycloak) {
			if (this.state.authenticated) {
				return (
					<div>
						Authenticated successfully
					</div>
				);
			}
			else {
				return (<div>Unable to authenticate!</div>);
			}
		}
		return (
			<div>Initializing Keycloak...</div>
		);
	}

	// render() {
	// 	console.log(keycloak);
	// 	return (
	// 		<div>
	// 			<div>
	// 				{/*{this.state.keycloak}*/}
	// 				{this.state.authenticated.toString()}
	//
	// 				Hello<br/>
	// 				<br/>
	// 				Keycloak Test
	// 			</div>
	//
	// 			<Toolbar>
	// 				<ToolbarRow align="center" className={"footer"}>
	// 					<ToolbarSection align ="start" className="footerCorners" >
	// 						v1.0.0 alpha
	// 					</ToolbarSection>
	// 					<ToolbarSection className="footerLogos" >
	// 						<a href="http://farmdoc.illinois.edu/" target="_blank" className={"footerlogo"}>
	// 							<img src={require("../images/GAPP-logo.png")} alt="Farmdoc" title="Farmdoc"/>
	// 						</a>
	//
	// 						<a href="https://farmdocdaily.illinois.edu/" target="_blank" className={"footerlogo"}>
	// 							<img src={require("../images/fdd-logo.png")} alt="Farmdoc Daily" title="Farmdoc Daily"/>
	// 						</a>
	//
	// 						<a href="http://www.ncsa.illinois.edu" target="_blank" className={"footerlogo"}>
	// 							<img src={require("../images/ncsa-logo.png")} alt="NCSA" title="National Center for Supercomputing Applications" />
	// 						</a>
	// 					</ToolbarSection>
	//
	// 					<ToolbarSection align ="end" className="footerCorners" />
	//
	// 				</ToolbarRow>
	// 			</Toolbar>
	// 		</div>
	//
	//
	// 	);
	// }
}

export default Test;
