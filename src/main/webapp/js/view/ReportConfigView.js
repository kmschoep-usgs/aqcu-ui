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
		
		//restores previously selected parameters for defaults if they exist 
		var site = this.options.site || null;
		var primaryTimeseriesIdentifier = this.options.primaryTimeseriesIdentifier ||
			site ? AQCU.util.localStorage.getData("primaryForSite" + site) : null;
		var startDate = this.options.startDate ||
			site && primaryTimeseriesIdentifier ? AQCU.util.localStorage.getData("startDate-" + site+primaryTimeseriesIdentifier) : null;	
		var endDate = this.options.endDate ||
			site && primaryTimeseriesIdentifier ? AQCU.util.localStorage.getData("endDate-" + site+primaryTimeseriesIdentifier) : null;	
			
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				site: site,
				primaryTimeseriesIdentifier: primaryTimeseriesIdentifier,
				startDate: startDate,
				endDate: endDate,
				requestParams: null //this gets set by select
			});
		
		this.model.bind("change:site", this.siteUpdated, this);
		this.model.bind("change:requestParams", this.launchReport, this);
	},

	/*override*/
	preRender: function() {
		this.context = {
			site : this.model.get("site")
		}
	},
	
	afterRender: function() {
		this.ajaxCalls = {}; //used to cancel in progress ajax calls if needed
		
		//TODO 
		//timeseries selection
		//date range selection
		//report selection/configuration views
		
		this.stickit();
	},
	
	siteUpdated: function() {
		this.render();
	},
	
	setSite: function(site) {
		this.model.set("site", site);
	}
});