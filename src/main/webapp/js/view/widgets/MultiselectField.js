/**
 * extend stickit to properly handle binding to select2 components
 */
Backbone.Stickit.addHandler([
	{
		selector: '.select2-hidden-accessible',
		events: ['change'],
		getVal: function($el) {
			return $el.val();
		},
		update: function($el, val, model, options) {
			$el.val(val);
		}
	}
]);

/**
 * Backbone view to encapsulate the text field widget
 */
AQCU.view.MultiselectField = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
			<div class='row field-container'>\
				{{#if displayName}}\
				<div class='col-sm-5 col-md-5 col-lg-5'>\
					<label for='{{fieldName}}'>{{displayName}}&nbsp;&nbsp;\
					{{#if description}}\
						<i class='fa fa-question-circle category-tip-target' title='{{description}}'></i>\
					{{/if}}\
					</label><br/>\
				</div>\
				{{/if}}\
				<div class='{{#if displayName}}col-sm-7 col-md-7 col-lg-7{{else}}col-sm-12 col-md-12 col-lg-12{{/if}}'>\
					<select class='aqcu_field aqcu_multi_select_field_{{fieldName}}'>\
					</select>\
				</div>\
			</div>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
	},
	/**
	 * Will create and render a multiselect field using a fieldConfig options
	 */
	initialize: function(options) {
		// template configurations
		this.fieldConfig = options.fieldConfig;
		
		// select2 configurations
		this.select2 = {
		    placeholder: this.fieldConfig.placeholder,
		    width: '100%',
		    data: options.data,
		    multiple: true,
		    minimumInputLength: -1,
		    minimumResultsForSearch: Infinity
		}
		
		this.initialSelection = options.initialSelection;
		
		this.selector    = ".aqcu_multi_select_field_" + options.fieldConfig.fieldName;
		
		// model bindings
		this.model       = options.model;
		this.modelField  = options.modelField ?options.modelField :options.fieldConfig.fieldName;
		if (this.model.get(this.modelField) === undefined) {
			this.model.set(this.modelField, '');
		}
		this.bindings = {}; // dynamic binding
		this.bindings[this.selector] = this.modelField;
		
		this.render();
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.html(newDom);
		this.$(this.selector).select2(this.select2);
		this.$(this.selector).select2('val', this.initialSelection);
		this.$(this.selector).trigger('change');
		this.stickit();
	},
	getDisplayValue: function(value) {
		// if no value is given then use the current value
		if (value === undefined) {
			value = $(this.selector).val();
		}
		return this.$(this.selector).find("option[value='"+value+"']").text();
	}
});
