/**
 * Base class for most views. Default behavior for a view will fetch a handlebar template, and render it to the element passed in.
 */
AQCU.view.BaseView = Backbone.View.extend({
	/**
	 * Name of a template. The name should correspond to a file. A URL will be constructed by convention to
	 * request the template (See AQCU.util.template.getTemplate in template.js).
	 */
	templateName: null, //all views should provide a template name corresponding to an hb file in /templates

	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
	},
	/**
	 * Default initializer, will retrieve template and call render
	 */
	initialize: function() {
		this.router = this.options.router;
		this.context = this.options.context;
		AQCU.util.template.getTemplate({ template: this.templateName, context : this}).done( function(template) {
			this.template = template;
			Backbone.View.prototype.initialize.apply(this, arguments);
			this.render();
			this.stylizeAllButtons();
		});
	},
	
	/**override**/
	render: function() {
		this.preRender();
		this.baseRender();
		this.afterRender();
	},
	
	/**
	 * Default render function. Calls a template function obtained in the initialize.
	 * @returns this
	 */
	baseRender: function() {
		this.$el.html(this.template(this.context || {}));
		return this;
	},
	/**
	 * Overridable, post-init, pre-render actions
	 * @returns this
	 */
	preRender: function() {
		//OVERRIDE ME
	},
	/**
	 * Overridable, post-init, post-render actions
	 * @returns this
	 */
	afterRender: function() {
		//OVERRIDE ME
	},
	
	goHome: function() {
		this.router.navigate('', {trigger: true});
	},
	goToPrototype: function() { //TODO remove me when new UI done
		this.router.navigate('prototype', {trigger: true});
	},
	stylizeAllButtons: function() {
		$("input[type=button], button")
				.button();
	}
	/** END COMMON navigation functions */
});