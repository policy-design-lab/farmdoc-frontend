import React, {Component} from "react";
import ToolTip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Info from "@material-ui/icons/Info";
import config from "../app.config";


class Tooltip extends Component {

	constructor(props) {
		super(props);
	}

	//TODO: Use this Tooltip inside the arc/plc tool also
	render() {
		let tooltipTouchDelay = config.tooltipTouchDelay;

		return (
			<ToolTip title={this.props.title} enterTouchDelay={tooltipTouchDelay}>
				<span>
					<IconButton>
						<Info color="inherit" style={{height: "24px", width: "24px"}}/>
					</IconButton>
				</span>
			</ToolTip>
		);
	}
}

export default Tooltip;
