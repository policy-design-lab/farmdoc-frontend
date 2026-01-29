import {createTheme} from "@material-ui/core/styles";

const newEvaluatorTheme = createTheme({
	palette: {
		primary: {
			main: "#455a64",
			dark: "#37474f",
		},
		secondary: {
			main: "#ffa500",
		},
		text: {
			primary: "#29363c",
			secondary: "#586b74",
			tertiary: "#8f9ca2",
			disabled: "#757575"
		},
		background: {
			default: "#ffffff",
			paper: "#ffffff",
			mild: "#f8f9fa",
		},
		divider: "#e0e0e0",
		stroke: {
			mild: "#dadee0",
		},
		icon: {
			active: "#8f9ca2",
		},
	},
	typography: {
		fontFamily: "\"Open Sans\", sans-serif",
		sectionTitle: {
			color: "#29363c",
			fontFeatureSettings: "\"liga\" off, \"clig\" off",
			fontFamily: "\"Open Sans\", sans-serif",
			fontSize: 16,
			fontStyle: "normal",
			fontWeight: 500,
			marginBottom: 16,
		},
		fieldLabel: {
			color: "#586b74",
			fontFeatureSettings: "\"liga\" off, \"clig\" off",
			fontFamily: "\"Open Sans\", sans-serif",
			fontSize: 12,
			fontStyle: "normal",
			fontWeight: 400,
			textTransform: "uppercase",
		},
		resultsTitle: {
			color: "#29363c",
			fontFeatureSettings: "\"liga\" off, \"clig\" off",
			fontFamily: "\"Open Sans\", sans-serif",
			fontSize: 24,
			fontStyle: "normal",
			fontWeight: 400,
			lineHeight: "133.4%",
			letterSpacing: "1px",
		},
		dashboardTitle: {
			color: "#29363c",
			fontFeatureSettings: "\"liga\" off, \"clig\" off",
			fontFamily: "\"Open Sans\", sans-serif",
			fontSize: 24,
			fontStyle: "normal",
			fontWeight: 400,
			lineHeight: "133.4%",
			letterSpacing: "1px",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
				containedPrimary: {
					backgroundColor: "#455a64",
					color: "#ffffff",
					"&:hover": {
						backgroundColor: "#37474f",
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					"& fieldset": {
						borderColor: "#dadee0",
					},
					"&:hover fieldset": {
						borderColor: "#455a64",
					},
					"&.Mui-focused fieldset": {
						borderColor: "#455a64",
					},
				},
				input: {
					fontSize: 14,
					padding: "10px 12px",
					color: "#29363c",
				},
			},
		},
	},
});

export default newEvaluatorTheme;
