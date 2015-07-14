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
				<div class='col-sm-5 col-lg-5'>\
					<label for='{{fieldName}}'>{{displayName}}&nbsp;&nbsp;\
					{{#if description}}\
						<i class='fa fa-question-circle nwis-search-form-category-tip-target' title='{{description}}'></i>\
					{{/if}}\
					</label><br/>\
				</div>\
				{{/if}}\
				<input type='hidden' name='{{fieldName}}' class='vision_field vision_field_{{fieldName}}'/> \
				<div class='{{#if displayName}}col-sm-7 col-lg-7{{else}}col-sm-12 col-lg-12{{/if}}'>\
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
	initialize: function() {
		this.router      = this.options.router; //NWIS Vision Router
		this.searchModel = this.options.searchModel; //NWIS search model
		this.fieldConfig = this.options.fieldConfig;
		this.renderTo    = this.options.renderTo;
		this.select2     = this.options.select2;
		this.field       = ".vision_field_" + this.fieldConfig.fieldName;
		this.selector    = ".vision_select_field_" + this.fieldConfig.fieldName;

		this.filterRequired = this.options.filterRequired;
		
		this.events["change " + this.field] = this.updateSelectedOption;
		this.events["change " + this.selector] = this.setHiddenValue;

		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
		this.updateSelectedOption();
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);
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
