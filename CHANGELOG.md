# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

 ## [1.0.0-alpha.0] - 2019-08-06

### Added
- Try it Out button for users who do not have famrdoc user accounts
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
