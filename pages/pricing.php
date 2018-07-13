
<section class="pricing-section">

	<!-- Pricing Engine Loading Stub -->
	<div class="page-loading-stub js_pricing_engine_loading_stub">
		<div>Initializing the Pricing Engine</div>
	</div>
	<!-- END : Pricing Engine Loading Stub -->

	<div class="_row hidden js_pricing_engine_content">
		<div class="container">

			<!-- Unit Filtration -->
			<section class="section-unit-search-and-organize">

				<!-- Loading Stub -->
				<div class="loading-stub js_loading_stub"></div>
				<!-- END : Loading Stub -->

				<!-- Content -->
				<div class="content js_content">

					<!-- Heading -->
					<div class="heading columns small-12 large-10 large-offset-1 xlarge-8 xlarge-offset-2">
						<div class="h1 text-center thin">Select Type of Apartment</div>
					</div>

					<!-- Selected Unit Filters (Unit Filter Bubbles) -->
					<div class="unit-filter-bubbles columns small-12 large-10 large-offset-1 xlarge-8 xlarge-offset-2">
						<span class="title label bold text-uppercase text-neutral">Filter By :</span>
						<div class="bubbles js_selected_unit_filters">
							<!-- Markup will be managed by JavaScript -->
						</div>
						<span class="empty label bold text-uppercase text-neutral visuallyhidden">All Available Apartments</span>
					</div>

					<!-- Unit Classification -->
					<div class="unit-filter columns small-12 large-10 large-offset-1 xlarge-8 xlarge-offset-2 js_unit_classification">
						<!-- Markup will be managed by JavaScript -->
					</div>

					<!-- Unit Direct Search -->
					<div class="unit-search columns small-12 medium-6 large-5 large-offset-1 xlarge-4 xlarge-offset-2">
						<form class="js_search_form">
							<label>
								<span class="visuallyhidden">Search</span>
								<input class="search-field block js_search_query" type="search" placeholder="Search by Apartment Number">
								<input class="clear js_clear_search" type="reset" val="clear">
							</label>
							<input class="search-button js_search_button" type="submit">
						</form>
					</div>

					<!-- Unit Order -->
					<div class="unit-order columns small-12 medium-6 large-5 xlarge-4 js_unit_sort_section">
						<span class="title label bold text-uppercase text-neutral">Order By :</span>
						<button class="button js_sort_by selected" data-attr="Floor Number">Floor</button>
						<button class="button js_sort_by" data-attr="Starting At">Price</button>
					</div>

				</div>
				<!-- END : Content -->

			</section>



			<!-- Unit Listing -->
			<div class="unit-list columns small-12 large-10 large-offset-1 xlarge-8 xlarge-offset-2 js_unit_listing_section">

				<!-- Loading Stub -->
				<div class="loading-stub js_loading_stub">
					<p>The units are being fetched.....</p>
				</div>
				<!-- END : Loading Stub -->

				<!-- Content -->
				<div class="content js_content hidden">
					<div class="slick js_unit_listing">
						<!-- Markup will be managed by JavaScript -->
					</div>
				</div>
				<!-- END : Content -->

			</div>



			<!-- Unit Detailed View -->
			<section class="section-unit-details-and-mods js_section_unit_details_and_mods hidden">

				<!-- Loading Stub -->
				<div class="loading-stub js_loading_stub">
					<p>Our accountants are crunching the numbers.....</p>
				</div>
				<!-- END : Loading Stub -->

				<!-- Content -->
				<div class="content js_content hidden">
					<h1 class="h3">
						<span>Unit</span>
						<span class="js_unit_number_heading"></span>
					</h1>
					<div class="container js_unit_details_and_mods">
						<!-- Markup will be managed by JavaScript -->
					</div>
				</div>
				<!-- END : Content -->

			</section>



			<!-- Unit EMI Calculator -->
			<section class="section-emi-calculator js_section_emi_calculator hidden">

				<!-- Loading Stub -->
				<div class="loading-stub js_loading_stub"></div>
				<!-- END : Loading Stub -->

				<!-- Content -->
				<div class="content js_content">
					<div class="js_section_emi_toggle">
						<h1 class="h3">Estimate Your EMI</h1>
					</div>
					<div class="container js_section_emi_main">
						<div class="input-fields">
							<div>
								<div>Down payment (in ₹)</div>
								<input class="js_down_payment" type="text" name="down-payment">
							</div>
							<div>
								<div>Loan amount</div>
								<input class="js_loan_amount" type="text" name="loan-amount">
							</div>
							<div>
								<div>Tenure</div>
								<input class="js_tenure" type="text" name="tenure">
							</div>
							<div>
								<div>Interest rate</div>
								<input class="js_interest_rate" type="text" name="interest-rate">
							</div>
						</div>
						<div class="figures">
							<div class="figure">
								<div>Estimated EMI</div>
								<div class="amt js_estimated_emi"></div>
							</div>
							<div class="figure">
								<div>Total Amount Payable</div>
								<div class="amt js_total_amount_payable"></div>
							</div>
							<div class="figure">
								<div>Principal Amount</div>
								<div class="amt js_principal_amount"></div>
							</div>
							<div class="figure">
								<div>Interest Amount</div>
								<div class="amt js_interest_amount"></div>
							</div>
						</div>
					</div>
				</div>
				<!-- END : Content -->

			</section>

		</div>
	</div>

</section>


<!-- Templates -->
<?php require __DIR__ . '/templates.hbs' ?>
