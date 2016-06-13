AQCU.view.UvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "UV Hydrograph", 
	reportAbbreviation: "UV",
	reportType: "uvhydrograph",
	optionalRelatedTimeseriesConfig: [{
			requestId: "secondaryTimeseriesIdentifier",
			display: "Secondary Time Series",
			direction: "downchain",
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points',
			skipAutoLoad: true
		},{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Time Series",
			direction: "upchain",
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points'
		},{
			requestId: "derivedMeanTimeseriesIdentifier",
			display: "Daily Mean",
			direction: "downchain",
			publish: 'true',
			computation: 'Mean',
			period: 'Daily'
		},{
			requestId: "derivedMaxTimeseriesIdentifier",
			display: "Daily Max",
			direction: "downchain",
			publish: 'true',
			computation: 'Max',
			period: 'Daily'
		},{
			requestId: "derivedMinTimeseriesIdentifier",
			display: "Daily Min",
			direction: "downchain",
			publish: 'true',
			computation: 'Min',
			period: 'Daily'
		},{
			requestId: "derivedMedianTimeseriesIdentifier",
			display: "Daily Median",
			direction: "downchain",
			publish: 'true',
			computation: 'Median',
			period: 'Daily'
		}],
	optionalRatingModels: [{ 
			requestId: "ratingModelIdentifier", 
			display: "Primary Rating Model", 
			bindTo: "primaryTimeseriesIdentifier"
		},{ 
			requestId: "secondaryRatingModelIdentifier", 
			display: "Secondary Rating Model", 
			bindTo: "secondaryTimeseriesIdentifier"
	}],
	
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions() }, this); //additional event handler
	},
	
	loadAllRequiredTimeseries: function () {
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")) {
			for (var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.requiredRelatedTimeseriesConfig[i]);
			}
			for (var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.optionalRelatedTimeseriesConfig[i]);
			}
		}
	},
	
	removeSelectFields: function() {
		if(this.comparisonStation){
			this.comparisonStation.remove();
		}
		if(this.comparisonSelect) {
			this.comparisonSelect.remove();
		}
		AQCU.view.BaseReportView.prototype.removeSelectFields.apply(this, arguments);
	},
	
	loadAllTimeSeriesOptions : function(callback) {
		if(this.model.get("site")) {
			for(var key in this.builtSelectorFields){
				if(this.selectorParams[key].dynamicParameter && this.model.get('selectedTimeSeries')){
					this.selectorParams[key].parameter = this.model.get('selectedTimeSeries').parameter;
				}
			} 
			AQCU.view.BaseReportView.prototype.loadAllTimeSeriesOptions.apply(this, [callback]);
		}
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createComparisonSiteSelector();
		this.createComparisonTimeseriesSelector();
	},
	
	createComparisonSiteSelector: function() {
		var newContainer = $('<div class="aqcu-uv-comparison-site"></div>');
		this.advancedOptionsContainer.append(newContainer);

		this.comparisonStation = new AQCU.view.Select2Field({
			el: '.aqcu-uv-comparison-site',
			model : this.model,
			fieldConfig: {
				fieldName   : "comparisonStation",
				displayName: "Comparison Site",
				description : ""
			},
			select2: {
				placeholder : "Comparison location",
				width: '100%',
				ajax : {
					url: AQCU.constants.serviceEndpoint + "/service/lookup/sites",
					dataType: 'json',
					data: function (params) {
						return {
							pageSize: 10,
							siteNumber: params.term
						}
					},
					processResults: function (data, page) {
						var siteList = [];
						for (var i = 0; i < data.length; i++) {
							siteList.push({ 
								id  : data[i].siteNumber,
								text: data[i].siteNumber +" - "+ data[i].siteName}
							);
						}
						return {results: siteList};
					},
					cache: true
				},
			},
			startHidden: false,
		});		
		
		//make sure to update list for comparison timeseries if site changes
		this.model.bind("change:comparisonStation", function() {
			this.loadTimeseriesIdentifiers(
				"comparisonTimeseriesIdentifier",
				{
					stationId: this.model.get("comparisonStation"),
					computationIdentifier: 'Instantaneous', //Instantaneous seems to be applied to non-mean/DV series
					computationPeriodIdentifier: 'Points' //Points seems to be applied to non-mean/DV series
				});
		}, this);	
		
	},
	
	//create additional TS Selector
	createComparisonTimeseriesSelector: function() {
		this.comparisonSelect = this.createTimeseriesSelectionBox(
				{
					requestId: "comparisonTimeseriesIdentifier",
					display: "Comparison Time Series"
				},
				false
				);
	},
	
	//add additional field to base display map
	constructDisplayValuesMap: function(requestParams) {
		var displayValues = AQCU.view.BaseReportView.prototype.constructDisplayValuesMap.apply(this, arguments);
		_.each(requestParams, function(val, key){
			if(key == "comparisonTimeseriesIdentifier") {
				if(val) {
					var advancedField = this.comparisonSelect;
					if(advancedField) {
						displayValues[val] = advancedField.getOptionDisplayValue(val);
					}
				}
			}
		}, this) 
		return displayValues;
	},
	
	
	constructReportOptions: function() {
		var reportOptions = AQCU.view.BaseReportView.prototype.constructReportOptions.apply(this, arguments);
		if(this.model.get("comparisonStation")) {
			reportOptions.comparisonStation = this.model.get("comparisonStation");
		}
		
		if(this.model.get("comparisonTimeseriesIdentifier")) {
			reportOptions.comparisonTimeseriesIdentifier = this.model.get("comparisonTimeseriesIdentifier");
		}
		
		if(this.model.get("secondaryRatingModelIdentifier")) {
			reportOptions.ratingModelIdentifier = this.model.get("secondaryRatingModelIdentifier");
		}
 		return reportOptions;
	}
});