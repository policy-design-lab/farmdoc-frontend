# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2020-08-28
### Added
- Initial layout for price distribution frontend and related routes [FD-300](https://opensource.ncsa.illinois.edu/jira/browse/FD-300)
- Create interface elements [FD-302](https://opensource.ncsa.illinois.edu/jira/browse/FD-302)
- Populate graphs and tableswith test data [FD-303](https://opensource.ncsa.illinois.edu/jira/browse/FD-303)
- Implement calls to DW [FD-304](https://opensource.ncsa.illinois.edu/jira/browse/FD-304)
- Improve grapg format and layout [FD-313](https://opensource.ncsa.illinois.edu/jira/browse/FD-313)
- Improve pull down menus based on the crop months [FD-315](https://opensource.ncsa.illinois.edu/jira/browse/FD-315)

## [1.3.0] - 2020-06-12
### Changed
- Horizontal user details bar in the Header replaced with 'User Account' Icon with dropdown menu [FD-229](https://opensource.ncsa.illinois.edu/jira/browse/FD-229)
- States, Counties, Crops, Yields and Forecast prices are now fetched from the latest apis that use app specific schemas [FD-271](https://opensource.ncsa.illinois.edu/jira/browse/FD-271)
- Included COVID Forecast models and updated model definitions in documentation

## [1.2.1] - 2020-03-03
### Added
- RMA price freeze text to all tabs of Evaluator

### Changed
- Show all risk graphs' values on mouse hover, instead of just one
- Minor formatting updates to Evaluator tables

## [1.2.0] - 2020-02-28
### Added
- Insurance Evaluator tool

### Changed
- Landing Page to show Insurance Evaluator card
- Minor text and CSS changes to Premium Calculator


## [1.1.1] - 2020-02-26
### Added
- Disclaimer text about 2019 NASS yields

### Changed
- Forecast prices for all crops


## [1.1.0] - 2020-02-13

### Added
- New tool that calculates crop insurance premiums along with related 'Docs' and 'About' pages

### Changed
- Landing Page to show cards to switch between applications
- Updated text and images to indicate that the application now have two tools instead of just "payment calculator"


 ## [1.0.1] - 2020-01-27

### Changed
- Removed the beta pre-release popup message that was being displayed for first time visitors.

 ## [1.0.0] - 2020-01-15

### Added
- "Need Help?" section with FAQs
- Text on Landing page to check Spam folder for emails
- Show average yield in tooltip for the selected county

### Changed
- Updated Forecast model prices for all crops as of Jan 2020 data

 ## [1.0.0-beta.0] - 2019-10-31

### Added
- Added keycloak for user authentication and used it's token for all API calls
- Selection to choose irrigated or non-irrigated practice types, when applicable
- Implemented auto logout after keycloak token expires

### Changed
- Removed existing Login and Register pages that were using Datawolf
- Removed 'Try it Out' button for alpha users and added text on home page to register for an account
- Updated workflow ids to work with the new model that gets inputs from postgres database
- Index page's title and meta tags are updated with the tool specific content.

 ## [1.0.0-alpha.0] - 2019-08-06

### Added
- 'Try it Out' button for users who do not have famrdoc user accounts
- Documentation page with term definitions
- Footer section with logos

### Changed
- Updated the layout and merged both the headers
- Minor enhancements to ensure content fits well on smaller screens

## [0.3.0] - 2019-05-21

### Added
- Searchable dropdowns for State, County, Crop and Model fields
- ARC Trend Yield input text field
- Forecast Model selection and popup to show Forecast Model prices per crop
- ARC and PLC payout comparision through binned histograms with option to hide/show zero payouts
- Tooltips explaining the fields and results
- Feedback message included when the user chooses a county that has irrigated and/or non-irrigated fields
- Alert message if using Internet Explorer

### Changed
- Landing page text
- Separated Program Parameters into a read-only section
- Updated spacings, borders and colors to render well in smaller screens and while projecting.
- Removed unused dependencies and updated some package to fix the audit errors

## [0.2.0] - 2018-12-10

### Added
- Provided State and County selections to run the model
- Support for Soybeans and Wheat, in addition to Corn

### Changed
- Look and feel of landing page and home pages. Appropriate Header and images are included
- Merged model selections form and the results page to a single page
- Display 5 years of data instead of 10, reformatted charts and table so they are side by side

### Fixed
- Fixed the issue seen on slower connections by handling 'Queued' status of DataWolf
- Resolved issue where home page sections were overlapping on smaller screens

## [0.1.0] - 2018-09-14

### Added
- Farmer centric form to run the ARC and PLC payments simulation for corn
- Ability to enter a FIPS county id
- Display the comparision bar graphs and output data in tabular format
- Ability to login through DataWolf credentials
- Initial setup of the needed packages and dependencies.
