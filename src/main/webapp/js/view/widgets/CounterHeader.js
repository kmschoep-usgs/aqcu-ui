/**
 * Backbone view to encapsulate the the counter menu widget
 */
AQCU.view.CounterHeader = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("<div class='row'> \
			<div class='col-sm-6 col-lg-6' style='float:left'>\
            <label for='vision_counter' style='float:left'>Category Records:</label> \
            <div class='vision_counter' style='min-width:6em ; padding-left:0.2em ; padding-right:0.2em ; float:left'>...</div> \
            <button class='view_records_button' type='button' style='float:left'>View...</button>\
            </div> \
			<div class='col-sm-6 col-lg-6' style='float:left'>\
		    <label for='vision_sites_counter' style='float:left'>Category Sites:</label> \
		    <div class='vision_sites_counter' style='min-width:7em ; padding-left:0.2em; padding-right:0.2em ; float:left'>...</div> \
            <button class='view_related_sites_button' type='button' style='float:left'>View...</button> \
            </div> \
			</div><hr>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
	},
	/**
	 * Default initialize and render the counter menu
	 */
	initialize: function() {
		this.searchModel = this.options.searchModel; //NWIS search model
		this.renderTo = this.options.renderTo;
		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
	},
	render: function() {
		var newDom = this.template(); //new DOM elements created from templates
		this.$el.append(newDom);
		this.renderTo.append(this.el);
	}
});