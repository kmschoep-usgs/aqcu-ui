/**
 * Backbone view to encapsulate the check box field widget
 */
AQCU.view.CheckBoxField = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
	<div> \
	    <div> \
		<div class='row field-container'> \
		    <div class='col-sm-5 col-md-5 col-lg-5'> \
			<label for='{{fieldName}}'>{{displayName}}</label><br> \
		    </div> \
		    <div class='checkbox col-sm-7 col-md-7 col-lg-7'> \
			<label><input class='aqcu_check_box_field_{{fieldName}}' name='{{fieldName}}' type='checkbox'>{{description}}</label> \
		    </div> \
		</div> \
	    </div> \
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
		this.options = options;
		this.router = this.options.router; 
		this.fieldConfig = this.options.fieldConfig;
		this.renderTo = this.options.renderTo;
		this.model = this.options.model;
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
		binding[".aqcu_check_box_field_" + this.fieldConfig.fieldName] = {
			observe: this.fieldConfig.fieldName,
			events: ['blur'] //this causes the model to only update after you leave the field
		};
		return binding;
	}
});