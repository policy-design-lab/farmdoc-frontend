import React, {Component} from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
	menu: {
		width: 200,
	},
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class FDRunModel extends Component {

	state = {
		program:"arc",
		commodity: "Corn",
		refprice: 3.7,
		acres: .85,
		seqprice: 0.0,
		coverage: .85,
		range: .1,
		runName:""
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleChanger = event => {
		this.setState({ program: event.target.value });
	};

	render(){
		const { classes } = this.props;

		return(
			<div style={{margin:"50px"}}>
				<FormLabel component="legend">Program</FormLabel>
				<RadioGroup style={{ display: "flex",  flexDirection:"row" }}
							name="program"
							//className={classes.group}
							value={this.state.program}
							onChange={this.handleChange("program")}>

					<FormControlLabel value="arc" control={<Radio />} label="ARC" />
					<FormControlLabel value="plc" control={<Radio />} label="PLC" />
					<FormControlLabel value="other" control={<Radio />} label="Both" />

				</RadioGroup>

				<TextField
					required
					id="runName"
					label="Simulation Name"
					value={this.state.runName}
					margin="normal"
					onChange={this.handleChange("runName")}
					style={{width:"350px"}}
					helperText="Identifier for the Simulation Results "
				/>
				<br/>
				<TextField
					id="Commodity"
					label="Commodity"
					value={this.state.commodity}
					margin="normal"
					disabled="true"
				/>

				<TextField
					id="refPrice"
					label="Reference Price"
					value={this.state.refprice}
					className={classes.textField}
					margin="normal"
					onChange={this.handleChange("refprice")}
				/> <br/>

				<TextField
					id="acres"
					label="Payment Acres"
					value={this.state.acres}
					margin="normal"
					onChange={this.handleChange("acres")}

				/><br/>

				<TextField
					id="seqPrice"
					label="Sequester Price"
					type="number"
					value={this.state.seqprice}
					margin="normal"
					onChange={this.handleChange("seqprice")}
				/><br/>

				<TextField
					id="coverage"
					label="Coverage Level"
					value={this.state.coverage}
					margin="normal"
					onChange={this.handleChange("coverage")}
					// helperText="ARC-CO Coverage"
				/><br/>

				<TextField
					id="range"
					label="Coverage Range"
					value={this.state.range}
					margin="normal"
					onChange={this.handleChange("range")}
				/>
				<br/> <br/>
				<Button variant="contained" color="primary" >

					<Icon className={classes.leftIcon}> send </Icon>
					Start Simulation
				</Button>
			</div>
		);
	}

}

export default withStyles(styles)(FDRunModel);
