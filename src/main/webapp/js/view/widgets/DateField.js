/**
 * Backbone view to encapsulate the text field widget
 */
AQCU.view.DateField = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
		<div class='nwis-field-container form-inline' style='padding-bottom:1em;'>\
			<div class='date-range-container-top'>\
				<div>\
					{{#if displayName}}\
					<div class='header-container col-sm-2 col-md-12 col-lg-12'>\
						<h5><label for='{{fieldName}}'>{{displayName}}&nbsp;</label>\
						{{#if description}}\
							<i class='fa fa-question-circle nwis-search-form-category-tip-target' title='{{description}}'></i>\
						{{/if}}\
					</div>\
				</div>\
			</div>\
			<div class='date-range-container-bottom'>\
				<div>\
					{{/if}}\
					{{#if includeWaterYear}}\
					<div class='col-sm-2 col-md-3 col-lg-3 vision_waterYear_{{fieldName}}'>\
						<div style='float:left;margin-top:6px;'>\
							<label class='control-label'>Water Year:</label>\
						</div>\
						<div style='float:left;width:50%'>\
							<input type='text' class='input-sm form-control vision_field vision_field_waterYear_{{fieldName}}' maxlength='4'/>\
						</div>\
					</div>\
					{{/if}}\
					{{#if includeLastMonths}}\
					<div class='col-sm-4 col-md-4 col-lg-4'>\
						<select class='form-control vision_field_lastMonths_{{fieldName}}'>\
							<option value='none'>Select Recent Months</option>\
							<option selected='true'>Last 12 months</option>\
							<option>Last 11 months</option>\
							<option>Last 10 months</option>\
							<option>Last  9 months</option>\
							<option>Last  8 months</option>\
							<option>Last  7 months</option>\
							<option>Last  6 months</option>\
							<option>Last  5 months</option>\
							<option>Last  4 months</option>\
							<option>Last  3 months</option>\
							<option>Last  2 months</option>\
							<option>Last month</option>\
						</select>\
					</div>\
					{{/if}}\
					<div class='col-sm-4 col-md-4 col-lg-4'>\
						<div class='input-daterange input-group input_date_{{fieldName}}' >\
							<input type='text' class='input-sm form-control vision_field input_date_start_{{fieldName}}' name='start_{{fieldName}}' />\
							{{#if isDateRange}}\
							<span class='input-group-addon'>to</span>\
							<input type='text' class='input-sm form-control vision_field input_date_end_{{fieldName}}' name='end_{{fieldName}}' />\
							{{/if}}\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
	},
	/**
	 * Will create and render a text field using a fieldConfig options defined in NWIS Search Models.
	 */
	initialize: function(options) {
		this.options = options
		this.fieldConfig = this.options.fieldConfig;
		
		// stickit requires model rather than searchModel which included for backward compatibility
		this.model       = this.options.model              ?this.options.model              :this.options.searchModel;
		this.waterYearMin= this.options.waterYearMin       ?this.options.waterYearMin       :1900;
		this.startDate   = this.options.startDateFieldName ?this.options.startDateFieldName :"startDate";
		this.endDate     = this.options.endDateFieldName   ?this.options.endDateFieldName   :"endDate";
		this.dateFormat  = this.options.format             ?this.options.format             :"yyyy-mm-dd";
		
		this.dateGroup   = ".input_date_"       + this.fieldConfig.fieldName;
		this.startField  = ".input_date_start_" + this.fieldConfig.fieldName;
		this.endField    = ".input_date_end_"   + this.fieldConfig.fieldName;
		this.hiddenField = ".vision_field_"     + this.fieldConfig.fieldName;
		
		this.bindings = {}; // dynamic binding
		this.bindings[this.startField] = this.startDate;
		this.bindings[this.endField]   = this.endDate;
		
		// helper function to capitalize the first letter of a string
		var firstCap = function(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
		// helper function that creates field reference names and change listeners for date helper fields
		var listener = function(view, field, method) {
			// first check if the user wants this date fast edit field
			if (view.fieldConfig["include"+firstCap(field)]) {
				// create field reference values or the fast date field
				view[field+"Field"] = ".vision_field_"+ field +"_"+ view.fieldConfig.fieldName;
				view[field+"Group"] = ".vision_"+ field +"_"+ view.fieldConfig.fieldName;
				// listen for changes on that field
				view.events["change " + view[field+"Field"]] = method;
				view.fieldConfig.isDateRange = true;
			}
		}
		listener(this, "lastMonths", this.updateLastMonths);
		listener(this, "waterYear", this.updateWaterYear); // TODO decide if change is enough or if we should process on keyup

		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
		
		if (this.fieldConfig.includeLastMonths) {
			// TODO in order for this to work the change events above must be processed - for now call direct work around
			//this.$(this.lastMonthsField).change();
			this.updateLastMonths();
		}
	},
	setDates: function(start, end) {
		this.$(this.startField).datepicker('setDate', start);
		if (this.fieldConfig.isDateRange && end) {
			this.$(this.endField  ).datepicker('setDate',   end);
		}
	},
	getDates: function() {
		var dates = [this.$(this.startField).val()];
		if (dates.length == 10 && this.fieldConfig.isDateRange) {
			dates.push(this.$(this.endField).val());
		}
		return dates;
	},
	formatDate: function(date) {
		// TODO note that jquery-dateFormat and bootstrap-datepicker are not aligned on MM vs mm for 01 month 
		return $.format.date(date, this.dateFormat);
	},
	updateLastMonths: function() {
		var months = 13 - this.$(this.lastMonthsField).prop('selectedIndex');

		var current = new Date();
		var start   = new Date(current.getYear()+1900, current.getMonth()-months, current.getDate());
		this.setDates(start, current);
		
		this.clearFields(this.lastMonthsField);  // clear date fields other than this one
	},
	updateWaterYear: function() {
		// reset field to have no error status
		this.$(this.waterYearGroup).removeClass("has-error");
		
		try {
			var givenYear   = parseInt( this.$(this.waterYearField).val() );
			var currentYear = new Date().getYear()+1900;
			
			if ( ! $.isNumeric(givenYear) || givenYear > currentYear || givenYear < this.waterYearMin) {
				throw new Error(); // trigger error status class
			}
			
			var start = new Date(givenYear-1, 9,  1);
			var end   = new Date(givenYear,   8, 30);
			this.setDates(start, end);
			
			this.clearFields(this.waterYearField); // clear date fields other than this one
			
		} catch (e) {
			// color the field with the error status class
			this.$(this.waterYearGroup).addClass("has-error");
		}
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.html(newDom);
		
		this.$(this.dateGroup).datepicker({
		    todayBtn      : true,
		    autoclose     : true,
		    todayHighlight: true,
		    format        : this.dateFormat,
		});
		
		var view = this;
		this.$(this.dateGroup).datepicker()
		    .on("hide", function(e) {
				view.clearFields();
		    });
		this.stickit();
	},
	clearFields: function(exclude) {
		if (exclude !== this.waterYearField) {
			this.$(this.waterYearField).val("");
		}
		if (exclude !== this.lastMonthsField) {
			this.$(this.lastMonthsField).val('none');
		}
		
	}
});
