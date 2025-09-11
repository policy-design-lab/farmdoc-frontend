# Farmdoc


A web-based analysis tool to assist farmers, academics and policymakers 
with understanding programs and policies surrounding the farm bill

**farmdoc** is a React module that renders the front end of the Farmdoc dashboard,
exchange calls and data with the model backend. 

# Installation

1. Check that required JavaScript package manager `npm` and `Node.js` package 
are successfully installed on your computer

    `npm -v` and 
    `node -v`
    
	Recommended versions to be used are: Node.js 22.x+

2. If not download `Node.js` package from, for example 
[nodejs.org](https://nodejs.org/en/) and install it on your system. 
Package manager `npm` is distributed with `Node.js` and it is automatically 
installed on your computer.

3. Clone the code from Farmdoc [git](https://opensource.ncsa.illinois.edu/bitbucket/scm/fd/farmdoc.git) 
repository.

4. In the Project window terminal run 

	`npm install`

	**Note** The project has been updated to use modern `sass` instead of `node-sass`, 
	eliminating Python dependencies. Now the project is fully compatible with Python 3.
	
	If you encounter peer dependency conflicts, you may need to use `npm install --legacy-peer-deps`.
	
# Running

1. In the Project window terminal run 

	`npm start`

2. The dashboard should open locally at 

	`http://localhost:3000/`
	
3. Follow the **login** instructions (using your `Datawolf` credentials)

# Testing

### `npm run test`

Launches the test runner in the interactive watch mode.

# Building & Deploying

### `npm run build`

Builds the app for production to the `build` folder.\
It bundles React in production mode and optimizes the build for the best performance.

Copy the build folder to a web server to run the app


# Docker Build

###  `docker build --no-cache --build-arg REACT_APP_ENV=development --progress=plain --tag farmdoc/frontend .`

REACT_APP_ENV can be localhost, development or production

# Docker Run

### `docker run -p 3000:80 farmdoc/frontend:latest`

This should run the application on `http://localhost:3000/`
