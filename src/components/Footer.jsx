import React, {Component} from "react";
import "../styles/header-footer.css";
import {Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";

class Footer extends Component {

	render() {
		return (
			<div>
				<Toolbar>
					<ToolbarRow align="center" className={"footer"}>
						<ToolbarSection start="center" >
							<a href="http://farmdoc.illinois.edu/" target="blank" className={"footerlogo"}>
								<img src={require("../images/GAPP-logo.png")}/>
							</a>

							<a href="https://farmdocdaily.illinois.edu/" target="blank" className={"footerlogo"}>
								<img src={require("../images/fdd-logo.png")}/>
							</a>

							<a href="http://www.ncsa.illinois.edu" target="blank" className={"footerlogo"}>
								<img src={require("../images/ncsa-logo.png")}/>
							</a>
						</ToolbarSection>

					</ToolbarRow>
				</Toolbar>
			</div>

		);
	}
}

export default Footer;
