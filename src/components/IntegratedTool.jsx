import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Inputs from "./Inputs";
import IntegratedToolResults from "./IntegratedToolResults";
import resJson from "./tool.json";

const useStyles = makeStyles((theme) => ({
	leftIcon: {
		marginRight: theme.spacing(1),
	},
}));


const IntegratedTool = () => {

	const classes = useStyles();

	const [inputDisplay, setInputDisplay] = useState("block");
	const [outputDisplay, setOutputDisplay] = useState("none");

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
					<div style={{display: "block"}}>
						<div style={{display: inputDisplay}}>
							<Inputs/>

							<div style={{textAlign: "center"}}>
								<Button variant="outlined" size="medium" onClick={() => {
									setOutputDisplay("block"); setInputDisplay("none");
								}}
								        style={{marginTop: "4px", backgroundColor: "#455A64", color: "white"}}>
									<Icon className={classes.leftIcon} style={{fontSize: "0.85rem"}}> send </Icon>
									Run
								</Button>
							</div>
						</div>

						<br/>
						<div style={{marginLeft: "100px", display: outputDisplay}}>
							<a style={{color: "Blue", cursor: "pointer", fontWeight: "600", display: (inputDisplay === "none") ? "block" : "none"}}
							onClick={() => setInputDisplay("block")}>
								<u> Back to Edit Farm Inputs </u>
							</a>
							<IntegratedToolResults results={resJson}/>

						</div>

					</div>

				</div>

			</AuthorizedWrap>
		</Layout>
	);
};

export default IntegratedTool;
