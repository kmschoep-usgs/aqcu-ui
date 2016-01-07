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
		
		this.parentModel = this.options.parentModel;
		
		var site = this.parentModel.get("site");
		var selectedTimeSeries = this.options.selectedTimeSeries ||
			site ? AQCU.util.localStorage.getData("selectedTimeSeries" + site) : null;
		var startDate = this.options.startDate ||
			site ? AQCU.util.localStorage.getData("startDate-" + site) : null;	
		var endDate = this.options.endDate ||
			site ? AQCU.util.localStorage.getData("endDate-" + site) : null;	
			
		this.model = this.options.model || new Backbone.Model({
				site: this.parentModel.get("site"),
				startDate: startDate,
				endDate: endDate,
				selectedTimeSeries: selectedTimeSeries, 
				requestParams: null,
				filterPublish: this.parentModel.get("filterPublish"),
				filterPrimary: this.parentModel.get("filterPrimary")
			});
		
		this.parentModel.bind("change:selectedSite", this.siteUpdated, this);
		this.model.bind("change:requestParams", this.launchReport, this);
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

		this.reportConfigHeader = new AQCU.view.ReportConfigParamsView({
			parentModel: this.model,
			router: this.router,
			el: this.$(".report-config-params-container")
		});
		
		this.reportConfigHeader = new AQCU.view.ReportConfigHeaderView({
			parentModel: this.model,
			router: this.router,
			el: this.$(".report-config-header-container")
		});

		this.selectionGrid = new AQCU.view.TimeSeriesSelectionGridView({
				parentModel: this.model,
				router: this.router,
				el: this.$(".time-series-selection-grid-container")
			});
		
		this.reportsGrid = new AQCU.view.ReportConfigSelectionView({
			parentModel: this.model,
			router: this.router,
			el: this.$(".report-views-container")
		});
		
		this.stickit();
	},

	
	siteUpdated: function() {
		this.model.set("requestParams", null);
		this.model.set("selectedTimeSeries", null);
		this.model.set("site", this.parentModel.get("selectedSite"));
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
