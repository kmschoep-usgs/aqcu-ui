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
			<div class='col-sm-2 col-lg-2' style='margin-top:6px;'>\
				<label for='{{fieldName}}'>{{displayName}}&nbsp;&nbsp;\
				{{#if description}}\
					<i class='fa fa-question-circle nwis-search-form-category-tip-target' title='{{description}}'></i>\
				{{/if}}\
				</label><br/>\
			</div>\
			{{/if}}\
			{{#if includeLastMonths}}\
			<div class='col-sm-3 col-lg-3'>\
				<select class='form-control vision_field_lastMonths_{{fieldName}}'>\
					<option>Last 12 months</option>\
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
			{{#if includeWaterYear}}\
			<div class='col-sm-2 col-lg-3 vision_waterYear_{{fieldName}}'>\
				<div style='float:left;margin-top:6px;'>\
					<label class='control-label'>Water Year:</label>\
				</div>\
				<div style='float:left;width:50%'>\
			    	<input type='text' class='input-sm form-control vision_field vision_field_waterYear_{{fieldName}}'/>\
				</div>\
			</div>\
			{{/if}}\
			<div class='col-sm-4 col-lg-4'>\
				<div class='input-daterange input-group input_date_{{fieldName}}' >\
				    <input type='text' class='input-sm form-control vision_field input_date_start_{{fieldName}}' name='start' />\
				    {{#if isDateRange}}\
				    <span class='input-group-addon'>to</span>\
				    <input type='text' class='input-sm form-control vision_field input_date_end_{{fieldName}}' name='end' />\
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
		this.router      = this.options.router; //NWIS Vision Router
		this.searchModel = this.options.searchModel; //NWIS search model
		this.fieldConfig = this.options.fieldConfig;
		this.renderTo    = this.options.renderTo;
		this.select2     = this.options.select2;
		this.startField  = ".input_date_start_" + this.fieldConfig.fieldName;
		this.endField    = ".input_date_end_" + this.fieldConfig.fieldName;
		
		this.filterRequired = this.options.filterRequired;
		
		// TODO this could be a method
		if (this.fieldConfig.includeLastMonths) {
			this.lastMonths  = ".vision_field_lastMonths_" + this.fieldConfig.fieldName;
			this.events["change " + this.lastMonths] = this.updateLastMonths;
			this.fieldConfig.isDateRange = true;
		}
		if (this.fieldConfig.includeWaterYear) {
			this.waterYearField = ".vision_field_waterYear_" + this.fieldConfig.fieldName;
			this.waterYearGroup = ".vision_waterYear_" + this.fieldConfig.fieldName;
			this.events["change " + this.waterYearField] = this.updateWaterYear;
			this.fieldConfig.isDateRange = true;
		}

		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
//		this.updateSelectedOption();
	},
	formatDate: function(date) {
		return $.format.date(date, "MM/dd/yyyy");
	},
	updateLastMonths: function() {
		var months = 12 - this.$(this.lastMonths).prop('selectedIndex');
		
		var date   = new Date();
		var end    = this.formatDate(date);

		date.setMonth( date.getMonth() - months );
		var start  = this.formatDate(date);
		
		this.$(this.startField).val(start);
		this.$(this.endField).val(end);
	},
	updateWaterYear: function() {
		this.$(this.waterYearGroup).removeClass("has-error");
		
		var year;
		try {
			year     = parseInt( this.$(this.waterYearField).val() );
			var date = new Date();
			
			if ( ! $.isNumeric(year) || year > date.getYear()+1900 || year < 1900) {
				throw new Error();
			}
			
			date.setDate(1);
			date.setMonth(9); // Oct 
			date.setYear(year-1);
			var start= this.formatDate(date);
			
			date.setDate(30);
			date.setMonth(8);
			date.setYear(year);
			var end  = this.formatDate(date);
			
			this.$(this.startField).val(start);
			this.$(this.endField).val(end);
		} catch (e) {
			this.$(this.waterYearGroup).addClass("has-error");
		}
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);
		
		this.$('.input_date_'+this.fieldConfig.fieldName).datepicker({
		    todayBtn: true,
		    autoclose: true,
		    todayHighlight: true
		});

	},
	/**
	 * The HTML that is generated here can be bound using Backbone stickit with the following
	 * config attributes.
	 * @returns JSON object containing a single config for this element
	 */
	getBindingConfig: function() {
		var binding = {};
		binding[this.field] = {
			observe: this.fieldConfig.fieldName
		};
		return binding;
	},
	getDisplayValue: function(value) {
		return this.$(this.startField).val()
	},
//	/**
//	 * Helper function to sync up the hidden value with the two date fields
//	 */
//	updateSelectedOption: function() {
//		var value = this.$(this.field).val();
//		this.$(this.selector).val(value);
//	},
//	/**
//	 * Helper function, when when either display values are updated, the hidden value is updated
//	 */
//	setHiddenValue: function() {
//		var oldVal = this.$(this.field).val();
//		var newVal = this.$(this.selector).val();
//		this.$(this.field).val(newVal);
//		if (oldVal !== newVal) {
//			this.$(this.field).change();
//		}
//	},
});
