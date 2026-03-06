import React from "react";
import {Box, Typography} from "@material-ui/core";
import "../../styles/new-evaluator.scss";

const CountyAddOnSlider = ({label, options, value, onChange, mode = "result"}) => {
	const handleSliderChange = (newValue) => {
		if (onChange) {
			onChange(newValue);
		}
	};
	const isSliderStyle = options.length > 0;
	const isSCO = label && label.toLowerCase().includes("supplemental");

	if (!isSliderStyle) {
		const isOn = value === "on" || value === true;
		const allOptions = isSCO ? ["On", "Off"] : ["Off", "On"];
		return (
			<Box className="addon-row-wrapper">
				<Box className={mode === "compare" ? "addon-info-row" : "addon-row"}>
					<Typography className={mode === "compare" ? "addon-label" : "addon-label"}>
						{label}
					</Typography>
					<Box className="county-addon-pill-container">
						{allOptions.map((option) => {
							const optionValue = option.toLowerCase() === "on";
							const isActive = isOn === optionValue;
							return (
								<Box
									key={option}
									className={`pill-option ${isActive ? "active" : ""}`}
									onClick={() => handleSliderChange(optionValue)}
								>
									<Typography className="pill-option-text">
										{option}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Box>
			</Box>
		);
	}
	const allOptions = [...options, "Off"];
	const normalizeValue = (val) => {
		const str = String(val).toLowerCase().replace("%", "");
		return str;
	};
	const currentIndex = allOptions.findIndex((opt) => normalizeValue(opt) === normalizeValue(value));
	const validIndex = currentIndex >= 0 ? currentIndex : allOptions.length - 1;
	return (
		<Box className="addon-row-wrapper">
			<Box className={mode === "compare" ? "addon-info-row" : "addon-row"}>
				<Typography className={mode === "compare" ? "addon-label" : "addon-label"}>
					{label}
				</Typography>
				<Box className="county-addon-pill-container">
					{allOptions.map((option, index) => {
						const isActive = index === validIndex;
						const clickValue = option === "Off" ? "off" : option.replace("%", "");
						return (
							<Box
								key={option}
								className={`pill-option ${isActive ? "active" : ""}`}
								onClick={() => handleSliderChange(clickValue)}
							>
								<Typography className="pill-option-text">
									{option}
								</Typography>
							</Box>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
};

export default CountyAddOnSlider;
