import React, {Component} from "react";
import Header from './Header';
import Footer from './Footer';
import {Button, Content, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import UserEvents from './UserEvents';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWarp from "./AuthorizedWarp"
import AnalyzerWrap from "./AnalyzerWrap";

class UserPage extends Component {

	render() {
		return (
			<div>
				<Header selected='user'/>
				<AnalyzerWrap activeTab={2}/>
				<AuthorizedWarp>

						<Grid className="no-padding-grid">
							<Cell col={4}>
								<UserEvents />
							</Cell>
							<Cell col={8}>
								<ViewResultsCC />
							</Cell>
						</Grid>

				</AuthorizedWarp>
			</div>
		);
	}
}

export default UserPage;
