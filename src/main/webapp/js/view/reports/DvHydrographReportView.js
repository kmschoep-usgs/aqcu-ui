AQCU.view.DvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "DV Hydrograph", 
	reportAbbreviation: "DV",
	reportType: "dvhydrograph",
	requiredRelatedTimeseriesConfig: [{
			requestId: "firstDownChainIdentifier",
			display: "First Downchain Stat Derived Time Series",
			direction: "downchain",
			defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}],
	optionalRelatedTimeseriesConfig: [{
			requestId: "secondDownChainIdentifier",
			display: "Second Downchain Stat Derived Time Series",
			direction: "downchain",
			defaultComputation: "Max",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "thirdDownChainIdentifier",
			display: "Third Downchain Stat Derived Time Series",
			direction: "downchain",
			defaultComputation: "Min",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "secondaryReferenceIdentifier",
			display: "Secondary Reference Time Series",
			direction: "downchain",
			//defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily'
		}, {
			requestId: "tertiaryReferenceIdentifier",
			display: "Tertiary Reference Time Series",
			direction: "downchain",
			//defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily'
		}, {
			requestId: "quaternaryReferenceIdentifier",
			display: "Quaternary Reference Time Series",
			direction: "downchain",
			//defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily'
		}],
	
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions() }, this); //additional event handler
	},
	
	
	loadAllRequiredTimeseries: function (params) {
		var _this = this;
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")
				&& _.find(this.requiredRelatedTimeseriesConfig, function(ts){
					if (ts.requestId === params.requestId) {
					return true
					} else
						return false
				})
			){
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params.requestId, derivationChains);
			});
		}
		if (this.model.get("selectedTimeSeries") && this.model.get("dateSelection")
				&& _.find(this.optionalRelatedTimeseriesConfig, function(ts){
					if (ts.requestId === params.requestId) {
						return true
						} else
							return false
				})
				) {
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params.requestId, derivationChains);
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
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createComparisonSiteSelector();
		this.createComparisonTimeseriesSelector();
	},
	
	createComparisonSiteSelector: function() {
		var newContainer = $('<div class="aqcu-dv-comparison-site"></div>');
		this.advancedOptionsContainer.append(newContainer);

		this.comparisonStation = new AQCU.view.Select2Field({
			el: '.aqcu-dv-comparison-site',
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
			var _this = this;
			this.loadTimeseriesIdentifiers(
				"comparisonTimeseriesIdentifier",
				{
					stationId: this.model.get("comparisonStation"),
					computationPeriodIdentifier: 'Daily' //Points seems to be applied to non-mean/DV series
				}).done(function(data){
					_this.model.set("comparisonTimeseriesIdentifier" + "FullList", data);
					_this.populateTsSelect("comparisonTimeseriesIdentifier");
				});
		}, this);	
		
	},
	
	//create additional TS Selector
	createComparisonTimeseriesSelector: function() {
		this.comparisonSelect = this.createTimeseriesSelectionBox(
				{
					requestId: "comparisonTimeseriesIdentifier",
					display: "Comparison DV Time Series"
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
		
 		return reportOptions;
	}

});
