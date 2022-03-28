import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import Inputs from "./Inputs";
import IntegratedToolResults from "./IntegratedToolResults";


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
					<div style={{display: "block"}}>
						<div style={{display: "none"}}>
							<Inputs/>

							<div style={{textAlign: "center"}}>
								<Button variant="outlined" size="medium" onClick={() => setDisplay("block")}
								        style={{marginTop: "4px", backgroundColor: "#455A64", color: "white"}}>
									<Icon className={classes.leftIcon} style={{fontSize: "0.85rem"}}> send </Icon>
									Run
								</Button>
							</div>
						</div>

						<br/>
						<div style={{marginLeft: "100px"}}>
							<IntegratedToolResults/>
						</div>

					</div>


				</div>

			</AuthorizedWrap>
		</Layout>
	);
};

export default IntegratedTool;
