import React, {Component} from "react";
import Header from "./Header";
import "../styles/main.css";
import "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import Login from "./Login";
import {welcometext} from "../app.messages";


class HomePage extends Component {

	render() {

		let welcome = (<div>
			<h1 className="secondary-color">Welcome to the Farmdoc Project</h1>
			<br/>
			{welcometext.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph} <br/></p>)}
		</div>);


		let howwork =
			(<div style={{textAlign: "center"}}>
				<h1 className="secondary-color">How does the simulation work?</h1>
				<br/>
				<img src={require("../images/farmdoc-rep-image.png")} style={{borderStyle: "ridge"}}/>
				{/*<img src={require("../images/map-marker.png")} width="100%"  style={{borderStyle: "ridge"}}/>*/}
			</div>);


		return (
			<div>
				<Header selected="home"/>
				<span className="home-line"/>

				<div className="home-content"
					 style={{backgroundSize: "cover", backgroundPosition: "center"}}
				>
					{window.innerWidth > 1300 ?
						<Grid>
							<Cell col={4}>

								{welcome}
							</Cell>
							<Cell col={4}>
								{howwork}
							</Cell>
							<Cell col={4}>
								<Login message={this.props.message}/>
							</Cell>
						</Grid> :
						<Grid>
							<Cell col={6}>
								{welcome}
								<br/>
								{howwork}
							</Cell>
							<Cell col={6}>
								<Login message={this.props.message}/>
							</Cell>
						</Grid>}
				</div>
			</div>
		);


	}
}

export default HomePage;
