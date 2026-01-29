import React, {Component} from "react";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import {
	FormControl,
	Tooltip,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@material-ui/core";
import {withStyles, ThemeProvider} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import InfoIcon from "@material-ui/icons/Info";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import {
	getStates,
	getCounties,
	getCrops,
	covertToLegacyCropFormat,
	getForecastPrices,
	getCropParams,
	roundResults,
} from "../../public/utils";
import {
	handleResults,
	changeCounty,
	changeCommodity,
	changeForecastType,
	changeArcYield,
	changePaymentYield,
	changePracCode,
	changeStateName,
	changeCountyName,
	setLoading,
} from "../../actions/arcplcCalculator";
import config from "../../app.config";
import ReactSelect from "react-select";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import ARCPLCProgramInputs from "./ARCPLCProgramInputs";
import "../../styles/new-evaluator.scss";

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
		color: "#D92D20",
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
		color: "#D92D20",
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
				? "#D92D20"
				: state.isFocused
				? newEvaluatorTheme.palette.primary.main
				: newEvaluatorTheme.palette.stroke.mild
		}`,
		borderRadius: 0,
		backgroundColor: "transparent",
		boxShadow: "none",
		"&:hover": {
			borderBottom: `1px solid ${
				hasError ? "#D92D20" : newEvaluatorTheme.palette.primary.main
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

class NewARCPLCSidebar extends Component {
	state = {
		states: [],
		stateSel: "",
		counties: [],
		county: "",
		crops: [],
		commodity: null,
		units: config.defaultsJson.units,
		forecastPrices: [],
		forecastType: 1,
		forecastName: "",
		statRefPrice: "",
		pracCode: "",
		paymentYield: "",
		arcYield: "",
		countyYield: "",
		runStatus: "INIT",
		countySelValue: null,
		stateSelValue: null,
		commoditySelValue: null,
		forecastSelValue: null,
		retryCount: 0,
		maxRetries: 50,
		isInitializing: true,
		disablePraccode: true,
		hidePraccode: true,
		cropYields: [],
		noDataAvailable: false,
		validationErrors: {
			county: false,
			commodity: false,
		},
		attemptedSubmit: false,
	};

	constructor(props) {
		super(props);
		this.runCalculator = this.runCalculator.bind(this);
		this.handleReactSelectChange = this.handleReactSelectChange.bind(this);
		this.handleMuiChange = this.handleMuiChange.bind(this);
		this.handleResultsChange = this.handleResultsChange.bind(this);
	}

	checkAndPopulateYields = () => {
		const {stateSel, county, commodity} = this.state;
		if (stateSel && county && commodity) {
			this.populateYields(county, commodity);
		}
	};

	handleReactSelectChange = (name) => (event) => {
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
						this.checkAndPopulateYields();
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
				this.props.changeCounty(event.value);
				this.props.changeCountyName(event.label);
				break;
			case "stateSel":
				if (event.value !== "") {
					this.setState({
						stateSelValue: {value: event.value, label: event.label},
						noDataAvailable: false,
					});
					this.setState({countySelValue: null});
					this.setState({county: ""});
					this.props.changeStateName(event.label);
					this.populateCounties(event.value);
				}
				break;
			case "commodity":
				this.setState(
					{
						commoditySelValue: {value: event.value, label: event.label},
						noDataAvailable: false,
					},
					() => {
						this.checkAndPopulateYields();
					}
				);
				if (this.state.attemptedSubmit) {
					this.setState({
						validationErrors: {
							...this.state.validationErrors,
							commodity: event.value === null || event.value === "",
						},
					});
				}
				this.props.changeCommodity(event.value);
				if (event.value !== "") {
					this.populateStatRefPriceAndUnits(event.value);
				}
				break;
			case "forecastType":
				this.setState({
					forecastSelValue: {value: event.value, label: event.label},
					forecastName: event.label,
				});
				this.props.changeForecastType(event.value);
				break;
		}
	};

	handleMuiChange = (name) => (event) => {
		this.setState({
			[name]: event.target.value,
		});
		if (name === "arcYield") {
			this.props.changeArcYield(event.target.value);
		}
		if (name === "paymentYield") {
			this.props.changePaymentYield(event.target.value);
		}
	};

	handlePracCodeChange = (event) => {
		let selPrac = event.target.value;
		this.setState({pracCode: selPrac});
		this.props.changePracCode(selPrac);

		let intSelPrac = parseInt(selPrac);

		this.state.cropYields.forEach((item) => {
			if (item.practice_id === intSelPrac) {
				this.setState({arcYield: item.yield_trend});
				this.setState({countyYield: item.yield_avg});
				this.setState({paymentYield: item.yield_avg});
				this.props.changeArcYield(item.yield_trend);
				this.props.changePaymentYield(item.yield_avg);
			}
		});
	};

	async runCalculator() {
		this.setState({attemptedSubmit: true});

		const errors = {
			county: this.state.county <= 0 || this.state.county === "",
			commodity: this.state.commodity === null || this.state.commodity === "",
		};

		this.setState({validationErrors: errors});

		if (errors.county || errors.commodity) {
			return;
		}

		const token = localStorage.getItem("kcToken");
		const token_header = `Bearer ${token}`;

		const kcHeaders = {
			Authorization: token_header,
		};

		let apiUrl = config.apiUrl;
		let countyId = this.state.county;
		let commodity = this.state.commodity.toLowerCase();
		let pracCode = this.state.pracCode;
		let forecastType = this.state.forecastType;
		let paymentYield = this.state.paymentYield;
		const params = new URLSearchParams({
			crop: commodity,
			practice_code: pracCode,
			county: countyId,
			program: "ARC",
			forecast_type: forecastType,
			pay_yield: paymentYield,
		});

		const endpoint = `${apiUrl}/compute/arcplc?${params.toString()}`;
		this.handleResultsChange(null);
		this.setState({runStatus: "RUNNING"});
		this.props.setLoading(true);

		console.log("=== ARC/PLC Calculator API Request ===");
		console.log("Endpoint:", endpoint);

		try {
			const response = await fetch(endpoint, {
				method: "GET",
				headers: kcHeaders,
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			if (data === "No Data" || !data.programs) {
				throw new Error("No data available for the selected parameters");
			}

			this.handleResultsChange(JSON.stringify(data));
			this.setState({runStatus: "FINISHED"});
			this.props.setLoading(false);
		}
		catch (error) {
			console.error("=== ARC/PLC Calculator API Error ===");
			console.error("Error:", error);
			this.setState({runStatus: "ERROR"});
			this.props.setLoading(false);
			this.handleResultsChange("");
		}
	}

	handleResultsChange(results) {
		this.props.handleResultsChange(results);
	}

	componentDidMount() {
		if (this.props.countyResults === undefined) {
			this.handleResultsChange(null);
		}
		this.loadInitialData();
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

		getStates("arcplc")
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
			})
			.catch((error) => {
				console.error("Error loading states:", error);
			});

		getCrops("arcplc")
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
						this.setState({isInitializing: false});
					}
				);
			})
			.catch((error) => {
				console.error("Error loading crops:", error);
			});

		getForecastPrices()
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
				const forecastsJson = data.map((st) => {
					return st;
				});
				this.setState({
					forecastPrices: forecastsJson,
				});

				if (forecastsJson.length > 0) {
					this.setState({
						forecastType: forecastsJson[0].id,
						forecastName: forecastsJson[0].name,
						forecastSelValue: {
							value: forecastsJson[0].id,
							label: forecastsJson[0].name,
						},
					});
				}
			})
			.catch((error) => {
				console.error("Error loading forecast prices:", error);
			});
	}

	populateCounties(stateId) {
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
					noDataAvailable: countiesJson.length === 0,
				});
			})
			.catch((error) => {
				console.error("Error loading counties:", error);
				this.setState({noDataAvailable: true});
			});
	}

	populateStatRefPriceAndUnits(commodity) {
		this.state.crops.forEach((item) => {
			if (item.id === commodity) {
				let statRefPrice = "";
				if (item.name === "Corn") {
					statRefPrice = "4.10";
				}
				else if (item.name === "Soybeans") {
					statRefPrice = "10.00";
				}
				else if (item.name === "Wheat") {
					statRefPrice = "6.35";
				}
				this.setState({
					statRefPrice: statRefPrice,
					units: item.units,
				});
			}
		});
	}

	populateYields(countyFips, commodity) {
		let commodityDbId = 0;
		let cropsList = this.state.crops;
		for (let i = 0; i < cropsList.length; i++) {
			if (cropsList[i]["id"] === commodity) {
				commodityDbId = cropsList[i]["cropDbKey"];
			}
		}
		getCropParams(countyFips, commodityDbId)
			.then(function (response) {
				console.log("=== Get Crop Params API Response ===");
				console.log("Response URL:", response.url);
				console.log("Response status:", response.status);

				if (response.status === 200) {
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
				let cropParams = data.map((row) => {
					return row;
				});

				if (cropParams.length > 0) {
					this.setState({cropYields: cropParams, noDataAvailable: false});
					if (cropParams.length === 1 && cropParams[0]["practice_id"] != null) {
						const yieldTrend = cropParams[0]["yield_trend"];
						const yieldAvg = cropParams[0]["yield_avg"];
						const practiceId = cropParams[0]["practice_id"];
						if (practiceId === 3) {
							this.setState({
								arcYield: roundResults(yieldTrend, 2),
							});
							this.setState({
								countyYield: roundResults(yieldAvg, 2),
							});
							this.setState({
								paymentYield: roundResults(yieldAvg, 2),
							});
							this.setState({disablePraccode: true});
							this.setState({hidePraccode: true});
						}
						else {
							this.setState({
								arcYield: roundResults(yieldTrend, 2),
							});
							this.setState({
								countyYield: roundResults(yieldAvg, 2),
							});
							this.setState({
								paymentYield: roundResults(yieldAvg, 2),
							});
							this.setState({hidePraccode: false});
							this.setState({disablePraccode: true});
						}
						this.setState({
							pracCode: practiceId.toString(),
						});
						this.props.changePracCode(practiceId.toString());
						this.props.changeArcYield(roundResults(yieldTrend, 2));
						this.props.changePaymentYield(roundResults(yieldAvg, 2));
					}
					else {
						let selPrac = cropParams[0];
						cropParams.forEach((item) => {
							if (item.practice_id === 2) {
								selPrac = item;
							}
						});
						this.setState({
							arcYield: roundResults(selPrac["yield_trend"], 2),
						});
						this.setState({
							countyYield: roundResults(selPrac["yield_avg"], 2),
						});
						this.setState({
							paymentYield: roundResults(selPrac["yield_avg"], 2),
						});
						this.setState({pracCode: selPrac["practice_id"].toString()});
						this.setState({hidePraccode: false});
						this.setState({disablePraccode: false});
						this.props.changePracCode(selPrac["practice_id"].toString());
						this.props.changeArcYield(roundResults(selPrac["yield_trend"], 2));
						this.props.changePaymentYield(
							roundResults(selPrac["yield_avg"], 2)
						);

					}
				}
				else {
					this.setState({cropYields: []});
					this.setState({arcYield: ""});
					this.setState({countyYield: ""});
					this.setState({paymentYield: ""});
					this.setState({pracCode: ""});
					this.setState({hidePraccode: true});
					this.setState({disablePraccode: true});
					this.setState({noDataAvailable: true});
				}
			})
			.catch((error) => {
				console.error("Error loading crop yields:", error);
			});
	}

	getMarketPricesForForecastModel(modelId, commodity) {
		let modelsList = this.state.forecastPrices;
		let retstr = "";
		for (let i = 0; i < modelsList.length; i++) {
			if (modelsList[i]["id"] === modelId) {
				return (retstr = modelsList[i]["prices"][commodity].join());
			}
		}
		return retstr;
	}

	getBinSizeForCrop(cropId) {
		let cropsList = this.state.crops;
		let binSize = 10;
		for (let i = 0; i < cropsList.length; i++) {
			if (cropsList[i]["id"] === cropId) {
				return (binSize = cropsList[i]["binSize"]);
			}
		}
		return binSize;
	}

	validateInputs() {
		return (
			this.state.county > 0 &&
			this.state.commodity !== null &&
			this.state.commodity !== "" &&
			this.state.forecastType !== "" &&
			this.state.arcYield !== "" &&
			this.state.pracCode !== ""
		);
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
			cropOptions.push({value: item.id, label: item.name});
		});

		let forecastTypeOptions = [];
		this.state.forecastPrices.forEach((item) => {
			forecastTypeOptions.push({value: item.id, label: item.name});
		});

		const showNoDataAlert =
			this.props.countyResults === "" || this.state.noDataAvailable;

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

					<Typography className="section-title">
						FSA-Registered Farm Info
					</Typography>

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
									? "#D92D20"
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

					<Box
						mb={2}
						style={{display: "flex", gap: "16px", alignItems: "flex-start"}}
					>
						<Box style={{flex: 1, minWidth: 0}}>
							<Typography
								className="field-label"
								style={{
									color: this.state.validationErrors.commodity
										? "#D92D20"
										: undefined,
								}}
							>
								CROP
							</Typography>
							<FormControl className={classes.formControl}>
								<ReactSelect
									styles={getReactSelectStyles(
										this.state.validationErrors.commodity
									)}
									classes={classes}
									className="select-input"
									classNamePrefix="react-select"
									placeholder="Select"
									value={this.state.commoditySelValue}
									options={cropOptions}
									onChange={this.handleReactSelectChange("commodity")}
								/>
								{this.state.validationErrors.commodity && (
									<Typography className={classes.errorText}>
										Crop is required to run calculator
									</Typography>
								)}
							</FormControl>
						</Box>
						<Box style={{flex: 0, minWidth: "150px"}}>
							<Box className="field-label-with-info">
								<Typography className="field-label">
									PLC PAYMENT YIELD
								</Typography>
								<Tooltip
									title="Payment yield used for PLC program calculations"
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
									id="paymentYield"
									value={this.state.paymentYield}
									onChange={this.handleMuiChange("paymentYield")}
									className={classes.textField}
									InputLabelProps={{shrink: true}}
									type="number"
									variant="standard"
									InputProps={{
										disableUnderline: false,
										endAdornment: (
											<Typography
												style={{
													color: newEvaluatorTheme.palette.text.secondary,
													fontSize: "14px",
													marginLeft: "4px",
												}}
											>
												{this.state.units}
											</Typography>
										),
									}}
									sx={{
										fontSize: "14px !important",
										color: newEvaluatorTheme.palette.text.disabled,
									}}
								/>
							</FormControl>
						</Box>
					</Box>

					<Box
						mb={2}
						style={{display: this.state.hidePraccode ? "none" : "block"}}
					>
						<FormControl
							className={classes.formControl}
							disabled={this.state.disablePraccode}
						>
							<Box style={{display: "flex", alignItems: "center", marginBottom: "8px"}}>
								<FormLabel
									style={{
										fontSize: "12px",
										color: newEvaluatorTheme.palette.text.secondary,
										textTransform: "uppercase",
										marginBottom: 0,
									}}
								>
									PRACTICE TYPE
								</FormLabel>
								<Tooltip
									title="Select the practice type for your farm - Irrigated or Non-Irrigated"
									placement="right"
									arrow
								>
									<InfoIcon
										className="info-icon"
										style={{
											fontSize: "16px",
											color: newEvaluatorTheme.palette.icon.active,
											marginLeft: "8px",
										}}
									/>
								</Tooltip>
							</Box>
							<RadioGroup
								aria-label="pracCode"
								name="pracCode"
								row={true}
								value={this.state.pracCode}
								onChange={this.handlePracCodeChange}
							>
								<FormControlLabel
									className="type-label"
									value="1"
									control={<Radio color="primary" />}
									label="Irrigated"
								/>
								<FormControlLabel
									value="2"
									className="type-label"
									control={<Radio color="primary" />}
									label="Non-Irrigated"
								/>
							</RadioGroup>
						</FormControl>
					</Box>

					<Box mb={2}>
						<Typography className="field-label">FORECAST MODEL</Typography>
						<FormControl className={classes.formControl}>
							<TextField
								id="forecastModel"
								value="Forecast"
								disabled={true}
								className={classes.textField}
								InputLabelProps={{shrink: true}}
								type="text"
								variant="standard"
								InputProps={{
									disableUnderline: false,
								}}
								sx={{
									fontSize: "14px !important",
									color: newEvaluatorTheme.palette.text.disabled,
								}}
							/>
						</FormControl>
					</Box>

					<ARCPLCProgramInputs />

					<Button
						variant="contained"
						color="primary"
						onClick={this.runCalculator}
						disabled={!this.validateInputs()}
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
							Run Calculator
						</span>
					</Button>
				</div>
			</ThemeProvider>
		);
	}
}

const mapStateToProps = (state) => ({
	countyResults: state.arcplcCalculator.countyResults,
	county: state.arcplcCalculator.county,
	commodity: state.arcplcCalculator.commodity,
	forecastType: state.arcplcCalculator.forecastType,
	arcYield: state.arcplcCalculator.arcYield,
	pracCode: state.arcplcCalculator.pracCode,
});

const mapDispatchToProps = (dispatch) => ({
	handleResultsChange: (results) => dispatch(handleResults(results)),
	changeCounty: (county) => dispatch(changeCounty(county)),
	changeCommodity: (commodity) => dispatch(changeCommodity(commodity)),
	changeForecastType: (forecastType) =>
		dispatch(changeForecastType(forecastType)),
	changeArcYield: (arcYield) => dispatch(changeArcYield(arcYield)),
	changePaymentYield: (paymentYield) =>
		dispatch(changePaymentYield(paymentYield)),
	changePracCode: (pracCode) => dispatch(changePracCode(pracCode)),
	changeStateName: (stateName) => dispatch(changeStateName(stateName)),
	changeCountyName: (countyName) => dispatch(changeCountyName(countyName)),
	setLoading: (loading) => dispatch(setLoading(loading)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(NewARCPLCSidebar));
