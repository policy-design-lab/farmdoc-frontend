import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/main.css'
import {Cell, Grid, Title, Textfield, Card, CardHeader, CardMedia, CardTitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";

class AboutPage extends Component {

	render() {
		return (
			<div>
				<Header selected='about'/>
				<div className="contentcenter">
						<p>This is a prototype of Farm Doc using React,
						Redux, and react-mdc-web.
						</p>
						<br/>
						<p>For the current version, please see
						the <a href="https://opensource.ncsa.illinois.edu/confluence/display/FD/Farm+Doc+Project">
						Farm Doc Wiki</a>.
						</p>
					</div>
				<Footer selected='about'/>
			</div>
		);
	}
}

export default AboutPage;
