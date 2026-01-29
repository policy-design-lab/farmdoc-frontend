/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {FormControl, Tooltip, CircularProgress} from "@material-ui/core";
import {withStyles, ThemeProvider} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import InfoIcon from "@material-ui/icons/Info";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CoverageLevelSlider from "./CoverageLevelSlider";
import {
	getStates,
	getCounties,
	getCrops,
	covertToLegacyCropFormat,
	roundFarmTaYield,
} from "../../public/utils";
import {
	handleEvaluatorResults,
	changeAcres,
	changeCropCode,
	changeInsUnit,
	changeCropStateCountyName,
	changeInsurancePlan,
	changeCoverageLevel,
	setLoading,
	changeAphYield,
	changeFarmTaYield,
} from "../../actions/insEvaluator";
import config from "../../app.config";
import ReactSelect from "react-select";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import "../../styles/new-evaluator.scss";
const warningColor = "#D92D20";
const styles = (theme) => ({
	formControl: {
		width: "100%",
	},
	textField: {
		width: "100%",
		"& .MuiOutlinedInput-root": {
			borderRadius: "4px",
			"& fieldset": {
				borderColor: newEvaluatorTheme.palette.stroke.mild,
			},
			"&:hover fieldset": {
				borderColor: newEvaluatorTheme.palette.primary.main,
			},
			"&.Mui-focused fieldset": {
				borderColor: newEvaluatorTheme.palette.primary.main,
			},
		},
		"& .MuiInput-underline:before": {
			borderBottomColor: newEvaluatorTheme.palette.stroke.mild,
		},
		"& .MuiInput-underline:hover:not(.Mui-disabled):before": {
			borderBottomColor: newEvaluatorTheme.palette.primary.main,
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: newEvaluatorTheme.palette.primary.main,
		},
		"& .MuiInput-root": {
			paddingBottom: "5px",
		},
		"& .MuiInputBase-input": {
			fontSize: "14px !important",
			padding: "10px 12px",
			color: newEvaluatorTheme.palette.text.disabled,
		},
		"& .MuiInput-input": {
			fontSize: "14px !important",
			padding: "0",
			paddingBottom: "0",
			color: newEvaluatorTheme.palette.text.disabled,
			fontFamily: "var(--Font-Family-fontFamily-components, 'Open Sans')",
			fontWeight: 400,
			lineHeight: "24px",
			letterSpacing: "0.15px",
		},
		"& input[type=number]": {
			"-moz-appearance": "textfield",
		},
		"& input[type=number]::-webkit-outer-spin-button": {
			"-webkit-appearance": "none",
			margin: 0,
		},
		"& input[type=number]::-webkit-inner-spin-button": {
			"-webkit-appearance": "none",
			margin: 0,
		},
	},
	leftIcon: {
		marginRight: theme.spacing(1),
	},
	spinnerContainer: {
		textAlign: "center",
		marginTop: theme.spacing(2),
	},
	alertBox: {
		backgroundColor: "#FEF3F2",
		borderRadius: "8px",
		padding: "12px",
		marginBottom: "16px",
		display: "flex",
		alignItems: "flex-start",
		gap: "12px",
	},
	alertIcon: {
		color: warningColor,
		fontSize: "20px",
		flexShrink: 0,
		marginTop: "2px",
	},
	alertText: {
		color: "#B42318",
		fontSize: "14px",
		fontWeight: 400,
		lineHeight: "20px",
		margin: 0,
	},
	errorText: {
		color: warningColor,
		fontSize: "12px",
		fontWeight: 400,
		marginTop: "4px",
		lineHeight: "16px",
	},
	textFieldError: {
		"& .MuiInput-underline:before": {
			borderBottomColor: "#D92D20 !important",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "#D92D20 !important",
		},
		"& .MuiInput-underline:hover:not(.Mui-disabled):before": {
			borderBottomColor: "#D92D20 !important",
		},
	},
});

const getReactSelectStyles = (hasError) => ({
	option: (provided, state) => ({
		...provided,
		fontSize: 14,
		color: newEvaluatorTheme.palette.text.primary,
		backgroundColor: state.isSelected
			? "#e8eef1"
			: state.isFocused
			? "#f5f8fa"
			: "white",
		cursor: "pointer",
		padding: "10px 12px",
	}),
	control: (provided, state) => ({
		...provided,
		minHeight: 29,
		fontSize: 14,
		border: "none",
		borderBottom: `1px solid ${
			hasError
				? warningColor
				: state.isFocused
				? newEvaluatorTheme.palette.primary.main
				: newEvaluatorTheme.palette.stroke.mild
		}`,
		borderRadius: 0,
		backgroundColor: "transparent",
		boxShadow: "none",
		"&:hover": {
			borderBottom: `1px solid ${
				hasError ? warningColor : newEvaluatorTheme.palette.primary.main
			}`,
		},
	}),
	placeholder: (provided) => ({
		...provided,
		color: "#757575",
		fontSize: 14,
		fontWeight: 400,
		lineHeight: "24px",
		letterSpacing: "0.15px",
		fontFeatureSettings: "'liga' off, 'clig' off",
	}),
	singleValue: (provided) => ({
		...provided,
		color: newEvaluatorTheme.palette.text.primary,
		fontSize: 14,
	}),
	valueContainer: (provided) => ({
		...provided,
		padding: "0 0 5px 0",
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: newEvaluatorTheme.palette.text.tertiary,
		padding: "0 0 5px 0",
		"&:hover": {
			color: newEvaluatorTheme.palette.primary.main,
		},
	}),
	indicatorSeparator: () => ({
		display: "none",
	}),
});

class NewEvaluatorSidebar extends Component {
	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		crops: [],
		cropId: null,
		units: config.defaultsJson.units,

		runStatus: "INIT",
		countySelValue: null,
		stateSelValue: null,
		cropSelValue: null,
		cropCountyCode: null,

		farmAcres: "",
		aphYield: "",
		farmTaYield: "",

		insurancePlan: "rp",
		coverageLevel: 80,
		unitStructure: "enterprise",

		projectedPrice: null,
		volFactor: null,
		futuresUpdated: "",

		retryCount: 0,
		maxRetries: 50,
		isInitializing: true,
		noDataAvailable: false,
		validationErrors: {
			county: false,
			cropId: false,
			farmAcres: false,
		},
		attemptedSubmit: false,
		isLoadingYields: false,
		acresDebounceTimer: null,
	};

	constructor(props) {
		super(props);
		this.runEvaluator = this.runEvaluator.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handleMuiChange = this.handleMuiChange.bind(this);
		this.handleEvaluatorResults = this.handleEvaluatorResults.bind(this);
		this.changeAcres = this.changeAcres.bind(this);
		this.changeCropStateCountyName = this.changeCropStateCountyName.bind(this);
		this.changeCropCode = this.changeCropCode.bind(this);
		this.changeInsUnit = this.changeInsUnit.bind(this);
		this.changeInsurancePlan = this.changeInsurancePlan.bind(this);
		this.changeCoverageLevel = this.changeCoverageLevel.bind(this);
	}

	checkAndFetchYields = () => {
		const {stateSel, county, cropId, farmAcres} = this.state;

		if (stateSel && county && cropId && farmAcres) {
			const cropCountyCode = `${county}${cropId}`;
			this.fetchAndPopulateYields(cropCountyCode, farmAcres);
		}
	};

	fetchAndPopulateYields = async (cropCountyCode, acres) => {
		if (!cropCountyCode || cropCountyCode === "" || !acres) {
			return;
		}

		this.setState({isLoadingYields: true});

		const email = localStorage.getItem("kcEmail") || "test";
		const token = localStorage.getItem("kcToken");
		const token_header = `Bearer ${token}`;

		const kcHeaders = {
			Authorization: token_header,
		};

		const evaluatorParams = [
			["code", cropCountyCode],
			["acres", acres],
			["email", email],
		];

		const evaluatorUrl = `${config.apiUrl}/compute/simulator?${new URLSearchParams(evaluatorParams).toString()}`;
		try {
			const evaluatorResponse = await fetch(evaluatorUrl, {
				method: "GET",
				headers: kcHeaders,
			});
			if (evaluatorResponse instanceof Response) {
				const evaluatorResult = await evaluatorResponse.json();
				if (
					typeof evaluatorResult === "object" &&
					evaluatorResult["farm-info"]
				) {
					const farmInfo = evaluatorResult["farm-info"];
					let hasAphYield = false;
					let hasFarmTaYield = false;
					if (
						farmInfo["farm-aph"] !== undefined &&
						farmInfo["farm-aph"] !== null
					) {
						this.props.changeAphYield(farmInfo["farm-aph"]);
						this.setState({aphYield: farmInfo["farm-aph"]});
						hasAphYield = true;
					}
					if (
						farmInfo["trend-adj-aph"] !== undefined &&
						farmInfo["trend-adj-aph"] !== null
					) {
						const roundedTa = roundFarmTaYield(farmInfo["trend-adj-aph"]);
						this.props.changeFarmTaYield(roundedTa);
						this.setState({farmTaYield: roundedTa});
						hasFarmTaYield = true;
					}
					if (!hasAphYield && !hasFarmTaYield) {
						this.setState({noDataAvailable: true});
					}
					else {
						this.setState({noDataAvailable: false});
					}
				}
				else {
					this.setState({noDataAvailable: true});
				}
			}
		}
		catch (error) {
			console.error("[Fetch Yields] Error fetching yields:", error);
			this.setState({noDataAvailable: true});
		}
		finally {
			this.setState({isLoadingYields: false});
		}
	};

	handleReactSelectChange = (name) => (event) => {
		if (!event || !event.value) {
			return;
		}
		this.setState({
			[name]: event.value,
		});

		switch (name) {
			case "county":
				this.setState(
					{
						countySelValue: {value: event.value, label: event.label},
						noDataAvailable: false,
					},
					() => {
						this.checkAndFetchYields();
					}
				);
				if (this.state.attemptedSubmit) {
					this.setState({
						validationErrors: {
							...this.state.validationErrors,
							county: event.value <= 0 || event.value === "",
						},
					});
				}
				if (this.state.cropId !== null) {
					let cropCountyCode = `${event.value}${this.state.cropId}`;
					this.setState({cropCountyCode: cropCountyCode});
					this.changeCropCode(cropCountyCode);
					this.setState({runStatus: "FETCHING_PARAMS"});
					this.setParams();
				}
				break;
			case "stateSel":
				if (event.value !== "") {
					this.setState({
						stateSelValue: {value: event.value, label: event.label},
						noDataAvailable: false,
					});
					this.setState({countySelValue: null});
					this.setState({county: ""});
					this.setState({cropCountyCode: ""});
					this.populateCounties(event.value, true);
					this.setState({runStatus: "FETCHING_PARAMS"});
					this.setParams();
				}
				break;
			case "cropId":
				if (event.value !== "") {
					this.setState(
						{
							cropSelValue: {value: event.value, label: event.label},
							noDataAvailable: false,
						},
						() => {
							this.checkAndFetchYields();
						}
					);
					if (this.state.attemptedSubmit) {
						this.setState({
							validationErrors: {
								...this.state.validationErrors,
								cropId: event.value === null || event.value === "",
							},
						});
					}
					this.populateCropUnits(event.value);
					let cropCountyCode = `${this.state.county}${event.value}`;
					this.setState({cropCountyCode: cropCountyCode});
					this.changeCropCode(cropCountyCode);
					this.setState({runStatus: "FETCHING_PARAMS"});
					this.setParams();
				}
				break;
		}
	};

	handleMuiChange = (name) => (event) => {
		const inputValue = event.target.value;
		this.setState(
			{
				[name]: inputValue,
			},
			() => {
				if (name === "farmAcres") {
					this.changeAcres(inputValue);
					const acresValue = parseFloat(inputValue);
					const isInvalidAcres =
						inputValue === "" ||
						isNaN(acresValue) ||
						acresValue < 100 ||
						acresValue > 10000;
					this.setState({
						validationErrors: {
							...this.state.validationErrors,
							farmAcres: isInvalidAcres,
						},
					});
					if (this.state.acresDebounceTimer) {
						clearTimeout(this.state.acresDebounceTimer);
					}
					if (!isInvalidAcres) {
						const timer = setTimeout(() => {
							this.checkAndFetchYields();
						}, 500);
						this.setState({acresDebounceTimer: timer});
					}
				}
			}
		);
		if (name === "aphYield") {
			this.props.changeAphYield(inputValue);
		}
		if (name === "farmTaYield") {
			this.props.changeFarmTaYield(inputValue);
		}
	};

	setParams(runCalc = false) {
		let that = this;
		this.setState({runStatus: "FETCHED_PARAMS"}, function () {
			if (runCalc) {
				that.runEvaluator();
			}
		});
	}

	async runEvaluator() {
		this.setState({attemptedSubmit: true});

		const errors = {
			county: this.state.county <= 0 || this.state.county === "",
			cropId: this.state.cropId === null || this.state.cropId === "",
			farmAcres:
				this.state.farmAcres === "" || parseFloat(this.state.farmAcres) <= 0,
		};

		this.setState({validationErrors: errors});

		if (errors.county || errors.cropId || errors.farmAcres) {
			return;
		}

		const email = localStorage.getItem("kcEmail") || "test";
		const token = localStorage.getItem("kcToken");
		const token_header = `Bearer ${token}`;

		const kcHeaders = {
			Authorization: token_header,
		};

		let evaluatorResult = "";
		this.handleEvaluatorResults(null);
		this.changeInsUnit("enterprise");
		this.setState({runStatus: "FETCHING_RESULTS"});
		this.props.setLoading(true);

		const evaluatorParams = [
			["code", this.state.cropCountyCode],
			["acres", this.state.farmAcres],
			["email", email],
		];

		if (this.state.aphYield) {
			evaluatorParams.push(["aphYield", this.state.aphYield]);
		}
		if (this.state.farmTaYield) {
			evaluatorParams.push(["taYield", this.state.farmTaYield]);
		}
		if (this.state.coverageLevel) {
			evaluatorParams.push(["coverageLevel", this.state.coverageLevel]);
		}
		if (this.state.insurancePlan) {
			evaluatorParams.push(["insurancePlan", this.state.insurancePlan]);
		}

		const evaluatorUrl = `${config.apiUrl}/compute/simulator?${new URLSearchParams(evaluatorParams).toString()}`;

		const evaluatorResponse = await fetch(evaluatorUrl, {
			method: "GET",
			headers: kcHeaders,
		});

		if (evaluatorResponse instanceof Response) {
			try {
				evaluatorResult = await evaluatorResponse.json();

				if (typeof evaluatorResult === "object") {
					this.handleEvaluatorResults(JSON.stringify(evaluatorResult));
					this.setState({runStatus: "FETCHED_RESULTS"});
					this.props.setLoading(false);
					this.changeCropStateCountyName([
						this.state.cropSelValue ? this.state.cropSelValue.label : "",
						this.state.stateSelValue ? this.state.stateSelValue.label : "",
						this.state.countySelValue ? this.state.countySelValue.label : "",
					]);

					if (evaluatorResult["farm-info"]) {
						const farmInfo = evaluatorResult["farm-info"];
						if (
							farmInfo["farm-aph"] !== undefined &&
							farmInfo["farm-aph"] !== null
						) {
							this.props.changeAphYield(farmInfo["farm-aph"]);
							this.setState({aphYield: farmInfo["farm-aph"]});
						}
						if (
							farmInfo["trend-adj-aph"] !== undefined &&
							farmInfo["trend-adj-aph"] !== null
						) {
							const roundedTaValue = roundFarmTaYield(farmInfo["trend-adj-aph"]);
							this.props.changeFarmTaYield(roundedTaValue);
							this.setState({farmTaYield: roundedTaValue});
						}
					}
				}
				else {
					this.handleEvaluatorResults("");
					this.setState({runStatus: "ERROR_RESULTS", noDataAvailable: true});
					this.props.setLoading(false);
				}
			}
			catch (error) {
				this.setState({runStatus: "ERROR_RESULTS", noDataAvailable: true});
				this.props.setLoading(false);
				this.handleEvaluatorResults("");
				console.error("error getting the response from flask api:", error);
			}
		}
	}

	handleEvaluatorResults(results) {
		this.props.handleEvaluatorResults(results);
	}

	changeAcres(acres) {
		this.props.changeAcres(acres);
	}

	changeCropCode(cropCode) {
		this.props.changeCropCode(cropCode);
	}

	changeInsUnit(insUnit) {
		this.props.changeInsUnit(insUnit);
	}

	changeCropStateCountyName(changeCropStateCountyName) {
		this.props.changeCropStateCountyName(changeCropStateCountyName);
	}

	changeInsurancePlan(insurancePlan) {
		this.props.changeInsurancePlan(insurancePlan);
	}

	changeCoverageLevel(coverageLevel) {
		this.props.changeCoverageLevel(coverageLevel);
	}

	componentDidMount() {
		if (this.props.evaluatorResults === undefined) {
			this.handleEvaluatorResults(null);
		}

		this.syncPropsToState();
		this.loadInitialData();
	}

	componentWillUnmount() {
		// Clean up debounce timer
		if (this.state.acresDebounceTimer) {
			clearTimeout(this.state.acresDebounceTimer);
		}
	}

	syncPropsToState() {
		const updates = {};

		if (this.props.acres && this.props.acres !== this.state.farmAcres) {
			updates.farmAcres = this.props.acres;
		}

		if (
			this.props.insurancePlan &&
			this.props.insurancePlan !== this.state.insurancePlan
		) {
			updates.insurancePlan = this.props.insurancePlan;
		}

		if (
			this.props.coverageLevel &&
			this.props.coverageLevel !== this.state.coverageLevel
		) {
			updates.coverageLevel = this.props.coverageLevel;
		}

		if (
			this.props.aphYield !== null &&
			this.props.aphYield !== undefined &&
			this.props.aphYield !== this.state.aphYield
		) {
			updates.aphYield = this.props.aphYield;
		}

		if (
			this.props.farmTaYield !== null &&
			this.props.farmTaYield !== undefined &&
			this.props.farmTaYield !== this.state.farmTaYield
		) {
			updates.farmTaYield = this.props.farmTaYield;
		}

		if (
			this.props.cropStateCountyName &&
			this.props.cropStateCountyName.length === 3
		) {
			updates.selectedCrop = this.props.cropStateCountyName[0];
			updates.selectedState = this.props.cropStateCountyName[1];
			updates.selectedCounty = this.props.cropStateCountyName[2];

			this.syncDropdownValues(this.props.cropStateCountyName, updates);
		}

		if (Object.keys(updates).length > 0) {
			this.setState(updates);
		}
	}

	syncDropdownValues(cropStateCountyName, updates) {
		const [cropName, stateName, countyName] = cropStateCountyName;

		const matchingCrop = this.state.crops.find(
			(crop) => crop.name === cropName
		);
		if (matchingCrop) {
			updates.cropId = matchingCrop.cropId;
			updates.cropSelValue = {value: matchingCrop.cropId, label: cropName};

			if (this.state.county) {
				const cropCountyCode = `${this.state.county}${matchingCrop.cropId}`;
				updates.cropCountyCode = cropCountyCode;
			}
		}

		const matchingState = this.state.states.find(
			(state) => state.name === stateName
		);
		if (matchingState) {
			updates.stateSel = matchingState.id;
			updates.stateSelValue = {value: matchingState.id, label: stateName};

			const matchingCounty = this.state.counties.find(
				(county) => county.name === countyName
			);
			if (matchingCounty) {
				updates.county = matchingCounty.id;
				updates.countySelValue = {
					value: matchingCounty.id,
					label: countyName,
				};

				if (matchingCrop) {
					const cropCountyCode = `${matchingCounty.id}${matchingCrop.cropId}`;
					updates.cropCountyCode = cropCountyCode;
				}
			}
			else if (this.state.counties.length === 0) {
				this.populateCountiesAndSync(matchingState.id, countyName);
			}
		}
	}

	populateCountiesAndSync(stateId, countyName) {
		getCounties(stateId)
			.then(function (response) {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error(
						"Flask Service API call failed. Most likely the token expired"
					);
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					return;
				}
				const countiesJson = data.map((st) => {
					return st;
				});
				this.setState({
					counties: countiesJson,
				});

				const matchingCounty = countiesJson.find(
					(county) => county.name === countyName
				);
				if (matchingCounty) {
					this.setState({
						county: matchingCounty.id,
						countySelValue: {value: matchingCounty.id, label: countyName},
					});
				}
			})
			.catch((error) => {
				console.error("Error loading counties:", error);
			});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.acres !== this.props.acres) {
			if (this.props.acres !== this.state.farmAcres) {
				this.setState({farmAcres: this.props.acres});
			}
		}
		else if (this.props.acres && this.props.acres !== this.state.farmAcres) {
			this.setState({farmAcres: this.props.acres});
		}

		if (prevProps.insurancePlan !== this.props.insurancePlan) {
			if (this.props.insurancePlan !== this.state.insurancePlan) {
				this.setState({insurancePlan: this.props.insurancePlan});
			}
		}
		else if (
			this.props.insurancePlan &&
			this.props.insurancePlan !== this.state.insurancePlan
		) {
			this.setState({insurancePlan: this.props.insurancePlan});
		}

		if (prevProps.coverageLevel !== this.props.coverageLevel) {
			if (this.props.coverageLevel !== this.state.coverageLevel) {
				this.setState({coverageLevel: this.props.coverageLevel});
			}
		}
		else if (
			this.props.coverageLevel &&
			this.props.coverageLevel !== this.state.coverageLevel
		) {
			this.setState({coverageLevel: this.props.coverageLevel});
		}

		if (prevProps.aphYield !== this.props.aphYield) {
			if (this.props.aphYield !== this.state.aphYield) {
				this.setState({aphYield: this.props.aphYield || ""});
			}
		}
		else if (
			this.props.aphYield !== null &&
			this.props.aphYield !== undefined &&
			this.props.aphYield !== this.state.aphYield
		) {
			this.setState({aphYield: this.props.aphYield || ""});
		}

		if (prevProps.farmTaYield !== this.props.farmTaYield) {
			if (this.props.farmTaYield !== this.state.farmTaYield) {
				this.setState({farmTaYield: this.props.farmTaYield || ""});
			}
		}
		else if (
			this.props.farmTaYield !== null &&
			this.props.farmTaYield !== undefined &&
			this.props.farmTaYield !== this.state.farmTaYield
		) {
			this.setState({farmTaYield: this.props.farmTaYield || ""});
		}

		if (prevProps.cropStateCountyName !== this.props.cropStateCountyName) {
			if (
				this.props.cropStateCountyName &&
				this.props.cropStateCountyName.length === 3
			) {
				const updates = {
					selectedCrop: this.props.cropStateCountyName[0],
					selectedState: this.props.cropStateCountyName[1],
					selectedCounty: this.props.cropStateCountyName[2],
				};
				this.syncDropdownValues(this.props.cropStateCountyName, updates);
				this.setState(updates);
			}
		}
		else if (
			this.props.cropStateCountyName &&
			this.props.cropStateCountyName.length === 3 &&
			!this.state.isInitializing
		) {
			if (
				this.state.selectedCrop !== this.props.cropStateCountyName[0] ||
				this.state.selectedState !== this.props.cropStateCountyName[1] ||
				this.state.selectedCounty !== this.props.cropStateCountyName[2]
			) {
				const updates = {
					selectedCrop: this.props.cropStateCountyName[0],
					selectedState: this.props.cropStateCountyName[1],
					selectedCounty: this.props.cropStateCountyName[2],
				};
				this.syncDropdownValues(this.props.cropStateCountyName, updates);
				this.setState(updates);
			}
		}
	}

	loadInitialData() {
		const token = localStorage.getItem("kcToken");

		if (!token && this.state.retryCount < this.state.maxRetries) {
			this.setState({retryCount: this.state.retryCount + 1});
			setTimeout(() => this.loadInitialData(), 100);
			return;
		}

		if (!token) {
			console.error("Failed to get authentication token after maximum retries");
			return;
		}

		getStates("insurance")
			.then((response) => {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error(
						"Flask Service API call failed. Status:",
						response ? response.status : "no response"
					);
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					return;
				}
				const statesJson = data.map((st) => {
					return st;
				});
				this.setState({
					states: statesJson,
				});

				if (
					!this.props.cropStateCountyName ||
					this.props.cropStateCountyName.length === 0
				) {
					this.populateCounties(statesJson[0].id);
				}
				else {
					const stateName = this.props.cropStateCountyName[1];
					const matchingState = statesJson.find(
						(state) => state.name === stateName
					);
					if (matchingState) {
						this.populateCounties(matchingState.id);
					}
				}
			})
			.catch((error) => {
				console.error("Error loading states:", error);
			});

		getCrops("insurance")
			.then((response) => {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error(
						"Flask Service API call failed. Status:",
						response ? response.status : "no response"
					);
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					return;
				}
				const cropsJson = data.map((st) => {
					return covertToLegacyCropFormat(st);
				});
				this.setState(
					{
						crops: cropsJson,
					},
					() => {
						if (
							this.props.cropStateCountyName &&
							this.props.cropStateCountyName.length === 3
						) {
							const updates = {};
							this.syncDropdownValues(this.props.cropStateCountyName, updates);
							if (Object.keys(updates).length > 0) {
								this.setState(updates);
							}
						}
						this.setState({isInitializing: false});
					}
				);
			})
			.catch((error) => {
				console.error("Error loading crops:", error);
			});
	}

	populateCounties(stateId, skipSync = false) {
		getCounties(stateId)
			.then(function (response) {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error(
						"Flask Service API call failed. Most likely the token expired"
					);
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					return;
				}
				const countiesJson = data.map((st) => {
					return st;
				});
				this.setState(
					{
						counties: countiesJson,
						noDataAvailable: countiesJson.length === 0,
					},
					() => {
						if (
							!skipSync &&
							this.props.cropStateCountyName &&
							this.props.cropStateCountyName.length === 3
						) {
							const updates = {};
							this.syncDropdownValues(this.props.cropStateCountyName, updates);
							if (Object.keys(updates).length > 0) {
								this.setState(updates);
							}
						}
					}
				);
			})
			.catch((error) => {
				console.error("Error loading counties:", error);
				this.setState({noDataAvailable: true});
			});
	}

	populateCropUnits(cropId) {
		this.state.crops.forEach((item) => {
			if (item.cropId === cropId) {
				this.setState({
					units: item.units,
				});
			}
		});
	}

	validateInputs() {
		return this.state.farmAcres >= 1 && this.state.cropCountyCode >= 1;
	}

	render() {
		const {classes} = this.props;

		let stateOptions = [];
		this.state.states.forEach((item) => {
			stateOptions.push({value: item.id, label: item.name});
		});

		let countyOptions = [];
		this.state.counties.forEach((item) => {
			countyOptions.push({value: item.id, label: item.name});
		});

		let cropOptions = [];
		this.state.crops.forEach((item) => {
			cropOptions.push({value: item.cropId, label: item.name});
		});

		const showNoDataAlert =
			this.state.noDataAvailable &&
			this.state.cropId !== null &&
			this.state.county !== "";

		return (
			<ThemeProvider theme={newEvaluatorTheme}>
				<div className="evaluator-sidebar">
					{showNoDataAlert && (
						<Box className={classes.alertBox}>
							<ErrorOutlineIcon className={classes.alertIcon} />
							<Typography className={classes.alertText}>
								Data not available for the selected crop in the county. Choose a
								different crop or county.
							</Typography>
						</Box>
					)}

					<Typography className="section-title">Farm Information</Typography>

					<Box mb={2}>
						<Typography className="field-label">STATE</Typography>
						<FormControl className={classes.formControl}>
							<ReactSelect
								styles={getReactSelectStyles(false)}
								classes={classes}
								className="select-input"
								classNamePrefix="react-select"
								options={stateOptions}
								value={this.state.stateSelValue}
								placeholder="Select"
								onChange={this.handleReactSelectChange("stateSel")}
							/>
						</FormControl>
					</Box>

					<Box mb={2}>
						<Typography
							className="field-label"
							style={{
								color: this.state.validationErrors.county
									? warningColor
									: undefined,
							}}
						>
							COUNTY
						</Typography>
						<FormControl className={classes.formControl}>
							<ReactSelect
								styles={getReactSelectStyles(
									this.state.validationErrors.county
								)}
								classes={classes}
								className="select-input"
								classNamePrefix="react-select"
								value={this.state.countySelValue}
								placeholder="Select"
								options={countyOptions}
								onChange={this.handleReactSelectChange("county")}
							/>
							{this.state.validationErrors.county && (
								<Typography className={classes.errorText}>
									County is required to run calculator
								</Typography>
							)}
						</FormControl>
					</Box>

					<Box mb={2}>
						<Typography
							className="field-label"
							style={{
								color: this.state.validationErrors.cropId
									? warningColor
									: undefined,
							}}
						>
							CROP
						</Typography>
						<FormControl className={classes.formControl}>
							<ReactSelect
								styles={getReactSelectStyles(
									this.state.validationErrors.cropId
								)}
								classes={classes}
								className="select-input"
								classNamePrefix="react-select"
								placeholder="Select"
								value={this.state.cropSelValue}
								options={cropOptions}
								onChange={this.handleReactSelectChange("cropId")}
							/>
							{this.state.validationErrors.cropId && (
								<Typography className={classes.errorText}>
									Crop is required to run calculator
								</Typography>
							)}
						</FormControl>
					</Box>

					<Box mb={2}>
						<Box className="field-label-with-info">
							<Typography
								className="field-label"
								style={{
									color: this.state.validationErrors.farmAcres
										? warningColor
										: undefined,
								}}
							>
								ACRES
							</Typography>
							<Tooltip
								title="Enter the total number of acres for your farm"
								placement="right"
								arrow
							>
								<InfoIcon
									className="info-icon"
									style={{
										fontSize: "16px",
										color: newEvaluatorTheme.palette.icon.active,
									}}
								/>
							</Tooltip>
						</Box>
						<FormControl className={classes.formControl}>
							<TextField
								id="farmAcres"
								value={this.state.farmAcres}
								onChange={this.handleMuiChange("farmAcres")}
								className={`${classes.textField} ${
									this.state.validationErrors.farmAcres
										? classes.textFieldError
										: ""
								}`}
								required
								placeholder="100-10000"
								InputLabelProps={{shrink: true}}
								type="number"
								variant="standard"
								InputProps={{
									disableUnderline: false,
								}}
								sx={{
									input: {
										fontSize: "14px !important",
										color: newEvaluatorTheme.palette.text.primary,
										"&::placeholder": {
											color: newEvaluatorTheme.palette.text.disabled,
											opacity: 1,
										},
									},
								}}
							/>
							{this.state.validationErrors.farmAcres && (
								<Typography className={classes.errorText}>
									Acres must be between 100 and 10000
								</Typography>
							)}
						</FormControl>
					</Box>

					<Box mb={2}>
						<Box className="field-label-with-info">
							<Typography className="field-label">APH YIELD</Typography>
							<Tooltip
								title="County average APH is used"
								placement="right"
								arrow
							>
								<InfoIcon
									className="info-icon"
									style={{
										fontSize: "16px",
										color: newEvaluatorTheme.palette.icon.active,
									}}
								/>
							</Tooltip>
						</Box>
						<FormControl className={classes.formControl}>
							<TextField
								id="aphYield"
								value={this.state.aphYield}
								className={classes.textField}
								placeholder="xx.xx"
								InputLabelProps={{shrink: true}}
								type="text"
								variant="standard"
								disabled
								InputProps={{
									disableUnderline: false,
									readOnly: true,
									style: {
										cursor: "not-allowed",
									},
									endAdornment: (
										<>
											{this.state.isLoadingYields && (
												<CircularProgress
													size={16}
													style={{
														color: newEvaluatorTheme.palette.primary.main,
														marginRight: "8px",
													}}
												/>
											)}
											<Typography
												style={{
													color: newEvaluatorTheme.palette.text.secondary,
													fontSize: "14px",
												}}
											>
												bu/acre
											</Typography>
										</>
									),
								}}
								sx={{
									input: {
										fontSize: "14px !important",
										color: newEvaluatorTheme.palette.text.primary,
										cursor: "not-allowed",
										"&::placeholder": {
											color: newEvaluatorTheme.palette.text.disabled,
											opacity: 1,
										},
									},
								}}
							/>
						</FormControl>
					</Box>

					<Box mb={2}>
						<Box className="field-label-with-info">
							<Typography className="field-label">FARM TA YIELD</Typography>
							<Tooltip
								title="A pre-calculated trend adjustment is used"
								placement="right"
								arrow
							>
								<InfoIcon
									className="info-icon"
									style={{
										fontSize: "16px",
										color: newEvaluatorTheme.palette.icon.active,
									}}
								/>
							</Tooltip>
						</Box>
						<FormControl className={classes.formControl}>
							<TextField
								id="farmTaYield"
								value={this.state.farmTaYield}
								className={classes.textField}
								placeholder="xx"
								InputLabelProps={{shrink: true}}
								type="text"
								variant="standard"
								disabled
								InputProps={{
									disableUnderline: false,
									readOnly: true,
									style: {
										cursor: "not-allowed",
									},
									endAdornment: (
										<>
											{this.state.isLoadingYields && (
												<CircularProgress
													size={16}
													style={{
														color: newEvaluatorTheme.palette.primary.main,
														marginRight: "8px",
													}}
												/>
											)}
											<Typography
												style={{
													color: newEvaluatorTheme.palette.text.secondary,
													fontSize: "14px",
												}}
											>
												bu/acre
											</Typography>
										</>
									),
								}}
								sx={{
									input: {
										fontSize: "14px !important",
										color: newEvaluatorTheme.palette.text.primary,
										cursor: "not-allowed",
										"&::placeholder": {
											color: newEvaluatorTheme.palette.text.disabled,
											opacity: 1,
										},
									},
								}}
							/>
						</FormControl>
					</Box>

					<Typography
						variant="h6"
						className="section-title"
						style={{marginTop: "32px"}}
					>
						Insurance Plan
					</Typography>

					<Box className="insurance-plan-options">
						<Box
							className="insurance-option"
							onClick={() => {
								this.setState({insurancePlan: "rp"});
								this.changeInsurancePlan("rp");
							}}
						>
							<input
								type="radio"
								checked={this.state.insurancePlan === "rp"}
								onChange={() => {
									this.setState({insurancePlan: "rp"});
									this.changeInsurancePlan("rp");
								}}
							/>
							<Box className="option-content">
								<Tooltip
									title="Revenue Protection - Provides coverage based on a combination of price and yield. This is the most popular crop insurance plan."
									placement="right"
									arrow
								>
									<Typography className="option-title">
										Revenue Protection (RP)
									</Typography>
								</Tooltip>
							</Box>
						</Box>
						{this.state.insurancePlan === "rp" && (
							<CoverageLevelSlider
								coverageLevel={this.state.coverageLevel}
								onChange={(level) => {
									this.setState({coverageLevel: level});
									this.changeCoverageLevel(level);
								}}
								minValue={55}
								maxValue={85}
								showNote={false}
								noteText="Most common in the selected county"
							/>
						)}

						<Box
							className="insurance-option"
							onClick={() => {
								this.setState({insurancePlan: "rphpe"});
								this.changeInsurancePlan("rphpe");
							}}
						>
							<input
								type="radio"
								checked={this.state.insurancePlan === "rphpe"}
								onChange={() => {
									this.setState({insurancePlan: "rphpe"});
									this.changeInsurancePlan("rphpe");
								}}
							/>
							<Box className="option-content">
								<Tooltip
									title="Revenue Protection with Harvest Price Exclusion - Provides revenue protection based only on the projected price, excluding harvest price increases."
									placement="right"
									arrow
								>
									<Typography className="option-title">
										Revenue Protection With Harvest Price Exclusion (RP-HPE)
									</Typography>
								</Tooltip>
							</Box>
						</Box>
						{this.state.insurancePlan === "rphpe" && (
							<CoverageLevelSlider
								coverageLevel={this.state.coverageLevel}
								onChange={(level) => {
									this.setState({coverageLevel: level});
									this.changeCoverageLevel(level);
								}}
								minValue={55}
								maxValue={85}
								showNote={false}
								noteText="Most common in the selected county"
							/>
						)}

						<Box
							className="insurance-option"
							onClick={() => {
								this.setState({insurancePlan: "yp"});
								this.changeInsurancePlan("yp");
							}}
						>
							<input
								type="radio"
								checked={this.state.insurancePlan === "yp"}
								onChange={() => {
									this.setState({insurancePlan: "yp"});
									this.changeInsurancePlan("yp");
								}}
							/>
							<Box className="option-content">
								<Tooltip
									title="Yield Protection - Provides coverage based solely on yield, protecting against production losses regardless of price changes."
									placement="right"
									arrow
								>
									<Typography className="option-title">
										Yield Protection (YP)
									</Typography>
								</Tooltip>
							</Box>
						</Box>
					</Box>

					{this.state.insurancePlan === "yp" && (
						<CoverageLevelSlider
							coverageLevel={this.state.coverageLevel}
							onChange={(level) => {
								this.setState({coverageLevel: level});
								this.changeCoverageLevel(level);
							}}
							minValue={55}
							maxValue={85}
							showNote={false}
							noteText="Most common in the selected county"
						/>
					)}

					<Button
						variant="contained"
						color="primary"
						onClick={this.runEvaluator}
						className="run-evaluator-button"
					>
						<ArrowForwardIcon className="button-icon run-calculator-btn" />
						<span
							className="run-calculator-btn"
							style={{
								fontWeight: 600,
								fontSize: "0.9375rem",
								lineHeight: "1.625rem",
								marginLeft: "0.5rem",
							}}
						>
							Run Evaluator
						</span>
					</Button>
				</div>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (state) => ({
	evaluatorResults: state.insEvaluator.evaluatorResults,
	acres: state.insEvaluator.acres,
	insurancePlan: state.insEvaluator.insurancePlan,
	coverageLevel: state.insEvaluator.coverageLevel,
	cropStateCountyName: state.insEvaluator.cropStateCountyName,
	aphYield: state.insEvaluator.aphYield,
	farmTaYield: state.insEvaluator.farmTaYield,
});

const mapDispatchToProps = (dispatch) => ({
	handleEvaluatorResults: (evaluatorResults) =>
		dispatch(handleEvaluatorResults(evaluatorResults)),
	changeAcres: (acres) => dispatch(changeAcres(acres)),
	changeCropCode: (cropCode) => dispatch(changeCropCode(cropCode)),
	changeInsUnit: (insUnit) => dispatch(changeInsUnit(insUnit)),
	changeCropStateCountyName: (cropStateCountyName) =>
		dispatch(changeCropStateCountyName(cropStateCountyName)),
	changeInsurancePlan: (insurancePlan) =>
		dispatch(changeInsurancePlan(insurancePlan)),
	changeCoverageLevel: (coverageLevel) =>
		dispatch(changeCoverageLevel(coverageLevel)),
	setLoading: (loading) => dispatch(setLoading(loading)),
	changeAphYield: (aphYield) => dispatch(changeAphYield(aphYield)),
	changeFarmTaYield: (farmTaYield) => dispatch(changeFarmTaYield(farmTaYield)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(NewEvaluatorSidebar));
