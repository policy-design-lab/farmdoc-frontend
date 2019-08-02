import React, {Component} from "react";
import "../styles/header-footer.css";
import {Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";

class Footer extends Component {

	render() {
		return (
			<div>
				<Toolbar>
					<ToolbarRow align="center" className={"footer"}>
						<ToolbarSection align ="start" className="footerCorners" >
							v1.0.0 alpha
						</ToolbarSection>
						<ToolbarSection className="footerLogos" >
							<a href="http://farmdoc.illinois.edu/" target="_blank" className={"footerlogo"}>
								<img src={require("../images/GAPP-logo.png")}/>
							</a>

							<a href="https://farmdocdaily.illinois.edu/" target="_blank" className={"footerlogo"}>
								<img src={require("../images/fdd-logo.png")}/>
							</a>

							<a href="http://www.ncsa.illinois.edu" target="_blank" className={"footerlogo"}>
								<img src={require("../images/ncsa-logo.png")}/>
							</a>
						</ToolbarSection>

						<ToolbarSection align ="end" className="footerCorners" >
						</ToolbarSection>

					</ToolbarRow>
				</Toolbar>
			</div>

		);
	}
}

export default Footer;
