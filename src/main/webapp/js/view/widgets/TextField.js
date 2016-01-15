/**
 * Backbone view to encapsulate the text field widget
 */
AQCU.view.TextField = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("<div class='row field-container'> \
		{{#if displayName}}\
		<div class='col-sm-5 col-md-5 col-lg-5'><label for='{{fieldName}}'>{{displayName}}&nbsp;&nbsp; \
			{{#if description}}\
				<i class='fa fa-question-circle category-tip-target' title='{{description}}'></i>\
			{{/if}}\
		</label><br/></div> {{/if}}\
		<div class='{{#if displayName}}col-sm-7 col-md-7 col-lg-7{{else}}col-sm-12 col-md-12 col-lg-12{{/if}}'><input name='{{fieldName}}' class='aqcu_field aqcu_field_{{fieldName}}' placeholder='{{placeHolderText}}' {{readOnly}}/></div> \
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
		this.searchModel = this.options.searchModel; //NWIS search model
		this.fieldConfig = this.options.fieldConfig;
		this.renderTo = this.options.renderTo;

		if(!this.fieldConfig.placeHolderText) {
			this.fieldConfig.placeHolderText = "Any..."; 
		}
		
		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
	},
	render: function() {
		var newDom = this.template(this.fieldConfig); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);
	},
	/**
	 * The HTML that is generated here can be bound using Backbone stickit with the following
	 * config attributes.
	 * @returns JSON object containing a single config for this element
	 */
	getBindingConfig: function() {
		var binding = {};
		binding[".aqcu_field_" + this.fieldConfig.fieldName] = {
			observe: this.fieldConfig.fieldName,
			events: ['blur'] //this causes the model to only update after you leave the field
		};
		return binding;
	}
});