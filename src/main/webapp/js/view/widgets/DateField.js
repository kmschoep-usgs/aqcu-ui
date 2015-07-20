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
				<select class='form-control'>\
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
			<div class='col-sm-2 col-lg-3'>\
				<div style='float:left;margin-top:6px;'>\
					<label>Water Year:</label>\
				</div>\
				<div style='float:left;width:50%'>\
			    	<input type='text' class='input-sm form-control vision_field input_wateryear_{{fieldName}}'/>\
				</div>\
			</div>\
			{{/if}}\
			<div class='col-sm-4 col-lg-4'>\
				<div class='input-daterange input-group input_date_{{fieldName}}' >\
				    <input type='text' class='input-sm form-control vision_field' name='start' />\
				    {{#if isDateRange}}\
				    <span class='input-group-addon'>to</span>\
				    <input type='text' class='input-sm form-control vision_field' name='end' />\
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
		this.startField  = ".vision_field_start_" + this.fieldConfig.fieldName;
		this.endField    = ".vision_field_end_" + this.fieldConfig.fieldName;


		// set default value - override available
//		if ( ! this.select2.minimumInputLength) {
//			this.select2.minimumInputLength = 3;
//		}
		
		this.filterRequired = this.options.filterRequired;
		
//		this.events["change " + this.field] = this.updateSelectedOption;
//		this.events["change " + this.selector] = this.setHiddenValue;

		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
//		this.updateSelectedOption();
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
