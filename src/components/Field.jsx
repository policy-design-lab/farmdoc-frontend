import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {apiClient} from "../axiosClients";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Divider, InputLabel, MenuItem, Select} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
	leftIcon: {
		marginRight: theme.spacing(1),
	},
}));


const Field = () => {

	const params = new URLSearchParams(window.location.search); // id=12
	let id = params.get("id");

	const classes = useStyles();

	const [field, setField] = useState({
		name: "Farm 1",
		crop: "Corn",
		crop_id: 41,
		state: "Illinois",
		state_id: 17,
		county: "Champaign",
		county_id: 17113,
		acres: 100,
		practice_id: 2,
		created: "2021-08-06",
	});

	const [states, setStates] = useState([]);
	const [selStateOption, setSelStateOption] = useState(null);
	const [selStateId, setSelStateId] = useState(null);

	const [counties, setCounties] = useState([]);
	const [selCountyOption, setSelCountyOption] = useState(null);
	const [selCountyId, setSelCountyId] = useState(null);

	const [crops, setCrops] = useState([]);
	const [selCropOption, setSelCropOption] = useState(null);
	const [selCropId, setSelCropId] = useState(null);

	const [practices, setPractices] = useState([
		{
			"id": 3,
			"name": "Non-Irrigated",
		},
		{
			"id": 2,
			"name": "Irrigated",
		},
		{
			"id": 702,
			"name": "Organic(Certified) Irr.",
		},
		{
			"id": 712,
			"name": "Organic(Transitional) Irr.",
		},
		{
			"id": 713,
			"name": "Organic(Certified) Non-Irr.",
		},
		{
			"id": 714,
			"name": "Organic(Transitional) Non-Irr.",
		},
	]);
	const [selPracticeOption, setSelPracticeOption] = useState(null);
	const [selPracticeId, setSelPracticeId] = useState(null);

	const [trendYield, setTrendYield] = useState(140);

	const [program, setProgram] = useState("arc");
	const [policy, setPolicy] = useState("arp");
	const [coverage, setCoverage] = useState(70);


	useEffect(() => {
		// TODO: replace with api call to /fields/{id}
		// const field = ;

		console.log(`id changed: ${id}`);
		setSelCropId(field.crop_id);
		setSelPracticeId(field.practice_id);
		setSelPracticeOption({id: field.practice_id, name: "Irrigated"}); //TODO: remove this
		const fetchStates = async () => {
			await apiClient.get(
				"states").then(result => {
				if (result.status === 200) {
					let states = result.data;
					// console.log(states);
					setStates(states);
					setSelStateOption({id: field.state_id, name: field.state});
					setSelStateId(field.state_id);
				}
			}).catch((e) => {
				console.error(`Error fetching states from api: ${e}`);
			});
		};

		const fetchCrops = async () => {
			await apiClient.get(
				"crops").then(result => {
				if (result.status === 200) {
					let crops = result.data;

					crops = crops.map((ele) => {
						return {id: ele.crop_code, name: ele.name};
					});
					// console.log(crops);
					setCrops(crops);
					// if (selCropId === field.crop_id) {
					// 	setSelCropOption({id: field.crop_id, name: field.crop});
					// 	setSelCropId(field.crop_id);
					// }
				}
			}).catch((e) => {
				console.error(`Error fetching states from api: ${e}`);
			});
		};

		fetchStates();
		fetchCrops();

		// Set other inputs


	}, [field]);

	useEffect(() => {
		const fetchCounties = async () => {
			await apiClient.get(
				`counties/${selStateId}`).then(result => {
				if (result.status === 200) {
					let counties = result.data;
					setCounties(counties);
					if (selStateId === field.state_id) {
						setSelCountyOption({id: field.county_id, name: field.county});
						setSelCountyId(field.county_id);
					}
				}
			}).catch((e) => {
				console.error(`Error fetching counties from api: ${e}`);
			});
		};

		if (selStateId !== null) {
			console.log(selStateId);
			fetchCounties();
		}

	}, [selStateId]);

	useEffect(() => {
		if (selCropId === field.crop_id) {
			setSelCropOption({id: field.crop_id, name: field.crop});
			setSelCropId(field.crop_id);
		}

	}, [selCropId, field]);

	const handleProgramChange = (event) => {
		setProgram(event.target.value);
	};

	const handlePolicyChange = (event) => {
		setPolicy(event.target.value);
	};

	const handleCoverageChange = (event) => {
		setCoverage(event.target.value);
	};

	return (
		<Layout>
			<AuthorizedWrap>
				<div className="home-content"
							 style={{
								 backgroundSize: "cover",
								 backgroundPosition: "center",
							 }}
				>
					<div className="appsHeader">
							Edit Field
					</div>
					<br/>

					<div>
						<h3> Field Parameters</h3>
						<br/>
						<Autocomplete
									id="states-combo-box"
									value={states ? selStateOption : null}
									options={states}
									getOptionLabel={(option) => option.name}
									getOptionSelected={(option, value) => option.id === value.id}
									style={{width: 300}}
									renderInput={(params) => (<TextField {...params}
																											 label="State"
																											 variant="outlined"/>)}
									onChange={(event, value) => {
										setSelStateOption(value ? value : null);
										setSelStateId(value ? value.id : null);
										setSelCountyOption(null);
										setSelCountyId(null);
									}}
						/>
						<br/>
						<Autocomplete
									id="counties-combo-box"
									value={counties ? selCountyOption : null}
									options={counties}
									getOptionLabel={(option) => option.name}
									getOptionSelected={(option, value) => option.id === value.id}
									style={{width: 300}}
									renderInput={(params) => (<TextField {...params}
																											 label="County"
																											 variant="outlined"/>)}
									onChange={(event, value) => {
										setSelCountyOption(value ? value : null);
										setSelCountyId(value ? value.id : null);
									}}
						/>
						<br/>
						<div style={{display: "flex"}}>
							<Autocomplete
										id="crop-combo-box"
										value={crops ? selCropOption : null}
										options={crops}
										getOptionLabel={(option) => option.name.charAt(0).toUpperCase() + option.name.slice(1)}
										getOptionSelected={(option, value) => option.id ===
												value.id}
										style={{width: 180}}
										renderInput={(params) => (<TextField {...params}
																												 label="Crop"
																												 variant="outlined"
										/>)}
										onChange={(event, value) => {
											setSelCropOption(value ? value : null);
											setSelCropId(value ? value.id : null);
										}}
							/>

							<TextField id="acres" label="Acres" variant="outlined" style={{width: 150, marginLeft: 20}}/>
						</div>

						<br/>
						<Autocomplete
									id="practice-combo-box"
									value={practices ? selPracticeOption : null}
									options={practices}
									getOptionLabel={(option) => option.name}
									getOptionSelected={(option, value) => option.id === value.id}
									style={{width: 300}}
									renderInput={(params) => (<TextField {...params}
																											 label="Practice Type"
																											 variant="outlined"/>)}
									onChange={(event, value) => {
										setSelPracticeOption(value ? value : null);
										setSelPracticeId(value ? value.id : null);
									}}
						/>
						<br/>

						<TextField id="yield" label="Yield" variant="outlined" style={{width: 300}} type="number"
												 value={trendYield}
												 InputProps={{
													 // TODO: move units to state and get from api call
													 endAdornment: <InputAdornment position="end">bu/acre</InputAdornment>,
												 }}
												 onChange={(event) => setTrendYield(event.target.value)}
						/>
						<br/>
						<br/>
						{/*<Divider/>*/}

						<h3> Current Elections</h3>
						<br/>
						<FormControl component="fieldset">
							<FormLabel component="legend" style={{fontSize: "0.85rem"}}>Federal Program</FormLabel>
							<RadioGroup aria-label="program" name="program" value={program} row
														onChange={handleProgramChange}>
								<FormControlLabel value="arc" control={<Radio color="primary"/>} label="ARC"/>
								<FormControlLabel value="plc" control={<Radio color="primary"/>} label="PLC"/>

							</RadioGroup>
						</FormControl>

						<br/>

						<FormControl variant="outlined" style={{width: 300, marginTop: 16}}>
							<InputLabel id="policy-label">Insurance Policy</InputLabel>
							<Select
										labelId="policy-label"
										id="policy-select"
										value={policy}
										onChange={handlePolicyChange}
										label="Insurance Policy"
							>
								<MenuItem value="rp">Revenue Protection</MenuItem>
								<MenuItem value="rphpe">Revenue Protection w/ Harvest Price Exclusion</MenuItem>
								<MenuItem value="yp">Yield Protection</MenuItem>
								<MenuItem value="arp">Area Revenue Protection</MenuItem>
								<MenuItem value="arphpe">Area Revenue Protection w/ Harvest Price Exclusion</MenuItem>
								<MenuItem value="ayp">Area Yield Protection</MenuItem>
							</Select>
						</FormControl>

						<br/>
						<FormControl variant="outlined" style={{width: 300, marginTop: 16}}>
							<InputLabel id="coverage-label">Coverage Level</InputLabel>
							<Select
										labelId="coverage-label"
										id="coverage-select"
										value={coverage}
										onChange={handleCoverageChange}
										label="Coverage Level"
							>
								<MenuItem value={70}>70%</MenuItem>
								<MenuItem value={75}>75%</MenuItem>
								<MenuItem value={80}>80%</MenuItem>
								<MenuItem value={85}>85%</MenuItem>
								<MenuItem value={90}>90%</MenuItem>

							</Select>
						</FormControl>

						<br/> <br/>

						<Button variant="contained" color="primary"
							// onClick={this.calcPremiums}
							// disabled={!this.validateInputs()}
											style={{fontSize: "large", backgroundColor: "#455A64"}}>
							<Icon className={classes.leftIcon}> save </Icon>
								Save
						</Button>

					</div>
				</div>

			</AuthorizedWrap>
		</Layout>
	);
};

export default Field;
