/**
 * Backbone view to encapsulate the text field widget
 */
AQCU.view.DateField = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
		<div class='nwis-field-container form-inline'>\
			{{#if displayName}}\
			<div class='col-sm-2 col-lg-2'>\
				<h5><label for='{{fieldName}}'>{{displayName}}&nbsp;</label>\
				{{#if description}}\
					<i class='fa fa-question-circle nwis-search-form-category-tip-target' title='{{description}}'></i>\
				{{/if}}\
			</div>\
			{{/if}}\
			{{#if includeWaterYear}}\
			<div class='col-sm-2 col-lg-3 vision_waterYear_{{fieldName}}'>\
				<div style='float:left;margin-top:6px;'>\
					<label class='control-label'>Water Year:</label>\
				</div>\
				<div style='float:left;width:50%'>\
			    	<input type='text' class='input-sm form-control vision_field vision_field_waterYear_{{fieldName}}' maxlength='4'/>\
				</div>\
			</div>\
			{{/if}}\
			{{#if includeLastMonths}}\
			<div class='col-sm-3 col-lg-3'>\
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
			<div class='col-sm-4 col-lg-4'>\
				<div class='input-daterange input-group input_date_{{fieldName}}' >\
				    <input type='text' class='input-sm form-control vision_field input_date_start_{{fieldName}}' name='start_{{fieldName}}' />\
				    {{#if isDateRange}}\
				    <span class='input-group-addon'>to</span>\
				    <input type='text' class='input-sm form-control vision_field input_date_end_{{fieldName}}' name='end_{{fieldName}}' />\
				    {{/if}}\
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
	initialize: function() {
		this.model       = this.options.model || this.options.searchModel; // stickit requires model not searchModel
		this.fieldConfig = this.options.fieldConfig;
		this.renderTo    = this.options.renderTo;
		
		this.waterYearMin= this.options.waterYearMin       ?this.options.waterYearMin       :1900;
		this.startDate   = this.options.startDateFieldName ?this.options.startDateFieldName :"startDate";
		this.endDate     = this.options.endDateFieldName   ?this.options.endDateFieldName   :"endDate";
		this.dateFormat  = this.options.format             ?this.options.format             :"mm/dd/yyyy";
		
		this.dateGroup   = ".input_date_" + this.fieldConfig.fieldName;
		this.startField  = ".input_date_start_" + this.fieldConfig.fieldName;
		this.endField    = ".input_date_end_" + this.fieldConfig.fieldName;
		this.hiddenField = ".vision_field_" + this.fieldConfig.fieldName;
		
		this.bindings = {}; // TODO can binding be dynamic like this?
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
		this.stickit();
		
		if (this.fieldConfig.includeLastMonths) {
			// TODO in order for this to work the change events above must be processed - for now call direct work around
			//this.$(this.lastMonthsField).change();
			var view = this;
			setTimeout(function() {
				view.updateLastMonths();
			},500);
		}
	},
	setDates: function(start, end) {
		this.$(this.startField).datepicker('setDate', start);
		this.$(this.endField  ).datepicker('setDate',   end);
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

		var end    = new Date();
		var end    = new Date(end.getYear()+1900, end.getMonth(), end.getDate());
		var start  = new Date(end.getYear()+1900, end.getMonth(), end.getDate());
		start.setMonth( start.getMonth() - months );
		
		this.setDates(start, end);
		this.clearFields(this.lastMonthsField);
	},
	updateWaterYear: function() {
		this.$(this.waterYearGroup).removeClass("has-error");
		
		var year;
		try {
			year     = parseInt( this.$(this.waterYearField).val() );
			var date = new Date();
			
			if ( ! $.isNumeric(year) || year > date.getYear()+1900 || year < this.waterYearMin) {
				throw new Error();
			}
			
			var start = new Date(year-1, 9,  1);
			var end   = new Date(year,   8, 30);
			
			this.setDates(start,end);
			this.clearFields(this.waterYearField);
		} catch (e) {
			this.$(this.waterYearGroup).addClass("has-error");
		}
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);
		
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
