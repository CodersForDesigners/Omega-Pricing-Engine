
# Setup and Installation
Install these PHP extensions,
apt-get install php7.0-mbstring
apt-get install php7.0-gd
apt-get install php7.0-xml
apt-get install php7.0-zip
apt-get install php7.0-curl

## Google Chrome
https://askubuntu.com/questions/510056/how-to-install-google-chrome#510186


# Launching the app
## nodeJS
When deploying a node app, we use PM2 as a process manager.
Go to the directory where the entry-point file of the app resides,
	NODE_ENV=production pm2 start index.js --name="enquiry processor" -i 1 --wait-ready --kill-timeout 15000

You change `index.js` and `enquiry_processor` for your use case.






# events
Following are the custom events.

## pricing engine
spreadsheet/fetch
	When the pricing engine spreadsheet has to be fetched

spreadsheet/load
	When the pricing engine spreadsheet has been loaded

unit-filter/add
	When a unit filter is added

unit-filter/remove
	When a unit filter is removed

unit/view
	When a unit is to be viewed

## user
user/login/prompt
	Prompt the user to "log in", contextual to the trigger

user/logged-in

## ui
pricing-engine/render
	When the pricing engine is to be rendered

unit-filtration/render
	When the unit search UI is to be rendered

unit-details/render
	When the Unit Details UI is to be rendered

# todo
[ ] Figure out a better to deal with URL-fetching when Apache and htaccess are involved. For example, fetching the spreadsheet via AJAX breaks.
[ ] URLs are hardcoded in several places. Find a way to propagate it throughout
	- pdf-create/index.js
	- enquiry-processor.js
	- quote-processor.js
[ ] Figure out how to have (contextual) data independent of the spreadsheet and load it on the page. It's required to get data for existing users.
[ ] Comprehensive logging and e-mailing of errors
[ ] Interface-driven Mechanisms to re-start failed enquiries
[ ] 404 page
[ ] Unit Ordering – random, ascending, descending

[ ] add arbitrary sections headings
[ ] add image type data
[ ] add horizontal rows – solid, dashed
[ ] Expose line item based on User Role
[ ] images for mods

## bugs
[ ] The login prompt's onLogin function break when a user has no name.
[ ] An individual unit that **is not** available ( or blocked ) can be viewed by simply changing the URL to match that unit number.

## later
[ ] Date-based formulae in a spreadsheet

## done
[x] Render the unit details view.
[x] Figure out the ordering of details in the unit details view.


# ?
The high-level event logic is decoupled from the markup structure
Event naming convention
Determining the user logged in – guest, executive, manager, admin, etc.
How will a user sign out?
Build the apartment type selector.
Switch to new Zoho API?
Workbook async fetching cache busting
Unit modifications
	default values at a per unit level

pricing-engine/lib.js
	sort out "getComputedApartmentDetails", getUnitView" and "calculateEMI" functions

# URLs
Accounts – seyonii.com/accounts/
Users – seyonii.com/users/


# architecture
## the spreadsheet
The spreadsheet is the source of all the data.
It guides the UI of the pricing engine.

# UI
## Modifications
### What is it?
It is a form field.
It comprises of a label and and input field.
The input field is either a checkbox (binary), a select box (multiple), or a number input ( within a certain range ).
Toggling it or selecting or inputting a value to it corresponds to a value.
It should have a default value.
This value then participates with the calculations.
It's visibility depends on whether,
	1. It is applicable for that unit.
	2. User permissions assigned to it.

## Behaviour
On changing the value of a modification,
1. The calculations are triggered again.
2. The affected values are then re-rendered in the UI.


### questions
What if the values depend on a per unit level?
	What if the minimum and maximum values also depend on a per unit level?
Should all the calculations be triggered or just the ones that rely on the modification?
Should the UI be re-rendered or just the places that change?


### fields
Following are the fields are describe a modification.

Name
Label
Scope
	global
	unit-level
Input type
	binary
	multiple
	manual
Options
	( for the `binary` and `multiple` input types )
		<presentational> = <internal>
		<presentational> = <internal>
Default value
Minimum value
	( for the `manual` input type )
Maximum value
	( for the `manual` input type )





# Developing
## PDF templates
Make sure to include these CSS properties to ensure any color in your template is captured in the PDF,

```CSS

-webkit-print-color-adjust: exact;
color-adjust: exact;

```

