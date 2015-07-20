/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.ReportConfigView = AQCU.view.BaseView.extend({
	templateName: 'report-config',
	
	//Someday this may change dynamically depending on selected TS
	availableReports: [
		AQCU.view.ExtremesReportView,
		AQCU.view.VDiagramReportView,
		AQCU.view.UvHydrographReportView
		],
       
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
		var selectedTimeSeries = this.options.selectedTimeSeries ||
			site ? AQCU.util.localStorage.getData("selectedTimeSeries" + site) : null;
		var startDate = this.options.startDate ||
			site ? AQCU.util.localStorage.getData("startDate-" + site) : null;	
		var endDate = this.options.endDate ||
			site ? AQCU.util.localStorage.getData("endDate-" + site) : null;	
			
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				site: site,
				startDate: startDate,
				endDate: endDate,
				selectedTimeSeries: selectedTimeSeries, 
				requestParams: null //this gets set by select
			});
		
		this.model.bind("change:site", this.siteUpdated, this);
		this.model.bind("change:selectedTimeSeries", this.updateReportViews, this);
		this.model.bind("change:requestParams", this.launchReport, this);
		
		this.availableReportViews = [];
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
		
		for(var i = 0; i < this.availableReports.length; i++) {
			var view = new this.availableReports[i]({
					parentModel: this.model,
					router: this.router
			});
			this.$('.available-reports').append(view.el);
			this.availableReportViews.push(view);
		}
		
		this.stickit();
		
		this.REMOVE_ME_TEST_DATA_INIT();
	},
	
	REMOVE_ME_TEST_DATA_INIT: function() {
		this.model.set('startDate', new Date(2014, 9, 1, 0, 0, 0, 0).toISOString());
		this.model.set('endDate', new Date(2014, 9, 31, 0, 0, 0, 0).toISOString());
		this.model.set('selectedTimeSeries',  
           {
        	   "parameter": "Discharge",
        	   "description": "DD003,00060,ft^3/s",
        	   "computation": "Unknown",
        	   "period": "Unknown",
        	   "identifier": "Discharge.ft^3/s@06893390",
        	   "units": "ft^3/s",
        	   "uid" : "a12d7fc43900440ab09e1ea48713f29d"
           });
           
		/*
		  Rating request: https://localhost:8443/aqcu-front-end/service/lookup/derivationChain/ratingModel?timeSeriesIdentifier=a12d7fc43900440ab09e1ea48713f29d&startDate=2014-10-01T05%3A00%3A00.000Z&endDate=2014-10-31T05%3A00%3A00.000Z
		  [
			  "Gage height-Discharge.STGQ@06893390"
			]
		 */
	},
	
	siteUpdated: function() {
		this.render();
	},
	
	setSite: function(site) {
		this.model.set("site", site);
	},
	
	//update report views with new user selections
	updateReportViews: function() {
		//update all report view cards
		var selectedTimeSeries = this.model.get("selectedTimeSeries");
		var startDate = this.model.get("startDate");
		var endDate = this.model.get("endDate");
		for(var i = 0; i < this.availableReportViews.length; i++) {
			var report = this.availableReportViews[i]
			report.setSelectedTimeSeries(selectedTimeSeries);
			report.setStartDate(startDate);
			report.setEndDate(endDate);
		};
	},
	
	launchReport: function() {
		var criteria = {
			station : this.model.get("site").siteNumber.trim(),
			startDate : this.model.get("startDate"),
			endDate : this.model.get("endDate")
		};

		$.extend(criteria, this.model.get("requestParams"));
		//get parameters from all sources, combine into one request config and launch report
		this.router.startDownload(AQCU.constants.serviceEndpoint + "/service/reports/" + criteria.reportType + (!criteria.isHtml ? "/download" : ""), criteria, "");
	}
});