import React, {Component} from "react";
import "../styles/main.css";
import "../styles/home-page.css";
import AuthorizedWrap from "./AuthorizedWrap";
import Layout from "./Layout";
import FarmList from "./FarmList";

class MyFields extends Component {

	render() {

		return (
			<div>
				<Layout>

					<AuthorizedWrap>
						<div className="home-content"
                   style={{backgroundSize: "cover", backgroundPosition: "center"}}
						>
							<div className="appsHeader">
                  Manage my farms
							</div>
							<br/>
							<FarmList/>

						</div>

					</AuthorizedWrap>
				</Layout>
			</div>
		);

	}
}

export default MyFields;
