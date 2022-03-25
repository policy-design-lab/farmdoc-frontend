import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import Inputs from "./Inputs";


const useStyles = makeStyles((theme) => ({
	leftIcon: {
		marginRight: theme.spacing(1),
	},
}));


const IntegratedTool = () => {

	const classes = useStyles();
	let history = useHistory();

	const [display, setDisplay] = useState("none");

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
							Integrated Tool
					</div>
					<div>
						<Inputs/>
						<br/>
						<div style={{textAlign: "center"}}>
							<Button variant="outlined" size="medium" onClick={() => setDisplay("block")}
								        style={{marginTop: "4px", backgroundColor: "#455A64", color: "white"}}>
								<Icon className={classes.leftIcon} style={{fontSize: "0.85rem"}}> send </Icon>
									Run
							</Button>
						</div>

						<div style={{display: display}}>
							{/*<EvaluatorRiskGraph integrated={true}*/}
							{/*                    graphInfo={[{"revenue": "175.627", "no-ins": 0.0001, "yp-85": 0}, {"revenue": "192.713", "no-ins": 0.0002, "yp-85": 0}, {"revenue": "209.800", "no-ins": 0.0002, "yp-85": 0}, {"revenue": "226.886", "no-ins": 0.0002, "yp-85": 0}, {"revenue": "243.973", "no-ins": 0.0004, "yp-85": 0}, {"revenue": "261.059", "no-ins": 0.0006, "yp-85": 0}, {"revenue": "278.146", "no-ins": 0.0008, "yp-85": 0}, {"revenue": "295.232", "no-ins": 0.0012, "yp-85": 0}, {"revenue": "312.319", "no-ins": 0.0016, "yp-85": 0}, {"revenue": "329.405", "no-ins": 0.002, "yp-85": 0}, {"revenue": "346.492", "no-ins": 0.002801, "yp-85": 0}, {"revenue": "363.578", "no-ins": 0.003401, "yp-85": 0}, {"revenue": "380.665", "no-ins": 0.004801, "yp-85": 0}, {"revenue": "397.752", "no-ins": 0.005001, "yp-85": 0}, {"revenue": "414.838", "no-ins": 0.006601, "yp-85": 0}, {"revenue": "431.925", "no-ins": 0.007401, "yp-85": 0}, {"revenue": "534.444", "no-ins": 0.026205, "yp-85": 0}, {"revenue": "551.530", "no-ins": 0.030806, "yp-85": 0}, {"revenue": "568.617", "no-ins": 0.036407, "yp-85": 0}, {"revenue": "585.703", "no-ins": 0.043609, "yp-85": 0}, {"revenue": "619.876", "no-ins": 0.060812, "yp-85": 0}, {"revenue": "636.963", "no-ins": 0.070014, "yp-85": 0}, {"revenue": "654.049", "no-ins": 0.080616, "yp-85": 0}, {"revenue": "671.136", "no-ins": 0.093019, "yp-85": 0}, {"revenue": "688.222", "no-ins": 0.10202, "yp-85": 0}, {"revenue": "705.309", "no-ins": 0.115823, "yp-85": 0}, {"revenue": "722.395", "no-ins": 0.131026, "yp-85": 0}, {"revenue": "739.482", "no-ins": 0.14803, "yp-85": 0.001}, {"revenue": "756.569", "no-ins": 0.164033, "yp-85": 0.010802}, {"revenue": "773.655", "no-ins": 0.182837, "yp-85": 0.032607}, {"revenue": "790.742", "no-ins": 0.20224, "yp-85": 0.074015}, {"revenue": "807.828", "no-ins": 0.223845, "yp-85": 0.126825}, {"revenue": "824.915", "no-ins": 0.24765, "yp-85": 0.183037}, {"revenue": "842.001", "no-ins": 0.270054, "yp-85": 0.236847}, {"revenue": "859.088", "no-ins": 0.296059, "yp-85": 0.284257}, {"revenue": "876.174", "no-ins": 0.323865, "yp-85": 0.318864}, {"revenue": "893.261", "no-ins": 0.347269, "yp-85": 0.345869}, {"revenue": "910.347", "no-ins": 0.376075, "yp-85": 0.375875}, {"revenue": "927.434", "no-ins": 0.407281, "yp-85": 0.407281}, {"revenue": "944.520", "no-ins": 0.437087, "yp-85": 0.437087}, {"revenue": "961.607", "no-ins": 0.469694, "yp-85": 0.469694}, {"revenue": "978.693", "no-ins": 0.503901, "yp-85": 0.503901}, {"revenue": "995.780", "no-ins": 0.536307, "yp-85": 0.536307}, {"revenue": "1012.866", "no-ins": 0.571114, "yp-85": 0.571114}, {"revenue": "1029.953", "no-ins": 0.60012, "yp-85": 0.60012}]}/>*/}

						</div>


					</div>
				</div>

			</AuthorizedWrap>
		</Layout>
	);
};

export default IntegratedTool;
