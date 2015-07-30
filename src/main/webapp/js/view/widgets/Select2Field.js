/**
 * Backbone view to encapsulate the text field widget
 */
AQCU.view.Select2Field = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
			<div class='row nwis-field-container'>\
				{{#if displayName}}\
				<div class='col-sm-5 col-md-5 col-lg-5'>\
					<label for='{{fieldName}}'>{{displayName}}&nbsp;&nbsp;\
					{{#if description}}\
						<i class='fa fa-question-circle nwis-search-form-category-tip-target' title='{{description}}'></i>\
					{{/if}}\
					</label><br/>\
				</div>\
				{{/if}}\
				<input type='hidden' name='{{fieldName}}' class='vision_field vision_field_{{fieldName}}'/> \
				<div class='{{#if displayName}}col-sm-7 col-md-7 col-lg-7{{else}}col-sm-12 col-md-12 col-lg-12{{/if}}'>\
					<select class='vision_field vision_select_field_{{fieldName}}'>\
						<option></option>\
					</select>\
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
		this.fieldConfig = options.fieldConfig;
		this.select2     = options.select2;
		this.field       = ".vision_field_" + options.fieldConfig.fieldName;
		this.selector    = ".vision_select_field_" + options.fieldConfig.fieldName;
		

		// set default value - override available
		if ( ! options.select2.minimumInputLength) {
			options.select2.minimumInputLength = 3;
		}
		if (options.select2.ajax && ! options.select2.ajax.quietMillis) {
			options.select2.ajax.quietMillis=500;
		}
		if (options.select2.ajax && ! options.select2.ajax.delay) {
			options.select2.ajax.delay=1000;
		}
		
		this.events["change " + this.field] = this.updateSelectedOption;
		this.events["change " + this.selector] = this.setHiddenValue;

		this.render();
		this.updateSelectedOption();
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.html(newDom);
		this.$(this.selector).select2(this.select2);
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
		return this.$(this.selector).find("option[value='"+value+"']").html()
	},
	/**
	 * Helper function to sync up the hidden value with the two date fields
	 */
	updateSelectedOption: function() {
		var value = this.$(this.field).val();
		this.$(this.selector).val(value);
	},
	/**
	 * Helper function, when when either display values are updated, the hidden value is updated
	 */
	setHiddenValue: function() {
		var oldVal = this.$(this.field).val();
		var newVal = this.$(this.selector).val();
		this.$(this.field).val(newVal);
		if (oldVal !== newVal) {
			this.$(this.field).change();
		}
	},
});
