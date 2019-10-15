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
							v1.0.0 beta
						</ToolbarSection>
						<ToolbarSection className="footerLogos" >
							<a href="http://farmdoc.illinois.edu/" target="_blank" className={"footerlogo"}>
								<img src={require("../images/GAPP-logo.png")} alt="Farmdoc" title="Farmdoc"/>
							</a>

							<a href="https://farmdocdaily.illinois.edu/" target="_blank" className={"footerlogo"}>
								<img src={require("../images/fdd-logo.png")} alt="Farmdoc Daily" title="Farmdoc Daily"/>
							</a>

							<a href="http://www.ncsa.illinois.edu" target="_blank" className={"footerlogo"}>
								<img src={require("../images/ncsa-logo.png")} alt="NCSA" title="National Center for Supercomputing Applications" />
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
