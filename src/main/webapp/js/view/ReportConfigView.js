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
		this.model.bind("change:selectedTimeSeries", this.updateView, this);
		this.model.bind("change:selectedTimeSeries", this.updateReportViews, this);
		this.model.bind("change:startDate", this.updateReportViews, this);
		this.model.bind("change:endDate", this.updateReportViews, this);
		this.model.bind("change:requestParams", this.launchReport, this);
		
		this.availableReportViews = [];
	},
	
	/*override*/
	preRender: function() {
		this.removeReportViews();
		this.context = {
			site : this.model.get("site"),
			selectedTimeSeries : this.model.get("selectedTimeSeries")
		};
	},
	
	afterRender: function () {
		this.ajaxCalls = {}; //used to cancel in progress ajax calls if needed

		this.createReportViews();
		this.dateRange = new AQCU.view.DateField({
			router  : this.router,
			model   : this.model,
			renderTo: $('.date-range'),
			format  : "yyyy-mm-dd",
			fieldConfig: {
				isDateRange        : true,
				includeLastMonths  : true,
				includeWaterYear   : true,
				startDateFieldName : "startDate",
				endDateFieldName   : "endDate",
				displayName        : "Date Range",
				fieldName          : "date_range",
				description        : ""
			},
		});

		this.fetchTimeSeries();
		this.stickit();
	},		
			
	removeReportViews: function() {		
		while(this.availableReportViews.length > 0) {		
			this.availableReportViews[0].remove();		
			this.availableReportViews.shift();		
		}		
	},		
			
	createReportViews: function() {
		for (var i = 0; i < this.availableReports.length; i++) {
			var view = new this.availableReports[i]({
				parentModel: this.model,
				router: this.router
			});
			this.$('.available-reports').append(view.el);
			this.availableReportViews.push(view);
		}
		this.updateReportViews();
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
	
	updateView: function() {
		var selectedTimeSeries = this.model.get("selectedTimeSeries");
		var primaryTimeSeriesSelector = this.$(".primary-ts-selector");
		var reportViewsContainer = this.$(".report-views-container");
		var timeSeriesSelectionGrid = this.$(".time-series-selection-grid-container");
		if(selectedTimeSeries){
			primaryTimeSeriesSelector.removeClass("hidden");
			reportViewsContainer.removeClass("hidden");
			timeSeriesSelectionGrid.addClass("hidden");
			this.$(".selected-identifier").html(selectedTimeSeries.identifier);
			this.$el.parent().removeClass('nwis-loading-indicator');
		}
		else{
			primaryTimeSeriesSelector.addClass("hidden");
			reportViewsContainer.addClass("hidden");
			timeSeriesSelectionGrid.removeClass("hidden");
			this.$(".selected-identifier").html("");
			this.$el.parent().removeClass('nwis-loading-indicator');
		}
	},
	
	removeTimeSeries: function() {
		this.model.set("selectedTimeSeries", null);
	},
	
	siteUpdated: function() {
		var nwisLocation = this.$el.parent();
		this.model.set("requestParams", null);
		this.model.set("selectedTimeSeries", null);
		this.render();
		nwisLocation.addClass('nwis-loading-indicator');
	},
	
	setSite: function(site) {
		this.model.set("site", site);
	},
	
	//update report views with new user selections
	updateReportViews: function() {
		//update all report view cards
		var site = this.model.get("site");
		var selectedTimeSeries = this.model.get("selectedTimeSeries");
		var startDate = this.model.get("startDate");
		var endDate = this.model.get("endDate");
		for(var i = 0; i < this.availableReportViews.length; i++) {
			var report = this.availableReportViews[i]
			report.setSite(site);
			report.setSelectedTimeSeries(selectedTimeSeries);
			report.setStartDate(startDate);
			report.setEndDate(endDate);
		};
	},
	
	launchReport: function() {
		var requestParams = this.model.get("requestParams");
		var reportOptions = this.model.get("reportOptions");
		if(requestParams) {
			var criteria = {
				station : this.model.get("site").siteNumber.trim(),
				startDate : this.model.get("startDate"),
				endDate : this.model.get("endDate")
			};
		
			$.extend(criteria, requestParams);
			//get parameters from all sources, combine into one request config and launch report
			this.router.startDownload(AQCU.constants.serviceEndpoint + "/service/reports/" + reportOptions.reportType + (!reportOptions.isHtml ? "/download" : ""), criteria, "");
			this.model.set("requestParams", null);
		}
	}
});
