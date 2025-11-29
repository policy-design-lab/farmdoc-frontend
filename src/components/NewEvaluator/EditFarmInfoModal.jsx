import React, {useState, useEffect} from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Box,
	Typography,
	IconButton,
	TextField,
	Button,
	ThemeProvider,
	Tooltip,
	CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import ReactSelect from "react-select";
import newEvaluatorTheme from "../../theme/newEvaluatorTheme";
import {getStates, getCounties, getCrops, covertToLegacyCropFormat} from "../../public/utils";
import config from "../../app.config";
import "../../styles/new-evaluator.scss";

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

const warningColor = "#D92D20";

const alertBoxStyles = {
	backgroundColor: "#FEF3F2",
	borderRadius: "8px",
	padding: "12px",
	marginBottom: "16px",
	display: "flex",
	alignItems: "flex-start",
	gap: "12px",
};

const alertIconStyles = {
	color: warningColor,
	fontSize: "20px",
	flexShrink: 0,
	marginTop: "2px",
};

const alertTextStyles = {
	color: "#B42318",
	fontSize: "14px",
	fontWeight: 400,
	lineHeight: "20px",
	margin: 0,
};

const errorTextStyles = {
	color: warningColor,
	fontSize: "12px",
	fontWeight: 400,
	marginTop: "4px",
	lineHeight: "16px",
};

const EditFarmInfoModal = ({open, onClose, onSave, initialData = {}}) => {
	const [formData, setFormData] = useState({
		state: initialData.state || "",
		county: initialData.county || "",
		crop: initialData.crop || "",
		acres: initialData.acres || "",
		aphYield: initialData.aphYield || "",
		farmTaYield: initialData.farmTaYield || "",
	});

	const [stateOptions, setStateOptions] = useState([]);
	const [countyOptions, setCountyOptions] = useState([]);
	const [cropOptions, setCropOptions] = useState([]);
	const [states, setStates] = useState([]);
	const [crops, setCrops] = useState([]);
	const [isLoadingCounties, setIsLoadingCounties] = useState(false);
	const [isLoadingYields, setIsLoadingYields] = useState(false);
	const [noDataAvailable, setNoDataAvailable] = useState(false);
	const [validationErrors, setValidationErrors] = useState({
		state: false,
		county: false,
		crop: false,
		acres: false,
	});
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);

	useEffect(() => {
		if (open) {
			setFormData({
				state: initialData.state || "",
				county: initialData.county || "",
				crop: initialData.crop || "",
				acres: initialData.acres || "",
				aphYield: initialData.aphYield || "",
				farmTaYield: initialData.farmTaYield || "",
			});
			setNoDataAvailable(false);
			setAttemptedSubmit(false);
			setValidationErrors({
				state: false,
				county: false,
				crop: false,
				acres: false,
			});
		}
	}, [open, initialData]);

	useEffect(() => {
		getStates("insurance")
			.then(function (response) {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error("[EditFarmInfoModal] Failed to fetch states");
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					return;
				}
				setStates(data);
				const statesJson = data.map((st) => ({
					value: st.id,
					label: st.name,
				}));
				setStateOptions(statesJson);
			})
			.catch((error) => {
				console.error("[EditFarmInfoModal] Error loading states:", error);
			});

		getCrops("insurance")
			.then((response) => {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error("[EditFarmInfoModal] Failed to fetch crops");
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					return;
				}
				const cropsJson = data.map((st) => covertToLegacyCropFormat(st));
				setCrops(cropsJson);
				const cropOpts = cropsJson.map((crop) => ({
					value: crop.cropId,
					label: crop.name,
				}));
				setCropOptions(cropOpts);
			})
			.catch((error) => {
				console.error("[EditFarmInfoModal] Error loading crops:", error);
			});
	}, []);

	useEffect(() => {
		if (open && initialData.state && states.length > 0) {
			const matchingState = states.find(
				(state) => state.name === initialData.state
			);
			if (matchingState) {
				loadCountiesForState(matchingState.id);
			}
		}
	}, [open, initialData.state, states]);

	const loadCountiesForState = (stateId) => {
		setIsLoadingCounties(true);
		getCounties(stateId)
			.then(function (response) {
				if (response && response.status === 200) {
					return response.json();
				}
				else {
					console.error("[EditFarmInfoModal] Failed to fetch counties");
					return null;
				}
			})
			.then((data) => {
				if (!data) {
					setIsLoadingCounties(false);
					return;
				}
				const countiesJson = data.map((county) => ({
					value: county.id,
					label: county.name,
				}));
				setCountyOptions(countiesJson);
				setIsLoadingCounties(false);
			})
			.catch((error) => {
				console.error("[EditFarmInfoModal] Error loading counties:", error);
				setIsLoadingCounties(false);
			});
	};

	const checkAndFetchYields = (state, county, crop, acres) => {
		if (!state || !county || !crop || !acres) {
			return;
		}

		const acresValue = parseFloat(acres);
		if (isNaN(acresValue) || acresValue < 100 || acresValue > 10000) {
			return;
		}

		const matchingState = states.find((s) => s.name === state);
		const matchingCrop = crops.find((c) => c.name === crop);

		if (!matchingState || !matchingCrop) {
			return;
		}

		const countyData = countyOptions.find((c) => c.label === county);
		if (!countyData) {
			return;
		}

		const cropCountyCode = `${countyData.value}${matchingCrop.cropId}`;
		fetchAndPopulateYields(cropCountyCode, acres);
	};

	const fetchAndPopulateYields = async (cropCountyCode, acres) => {
		if (!cropCountyCode || cropCountyCode === "" || !acres) {
			return;
		}

		setIsLoadingYields(true);
		setNoDataAvailable(false);

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
				if (evaluatorResult === "No Data" || typeof evaluatorResult === "string") {
					setNoDataAvailable(true);
					setFormData((prev) => ({
						...prev,
						aphYield: "",
						farmTaYield: "",
					}));
				}
				else if (typeof evaluatorResult === "object" && evaluatorResult["farm-info"]) {
					const farmInfo = evaluatorResult["farm-info"];
					setFormData((prev) => ({
						...prev,
						aphYield: farmInfo["farm-aph"] !== undefined && farmInfo["farm-aph"] !== null ? farmInfo["farm-aph"] : prev.aphYield,
						farmTaYield: farmInfo["trend-adj-aph"] !== undefined && farmInfo["trend-adj-aph"] !== null ? farmInfo["trend-adj-aph"] : prev.farmTaYield,
					}));
					setNoDataAvailable(false);
				}
				else {
					setNoDataAvailable(true);
					setFormData((prev) => ({
						...prev,
						aphYield: "",
						farmTaYield: "",
					}));
				}
			}
		}
		catch (error) {
			console.error("Error:", error);
		}
		finally {
			setIsLoadingYields(false);
		}
	};

	const handleSelectChange = (field) => (selectedOption) => {
		const newValue = selectedOption ? selectedOption.label : "";
		if (field === "state") {
			const matchingState = states.find(
				(state) => state.id === selectedOption.value
			);
			if (matchingState) {
				setFormData((prev) => ({
					...prev,
					state: selectedOption.label,
					county: "",
				}));
				setCountyOptions([]);
				loadCountiesForState(matchingState.id);
				setNoDataAvailable(false);
				if (attemptedSubmit) {
					setValidationErrors((prev) => ({
						...prev,
						state: !selectedOption.label,
					}));
				}
			}
		}
		else if (field === "county") {
			setFormData((prev) => {
				const updated = {
					...prev,
					county: newValue,
				};
				checkAndFetchYields(prev.state, newValue, prev.crop, prev.acres);
				return updated;
			});
			setNoDataAvailable(false);
			if (attemptedSubmit) {
				setValidationErrors((prev) => ({
					...prev,
					county: !newValue,
				}));
			}
		}
		else if (field === "crop") {
			setFormData((prev) => {
				const updated = {
					...prev,
					crop: newValue,
				};
				checkAndFetchYields(prev.state, prev.county, newValue, prev.acres);
				return updated;
			});
			setNoDataAvailable(false);
			if (attemptedSubmit) {
				setValidationErrors((prev) => ({
					...prev,
					crop: !newValue,
				}));
			}
		}
	};

	const handleInputChange = (field) => (event) => {
		const inputValue = event.target.value;
		if (field === "acres") {
			setFormData((prev) => {
				const updated = {
					...prev,
					acres: inputValue,
				};
				const acresValue = parseFloat(inputValue);
				const isInvalidAcres = inputValue === "" || isNaN(acresValue) || acresValue < 100 || acresValue > 10000;
				if (attemptedSubmit) {
					setValidationErrors((prevErrors) => ({
						...prevErrors,
						acres: isInvalidAcres,
					}));
				}
				if (!isInvalidAcres) {
					checkAndFetchYields(prev.state, prev.county, prev.crop, inputValue);
				}
				return updated;
			});
		}
		else {
			setFormData({
				...formData,
				[field]: inputValue,
			});
		}
	};

	const handleSave = () => {
		setAttemptedSubmit(true);
		const acresValue = parseFloat(formData.acres);
		const errors = {
			state: !formData.state,
			county: !formData.county,
			crop: !formData.crop,
			acres: formData.acres === "" || isNaN(acresValue) || acresValue < 100 || acresValue > 10000,
		};
		setValidationErrors(errors);
		if (errors.state || errors.county || errors.crop || errors.acres) {
			return;
		}
		const countyData = countyOptions.find((c) => c.label === formData.county);
		const matchingCrop = crops.find((c) => c.name === formData.crop);
		const cropCode = countyData && matchingCrop ? `${countyData.value}${matchingCrop.cropId}` : null;

		if (onSave) {
			onSave({
				...formData,
				cropCode
			});
		}
		onClose();
	};

	return (
		<ThemeProvider theme={newEvaluatorTheme}>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="sm"
				fullWidth
				className="edit-farm-info-modal"
			>
				<DialogTitle className="modal-title">
					<Box
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						}}
					>
						<Typography className="modal-title-text">
							Farm Information
						</Typography>
						<IconButton onClick={onClose} className="modal-close-button">
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent className="modal-content">
					{noDataAvailable && (
						<Box style={alertBoxStyles}>
							<ErrorOutlineIcon style={alertIconStyles} />
							<Typography style={alertTextStyles}>
								Data not available for the selected crop in the county. Choose a different crop or county.
							</Typography>
						</Box>
					)}
					<Box className="modal-form">
						<Box className="modal-form-field">
							<Typography
								className="field-label"
								style={{color: validationErrors.state ? warningColor : undefined}}
							>
								STATE
							</Typography>
							<ReactSelect
								styles={getReactSelectStyles(validationErrors.state)}
								value={formData.state ? {value: formData.state, label: formData.state} : null}
								options={stateOptions}
								onChange={handleSelectChange("state")}
								placeholder="Select"
							/>
							{validationErrors.state && (
								<Typography style={errorTextStyles}>
									State is required to run calculator
								</Typography>
							)}
						</Box>

						<Box className="modal-form-field">
							<Typography
								className="field-label"
								style={{color: validationErrors.county ? warningColor : undefined}}
							>
								COUNTY
							</Typography>
							<ReactSelect
								styles={getReactSelectStyles(validationErrors.county)}
								value={formData.county ? {value: formData.county, label: formData.county} : null}
								options={countyOptions}
								onChange={handleSelectChange("county")}
								isLoading={isLoadingCounties}
								isDisabled={countyOptions.length === 0}
								placeholder={
									isLoadingCounties ? "Loading counties..." : "Select county"
								}
							/>
							{validationErrors.county && (
								<Typography style={errorTextStyles}>
									County is required to run calculator
								</Typography>
							)}
						</Box>

						<Box className="modal-form-field">
							<Typography
								className="field-label"
								style={{color: validationErrors.crop ? warningColor : undefined}}
							>
								CROP
							</Typography>
							<ReactSelect
								styles={getReactSelectStyles(validationErrors.crop)}
								value={formData.crop ? {value: formData.crop, label: formData.crop} : null}
								options={cropOptions}
								onChange={handleSelectChange("crop")}
								placeholder="Select"
							/>
							{validationErrors.crop && (
								<Typography style={errorTextStyles}>
									Crop is required to run calculator
								</Typography>
							)}
						</Box>
						<Box className="modal-form-field">
							<Box className="field-label-with-info">
								<Typography
									className="field-label"
									style={{color: validationErrors.acres ? warningColor : undefined}}
								>
									ACRES
								</Typography>
								<Tooltip title="Enter the total acres for this crop (100-10000)" arrow>
									<InfoIcon className="info-icon" />
								</Tooltip>
							</Box>
							<TextField
								value={formData.acres}
								onChange={handleInputChange("acres")}
								fullWidth
								placeholder="100-10000"
								type="number"
								variant="standard"
								InputProps={{
									disableUnderline: false,
									style: {
										borderBottom: validationErrors.acres ? "1px solid #D92D20" : undefined,
									},
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
							{validationErrors.acres && (
								<Typography style={errorTextStyles}>
									Acres must be between 100 and 10000
								</Typography>
							)}
						</Box>

						<Box className="modal-form-field">
							<Box className="field-label-with-info" sx={{mb: 0}}>
								<Typography className="field-label">
									APH YIELD
								</Typography>
								<Tooltip title="County average APH is used" arrow>
									<InfoIcon className="info-icon" />
								</Tooltip>
							</Box>
							<TextField
								value={formData.aphYield}
								fullWidth
								placeholder="xx.xx"
								disabled
								variant="standard"
								InputProps={{
									disableUnderline: false,
									readOnly: true,
									style: {
										cursor: "not-allowed",
									},
									endAdornment: (
										<>
											{isLoadingYields && (
												<CircularProgress
													size={16}
													style={{
														color: newEvaluatorTheme.palette.primary.main,
														marginRight: "8px",
													}}
												/>
											)}
											<Typography className="input-unit">bu/acre</Typography>
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
						</Box>

						<Box className="modal-form-field">
							<Box className="field-label-with-info">
								<Typography className="field-label">
									FARM TA YIELD
								</Typography>
								<Tooltip title="A pre-calculated trend adjustment is used" arrow>
									<InfoIcon className="info-icon" />
								</Tooltip>
							</Box>
							<TextField
								value={formData.farmTaYield}
								fullWidth
								placeholder="xx.xx"
								disabled
								variant="standard"
								InputProps={{
									disableUnderline: false,
									readOnly: true,
									style: {
										cursor: "not-allowed",
									},
									endAdornment: (
										<>
											{isLoadingYields && (
												<CircularProgress
													size={16}
													style={{
														color: newEvaluatorTheme.palette.primary.main,
														marginRight: "8px",
													}}
												/>
											)}
											<Typography className="input-unit">bu/acre</Typography>
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
						</Box>

						<Box className="modal-actions">
							<Button
								onClick={handleSave}
								variant="contained"
								className="run-evaluator-button"
								style={{width: "100%", marginBottom: "1.25rem"}}
							>
								<ArrowForwardIcon className="button-icon" />
								<span
									style={{
										fontWeight: 600,
										fontSize: "0.9375rem",
										lineHeight: "1.625rem",
										marginLeft: "0.5rem"
									}}
								>
									Run Evaluator
								</span>
							</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</ThemeProvider>
	);
};

export default EditFarmInfoModal;
