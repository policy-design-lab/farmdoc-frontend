import React, {Component} from "react";
import "../../styles/main.css";
import Layout from "../Layout";
import AuthorizedWrap from "../AuthorizedWrap";

class Documentation extends Component {
	constructor(props) {
		super(props);
	}

	render(){

		return (
			<div>
				<Layout selectedTab="docs">
					<AuthorizedWrap>
						<div className="docsHeader"> Coming Soon.. </div>

					</AuthorizedWrap>
				</Layout>
			</div>
		);
	}
}

export default Documentation;
