AQCU.view.BaseReportView = AQCU.view.BaseView.extend({
	templateName: 'report-card',
	reportName: null, //Display name of report
	selectedTimeSeries: null, //array of json objects describing selected timeseries, this array is ordered
	requiredRelatedTimeseriesConfig: [], //override this
	
	bindings: {},

	events: {
		'click .config-btn': 'launchAdvanceOptions',
		'click .display-btn': 'applyReportOptions'
	},
	
	initialize: function() {
		this.ajaxCalls = {};
		this.parentModel = this.options.parentModel;
		this.model = new Backbone.Model({
			selectedTimeSeries: null,
			startDate: null,
			endDate: null
		});
		
		this.model.bind("change:selectedTimeSeries", this.loadAllRequiredTimeseries, this);
		this.model.bind("change:startDate", this.loadAllRequiredTimeseries, this);
		this.model.bind("change:endDate", this.loadAllRequiredTimeseries, this);
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
	},
	
	preRender: function() {
		this.context = {
			reportName: this.reportName
		}
	},
	
	afterRender: function() {
		this.stickit();
	},
	
	setSelectedTimeSeries: function(selectedTimeSeries) {
		this.model.set("selectedTimeSeries", selectedTimeSeries);
	},
	
	setStartDate: function(startDate) {
		this.model.set("startDate", startDate);
	},
	
	setEndDate: function(endDate) {
		this.model.set("endDate", endDate);
	},
	
	abortAjax : function(ajaxCall) {
		if(ajaxCall && ajaxCall.abort) {
			ajaxCall.abort();
		} 
	},
	
	loadAllRequiredTimeseries: function() {
		if(this.model.get("selectedTimeSeries") && this.model.get("startDate") && this.model.get("endDate")) {
			for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.requiredRelatedTimeseriesConfig[i]);
			}
		}
	},
	
	loadRelatedTimeseries: function(params){
		this.abortAjax(this.ajaxCalls[params.requestId]);
		this.ajaxCalls[params.requestId] = $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/derivationChain/find",
			timeout: 120000,
			dataType: "json",
			data: {
				timeSeriesIdentifier: this.model.get("selectedTimeSeries").uid,
				direction: params.direction,
				publish: params.publish,
				computationIdentifier: params.computation || 'Unknown',
				computationPeriodIdentifier: params.period || 'Unknown',
				startDate: this.model.get("startDate"),
				endDate: this.model.get("endDate")
			},
			context: this,
			success: function(data) {
				if(data[0]) {
					this.model.set(params.requestId, data[0]);
				}
			},
			error: function() {
				//do something?
			}
		});
	},
	
	launchAdvanceOptions: function() {
		alert("OVERRIDE ME");
	},
	
	constructReportOptions: function() {
		var reportOptions = {
			reportType: this.reportType,
			isHtml: this.model.get("isHtml") || this.defaultToHtml,
			primaryTimeseriesIdentifier: this.model.get("selectedTimeSeries").uid
		};

		for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
			reportOptions[this.requiredRelatedTimeseriesConfig[i].requestId] = this.model.get(this.requiredRelatedTimeseriesConfig[i].requestId);
		}
		
		return reportOptions;
	},
	
	applyReportOptions: function() {
		this.parentModel.set("requestParams", this.constructReportOptions());
	}
});