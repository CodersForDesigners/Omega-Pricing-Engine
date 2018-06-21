
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

# URLs
Accounts – seyonii.com/accounts/
Users – seyonii.com/users/


# architecture
## the spreadheet
The spreadsheet is the source of all the data.
It guides the UI of the pricing engine.
