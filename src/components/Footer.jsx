import React, {Component} from "react";
import "../styles/header-footer.css";
import {Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import GAPPLogo from "../images/GAPP-logo.png";
import FDDLogo from "../images/fdd-logo.png";
import NCSALogo from "../images/ncsa-logo.png";

class Footer extends Component {

	render() {
		return (
			<div>
				<Toolbar>
					<ToolbarRow align="center" className={"footer"}>
						<ToolbarSection align ="start" className="footerCorners" >
							v1.5.0
						</ToolbarSection>
						<ToolbarSection className="footerLogos" >
							<a href="http://farmdoc.illinois.edu/" target="_blank" className={"footerlogo"}>
								<img src={GAPPLogo} alt="Farmdoc" title="Farmdoc"/>
							</a>

							<a href="https://farmdocdaily.illinois.edu/" target="_blank" className={"footerlogo"}>
								<img src={FDDLogo} alt="Farmdoc Daily" title="Farmdoc Daily"/>
							</a>

							<a href="http://www.ncsa.illinois.edu" target="_blank" className={"footerlogo"}>
								<img src={NCSALogo} alt="NCSA" title="National Center for Supercomputing Applications"
										 style={{width: "140px"}} />
							</a>
						</ToolbarSection>

						<ToolbarSection align ="end" className="footerCorners" />

					</ToolbarRow>
				</Toolbar>
			</div>

		);
	}
}

export default Footer;
