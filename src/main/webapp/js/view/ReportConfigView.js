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
		"click .close-btn": "removeTimeSeries"
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
		this.model.bind("change:selectedTimeSeries", this.updateSelectedTimeSeries, this);
		this.model.bind("change:requestParams", this.launchReport, this);
		
		//this.REMOVE_ME_TEST_DATA_INIT();
	},
	
	REMOVE_ME_TEST_DATA_INIT: function() {
		this.model.set('startDate', new Date().toISOString());
		this.model.set('endDate', new Date().toISOString());
		this.model.set('primaryTimeseriesIdentifier', 'a12d7fc43900440ab09e1ea48713f29d');
		this.model.set('selectedTimeSeries', [ //java script has to convert kvp to array of TS 
           {
        	   "parameter": "Discharge",
        	   "description": "DD003,00060,ft^3/s",
        	   "computation": "Unknown",
        	   "period": "Unknown",
        	   "identifier": "Discharge.ft^3/s@06893390",
        	   "units": "ft^3/s",
        	   "uid" : "a12d7fc43900440ab09e1ea48713f29d"
           },
           {
        	   "parameter": "Gage height",
        	   "description": "DD002,00065,ft,DCP",
        	   "computation": "Unknown",
        	   "period": "Unknown",
        	   "identifier": "Gage height.ft.Work@06893390",
        	   "units": "ft",
        	   "uid" : "f68ca269c90f44fcbda27b5f6d0a9858"
           },
           {
        	   "parameter": "Discharge",
        	   "description": "DD003,00060,ft^3/s,00003",
        	   "computation": "Mean",
        	   "period": "Daily",
        	   "identifier": "Discharge.ft^3/s.Mean@06893390",
        	   "units": "ft^3/s",
        	   "uid": "02f1fcfe54e24d648961c36edc3ffe37"
           }
           ]);
		
		/*
		  Rating request: https://localhost:8443/aqcu-front-end/service/lookup/derivationChain/ratingModel?timeSeriesIdentifier=a12d7fc43900440ab09e1ea48713f29d&startDate=2014-10-01T05%3A00%3A00.000Z&endDate=2014-10-31T05%3A00%3A00.000Z
		  [
			  "Gage height-Discharge.STGQ@06893390"
			]
		 */
	},

	/*override*/
	preRender: function() {
		this.context = {
			site : this.model.get("site"),
			selectedTimeSeries : this.model.get("selectedTimeSeries")
		};
	},
	
	afterRender: function () {
		this.ajaxCalls = {}; //used to cancel in progress ajax calls if needed

		//TODO 

		//date range selection

		this.fetchTimeSeries();

		for (var i = 0; i < this.availableReports.length; i++) {
			var view = new this.availableReports[i]({
				parentModel: this.model,
				router: this.router
			});
			this.$('.available-reports').append(view.el);
		}
		
		this.stickit();
	},
	
	fetchTimeSeries: function () {
		var site = this.model.get("site");
		
		if (site) {
			$.ajax({
				url: AQCU.constants.serviceEndpoint +
						"/service/lookup/timeseries/identifiers",
				timeout: 120000,
				dataType: "json",
				data: {
					stationId: site.siteNumber,
					computationIdentifier: "Unknown", //Unknown seems to be applied to non-mean/DV series
					computationPeriodIdentifier: "Unknown" //Unknown seems to be applied to non-mean/DV series
				},
				context: this,
				success: function (data) {
					var sortedArray = [];
					for (var opt in data) {
						sortedArray.push([opt, data[opt]])
					}
					sortedArray.sort(function (a, b) {
						if (a[1].identifier > b[1].identifier) {
							return 1;
						} else if (a[1].identifier < b[1].identifier) {
							return -1;
						} else {
							return 0;
						}
					});
					var sortedFormattedArray = [];
					for (var i = 0; i < sortedArray.length; i++) {
						var timeSeriesEntry = sortedArray[i][1];
						timeSeriesEntry.uid = sortedArray[i][0];
						sortedFormattedArray.push(timeSeriesEntry);
					}
					this.selectionGrid = new AQCU.view.TimeSeriesSelectionGridView({
						parentModel: this.model,
						router: this.router,
						el: this.$(".time-series-selection-grid-container"),
						timeSeriesList: sortedFormattedArray
					});					
				},
				error: function () {

				}
			});
		}
	},
	
	updateSelectedTimeSeries: function() {
		this.render();
	},
	
	removeTimeSeries: function() {
		this.model.set("selectedTimeSeries", null);
	},
	
	siteUpdated: function() {
		this.model.set("selectedTimeSeries", null);
		this.render();
	},
	
	setSite: function(site) {
		this.model.set("site", site);
	},
	
	//TODO: Get rid of this function?
	updateView: function() {
		var selectedTimeSeries = this.model.get("selectedTimeSeries");
		var primaryTimeSeriesSelector = this.$(".primary-ts-selector");
		var reportViewsContainer = this.$(".report-views-container");
		var timeSeriesSelectionGrid = this.$(".time-series-selection-grid-container");
		if(selectedTimeSeries){
			primaryTimeSeriesSelector.removeClass("hidden");
			reportViewsContainer.removeClass("hidden");
			timeSeriesSelectionGrid.addClass("hidden");
		}
		else{
			primaryTimeSeriesSelector.addClass("hidden");
			reportViewsContainer.addClass("hidden");
			timeSeriesSelectionGrid.removeClass("hidden");
		}
	},
	
	//update report views with new user selections
	updateReportViews: function() {
		//update all report view cards
	},
	
	launchReport: function() {
		//get parameters from all sources, combine into one request config and launch report
	}
});