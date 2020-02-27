import React, {Component} from "react";
import Term from "./Term";
import "../styles/main.css";
import {evaluatorTermDefinitions} from "../app.messages";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";

class Documentation extends Component {
	constructor(props) {
		super(props);
	}

	render(){

		let allTerms = [];
		evaluatorTermDefinitions.forEach((item) => {
			allTerms.push(<Term key={item.term} term={item.term} definition={item.definition} links={item.links}/>);
		});

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
