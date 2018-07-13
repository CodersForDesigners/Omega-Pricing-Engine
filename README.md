
# events
Following are the custom events.

## pricing engine
spreadsheet.fetch
	When the pricing engine spreadsheet has to be fetched

spreadsheet.load
	When the pricing engine spreadsheet has been loaded

unit-filter.add
	When a unit filter is added

unit-filter.remove
	When a unit filter is removed

unit.view
	When a unit is to be viewed

## user
user.login.show
	When a login prompt has to be shown

user.authenticate
	When a user's credentials have been provided and now it has to be authenticated

user.authenticated
	When a user's credentials have been authenticated and are legit

user.details.fetch
	When a user's details have to be fetched

user.details.received
	When a user's details has been received

## ui
pricing-engine.render
	When the pricing engine is to be rendered

unit-filtration.render
	When the unit search UI is to be rendered

unit-details.render
	When the Unit Details UI is to be rendered

# todo
[ ] add arbitrary sections headings
[ ] add image type data
[ ] add horizontal rows – solid, dashed
[ ] images for mods


[ ] Show images in the unit details view.
[ ] Build the EMI component.
[ ] Figure out a modification taxonomy.
[ ] Sending of the enquiry.
[ ] Enquiry processing on the server.
[ ] Figure out formatting of values.

# later
Loading indicator for when the unit search UI is being rendered on the server.
Figure out adding of sub-headings and horizontal rules in the unit details view.
Figure out if a modification can be embedded along with a detail or be separate.

# done
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
