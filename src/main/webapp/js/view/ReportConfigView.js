/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.ReportConfigView = AQCU.view.BaseView.extend({
	templateName: 'report-config',
       
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		var site = this.options.site || null;
		
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				site: site
			});
		
		this.model.bind("change:site", this.siteUpdated, this);
		
		//TODO 
		//timeseries selection
		//date range selection
		//report selection/configuration views
	},

	/*override*/
	preRender: function() {
		this.context = {
			site : this.model.get("site")
		}
	},
	
	afterRender: function() {
		this.ajaxCalls = {}; //used to cancel in progress ajax calls if needed
		this.stickit();
	},
	
	siteUpdated: function() {
		this.render();
	},
	
	setSite: function(site) {
		this.model.set("site", site);
	}
});