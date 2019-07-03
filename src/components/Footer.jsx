import React, {Component} from "react";
import {Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";

class Footer extends Component {

	render() {
		return (
			<div>
				<Toolbar>
					<ToolbarRow style={{backgroundColor: "#455A64", height: "50px"}} align="center">
						<ToolbarSection start="center" />
					</ToolbarRow>
				</Toolbar>
			</div>

		);
	}
}

export default Footer;
