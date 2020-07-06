import React, {Component} from "react";
import Term from "./Term";
import "../styles/main.css";
import {insuranceTermDefinitions} from "../app.messages";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";

class Documentation extends Component {
	constructor(props) {
		super(props);
	}

	render(){

		let allTerms = [];

		return (
			<div>
				<Layout selectedTab="docs">
					<AuthorizedWrap>
						<div className="docsHeader"> Term Definitions </div>
						{allTerms}

					</AuthorizedWrap>
				</Layout>
			</div>
		);
	}
}

export default Documentation;
