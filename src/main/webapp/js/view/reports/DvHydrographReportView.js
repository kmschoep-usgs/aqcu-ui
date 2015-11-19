AQCU.view.DvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "DV Hydrograph",
	reportType: "dvhydrograph",
	requiredRelatedTimeseriesConfig: [{
			requestId: "firstDownChainIdentifier",
			display: "First Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			parameter: 'userSelectedParameter',
			period: 'Daily',
			dynamicParameter: 'true'
		}],
	optionalRelatedTimeseriesConfig: [{
			requestId: "secondDownChainIdentifier",
			display: "Second Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			parameter: 'userSelectedParameter',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "thirdDownChainIdentifier",
			display: "Third Downchain Stat Derived Time Series",
			direction: "downchain",
			publish: 'true',
			parameter: 'userSelectedParameter',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "dvSecondaryReferenceIdentifier",
			display: "Secondary Reference Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		}, {
			requestId: "dvTertiaryReferenceIdentifier",
			display: "Tertiary Reference Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		}, {
			requestId: "dvQuaternaryReferenceIdentifier",
			display: "Quaternary Reference Time Series",
			direction: "downchain",
			publish: 'true',
			period: 'Daily'
		}],
	
	loadAllRequiredTimeseries: function () {
		this.clearRatingModels();
		
		this.loadAllTimeSeriesOptions();
		
		if (this.model.get("selectedTimeSeries") && this.model.get("startDate") && this.model.get("endDate")) {
			for (var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.requiredRelatedTimeseriesConfig[i]);
			}
			for (var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.optionalRelatedTimeseriesConfig[i]);
			}
		}
	},
	
		
	loadAllTimeSeriesOptions : function() {
		for(var key in this.builtSelectorFields){
			if(this.model.get("site")) {
				if(this.selectorParams[key].dynamicParameter && this.model.get('selectedTimeSeries')){
					this.selectorParams[key].parameter = this.model.get('selectedTimeSeries').parameter;
				}
				var tsSelector = this.builtSelectorFields[key];
				var params = this.selectorParams[key];
				this.populateTimeSeriesSelector(tsSelector, params);
			} 
		}
	}

});
