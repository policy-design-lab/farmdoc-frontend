import React, {Component, useState} from "react";
import {Divider, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";
import resJson from "./tool.json";
import Grid from "@material-ui/core/Grid";
import EvaluatorRiskGraph from "./EvaluatorRiskGraph";
import sampleDistImg from "../images/sample-dist.png";

const useStyles = makeStyles((theme) => ({
	unitControl: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(1),
		minWidth: 120,
	},
	coverageControl: {
		marginRight: theme.spacing(1),
		minWidth: 100,
	},
	itemRow: {
		display: "inline-flex",
		alignItems: "center",
		paddingTop: "4px",
		paddingBottom: "2px"
	},
	itemLabel: {
		paddingRight: "24px",
		fontWeight: 600,
		width: "160px"
	},
	itemRadioGroup: {
		// paddingRight: "24px",
		// minWidth: "760px"
	},
	itemSelect: {
		height: "48px"
	},
	menuProps: {
		anchorOrigin: {
			vertical: "bottom",
			horizontal: "left"
		},
		transformOrigin: {
			vertical: "top",
			horizontal: "left"
		},
		getContentAnchorEl: null
	},
	gridItemKey: {
		fontWeight: "700",
		// margin: "4px"
	},
	gridItemValue: {
		fontStyle: "italic",
		// margin: "4px"
	}
}));


const IntegratedToolResults = () => {

	const classes = useStyles();

	const [programChoice, setProgramChoice] = useState("arc");
	const [farmPolicy, setFarmPolicy] = useState("rp");
	const [countyPolicy, setCountyPolicy] = useState("");
	const [coverage, setCoverage] = useState("80");
	const [policyUnit, setPolicyUnit] = useState("basic");

	const handleProgramChoiceChange = (event) => {
		setProgramChoice(event.target.value);
	};

	const handleFarmPolicyChange = (event) => {
		setFarmPolicy(event.target.value);
		setCountyPolicy("");
		// dispatch({type: "CHANGE_CROP_STATE_COUNTY_NAME", cropStateCountyName: ["as", "as", "as"]});
	};

	const handleCountyPolicyChange = (event) => {
		setCountyPolicy(event.target.value);
		setFarmPolicy("");
	};

	const handleSelectChange = (event, setMethod) => {
		setMethod(event.target.value);
	};

	console.log(resJson);
	return (
		<div>
			<div className={classes.itemRow}>
				<InputLabel className={classes.itemLabel} style={{fontSize: "17px", marginRight: "12px"}}>
					Program Choice
				</InputLabel>
				<FormControl>
					<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							row
							className={classes.itemRadioGroup}
							value={programChoice}
							onChange={handleProgramChoiceChange}
					>
						<FormControlLabel value="arc" control={<Radio color="primary" />} label="ARC" />
						<FormControlLabel value="plc" control={<Radio color="primary" />} label="PLC" />
					</RadioGroup>
				</FormControl>
			</div>

			<Divider style={{width: "1100px"}}/>

			<div style={{marginTop: "8px"}}>
				<InputLabel className={classes.itemLabel} style={{fontSize: "17px"}}>
					Insurance Choice
				</InputLabel>
			</div>

			<div style={{marginLeft: "12px", marginBottom: "8px"}}>

				<div className={classes.itemRow}>
					<InputLabel className={classes.itemLabel}>
					Farm Policies
					</InputLabel>
					<FormControl>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							row
							className={classes.itemRadioGroup}
							value={farmPolicy}
							onChange={handleFarmPolicyChange}
						>
							<FormControlLabel value="rp" control={<Radio color="primary" />} label="Revenue Protection (RP)" />
							<FormControlLabel value="rphpe" control={<Radio color="primary" />} label="RP With Harvest Price Exclusion" />
							<FormControlLabel value="yp" control={<Radio color="primary" />} label="Yield Protection" />
						</RadioGroup>
					</FormControl>

					<FormControl variant="outlined" className={classes.unitControl}>
						<InputLabel id="demo-simple-select-outlined-label">Policy Unit</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							className={classes.itemSelect}
							value={policyUnit}
							onChange={(e) => handleSelectChange(e, setPolicyUnit)}
							label="Policy Unit"
							MenuProps={{
								anchorOrigin: {
									vertical: "bottom",
									horizontal: "left"
								},
								getContentAnchorEl: null
							}}
						>
							<MenuItem value="basic">Basic</MenuItem>
							<MenuItem value="enterprise">Enterprise</MenuItem>
							<MenuItem value="opt">Optional</MenuItem>
						</Select>
					</FormControl>
				</div>
				<br/>

				<div className={classes.itemRow}>
					<InputLabel className={classes.itemLabel}>
					County Products
					</InputLabel>
					<FormControl>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							row
							className={classes.itemRadioGroup}
							value={countyPolicy}
							onChange={handleCountyPolicyChange}
						>
							<FormControlLabel value="rp" control={<Radio color="primary" />} label="Area Revenue Protection (ARP)" />
							<FormControlLabel value="rphpe" control={<Radio color="primary" />} label="ARP With Harvest Price Exclusion" />
							<FormControlLabel value="yp" control={<Radio color="primary" />} label="Area Yield Protection" />
						</RadioGroup>
					</FormControl>

				</div>
				<br/>

				<div className={classes.itemRow}>
					<InputLabel className={classes.itemLabel}>
					Coverage Level
					</InputLabel>
					<FormControl variant="outlined" className={classes.coverageControl}>
						{/*<InputLabel id="demo-simple-select-outlined-label">Coverage</InputLabel>*/}
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							className={classes.itemSelect}
							value={coverage}
							onChange={(e) => handleSelectChange(e, setCoverage)}
							// label="Coverage"
							MenuProps={{
								anchorOrigin: {
									vertical: "bottom",
									horizontal: "left"
								},
								getContentAnchorEl: null
							}}
						>
							<MenuItem value="70">70%</MenuItem>
							<MenuItem value="75">75%</MenuItem>
							<MenuItem value="80">80%</MenuItem>
						</Select>
					</FormControl>
				</div>

			</div>
			<Divider style={{width: "1100px", marginBottom: "12px"}}/>

			<div style={{marginTop: "8px"}}>
				<InputLabel className={classes.itemLabel} style={{fontSize: "17px", fontWeight: "800", marginBottom: "16px",
					textAlign: "center", width: "100%"}}>
					<u>Results for 2022</u>
				</InputLabel>
			</div>

			<div style={{marginLeft: "12px"}}>
				<Grid container spacing={2} style={{fontSize: "1rem"}}>
					<Grid item xs={4}>
						<Grid container spacing={2}>
							<Grid item xs={7} className={classes.gridItemKey}>
							Estimated {programChoice.toUpperCase()} Payment:
							</Grid>
							<Grid item xs={5} className={classes.gridItemValue}>
							$14.50
							</Grid>
							<Grid item xs={7} className={classes.gridItemKey}>
							Likelihood of Payment:
							</Grid>
							<Grid item xs={5} className={classes.gridItemValue}>
							22%
							</Grid>
							<Grid item xs={7} className={classes.gridItemKey}>
							MYA Price:
							</Grid>
							<Grid item xs={5} className={classes.gridItemValue}>
							$4.50
							</Grid>
							<Grid item xs={7} className={classes.gridItemKey}>
							Expected Yield:
							</Grid>
							<Grid item xs={5} className={classes.gridItemValue}>
							204 bu/acres
							</Grid>
							<Grid item xs={7} className={classes.gridItemKey} style={{alignItems: "center", justifyContent: "left", display: "flex"}}>
								Payment Distribution:
							</Grid>
							<Grid item xs={5} className={classes.gridItemValue}>
								<img src={sampleDistImg} style={{border: "1px", borderStyle: "solid", cursor: "pointer"}} alt="as" title="View payment distribution"/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={8}>
						<Grid container spacing={3} style={{marginLeft: "8px"}}>
							<Grid item xs={2} className={classes.gridItemKey}>
							Est. Premium:
							</Grid>
							<Grid item xs={10} className={classes.gridItemValue}>
							$20.50
							</Grid>

							<Grid item xs={2} className={classes.gridItemKey}>
							Min. Guarantee:
							</Grid>
							<Grid item xs={10} className={classes.gridItemValue}>
							130.5 bu/acre
							</Grid>

							<Grid item xs={9}>
								<EvaluatorRiskGraph />
							</Grid>

						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default IntegratedToolResults;
