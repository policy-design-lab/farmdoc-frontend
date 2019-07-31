import React, {Component} from "react";
import Term from "./Term";
import "../styles/main.css";
import {glossaryTerms} from "../app.messages";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";

class Documentation extends Component {
	constructor(props) {
		super(props);
	}

	render(){
		let allGeneralTerms = [];
		glossaryTerms.forEach((item) => {
			allGeneralTerms.push(<Term key={item.term} term={item.term} definition={item.definition} links={item.links}/>);
		});

		return (
			<div>
				<Layout selectedTab="glossary">
					<AuthorizedWrap>
						<div className="glossaryHeader"> Glossary of Terms </div>
						{allGeneralTerms}
					</AuthorizedWrap>
				</Layout>
			</div>
		);
	}
}

export default Documentation;
