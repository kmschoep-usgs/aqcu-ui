AQCU.view.FiveYearGWSummaryReportView = AQCU.view.BaseReportView.extend({
	reportName: "Five Year Ground Water Summary", 
	reportAbbreviation: "5YR",
	reportType: "fiveyeargwsum",
	relatedTimeseriesConfig: [{
			requestId: "firstDownChainIdentifier",
			display: "Stat Derived Time Series 1",
			direction: "downchain",
			required: true,
			defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}],
		
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions() }, this); //additional event handler
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createExcludeMinMaxSelector();
	},
	
	createExcludeMinMaxSelector: function() {
		var excludeMinMaxField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='excludeMinMax'>Additional Options</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='excludeMinMax' name='excludeMinmax' type='checkbox'>Disable Min/Max Plotting</label>" +
				"</div>" +
				
				"</div></div></div>");//not sure this warrants using a template YET
		this.model.set("excludeMinMax", false);
		$.extend(this.bindings, {
			".excludeMinMax" : "excludeMinMax"
		});
		this.advancedOptionsContainer.append(excludeMinMaxField);
	},
	
	loadAllRequiredTimeseries: function (params) {
		var _this = this;
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")
				&& _.find(this.relatedTimeseriesConfig, function(ts){
					if (ts.requestId === params.requestId) {
					return true
					} else
						return false
				})
			){
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params, derivationChains, params.parameter);
			});
		}
	},	
		
	loadAllTimeSeriesOptions : function() {
		if(this.model.get("site")) {
			for(var key in this.builtSelectorFields){
				if(this.selectorParams[key].dynamicParameter && this.model.get('selectedTimeSeries')){
					this.selectorParams[key].parameter = this.model.get('selectedTimeSeries').parameter;
				}
			} 
			AQCU.view.BaseReportView.prototype.loadAllTimeSeriesOptions.apply(this, arguments);
		}
	},
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		
		if(this.model.get("excludeMinMax")){
			reportOptions.excludeMinMax = this.model.get("excludeMinMax");
		}
		
 		return reportOptions;
	}
});

