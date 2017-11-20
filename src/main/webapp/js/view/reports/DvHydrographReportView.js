AQCU.view.DvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "DV Hydrograph", 
	reportAbbreviation: "DV",
	reportType: "dvhydrograph",
	instructions: "At least one stat-derived time series must be specified in the Advanced Report Options.",
	relatedTimeseriesConfig: [{
			requestId: "firstStatDerivedIdentifier",
			display: "Stat Derived Time Series 1",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: "Mean",
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "secondStatDerivedIdentifier",
			display: "Stat Derived Time Series 2",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: "Max",
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "thirdStatDerivedIdentifier",
			display: "Stat Derived Time Series 3",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: "Min",
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "fourthStatDerivedIdentifier",
			display: "Stat Derived Time Series 4",
			direction: "downchain",
			required: false,
			oneOfSeveralRequired: true,
			defaultComputation: 'Median',
			period: 'Daily',
			autofillWithSameUnits: "true"
		},{
			requestId: "firstReferenceIdentifier",
			display: "Reference Time Series 1",
			direction: "downchain",
			required: false,
			//defaultComputation: "Mean",
			period: 'Daily'
		}, {
			requestId: "secondReferenceIdentifier",
			display: "Reference Time Series 2",
			direction: "downchain",
			required: false,
			//defaultComputation: "Mean",
			period: 'Daily'
		}, {
			requestId: "thirdReferenceIdentifier",
			display: "Reference Time Series 3",
			direction: "downchain",
			required: false,
			//defaultComputation: "Mean",
			period: 'Daily'
		}],
	
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions() }, this); //additional event handler
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
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createInstructions();
		this.createComparisonSiteSelector();
		this.createComparisonTimeseriesSelector();
		this.createZeroNegativeExclusionSelector();
                this.createDiscreteExclusionSelector();
		this.createExcludeMinMaxSelector();
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

		if(this.model.get("excludeZeroNegative")) {
			reportOptions.excludeZeroNegative = this.model.get("excludeZeroNegative");
		}
                
                if(this.model.get("excludeDiscrete")) {
			reportOptions.excludeDiscrete = this.model.get("excludeDiscrete");
		}
		
		if(this.model.get("excludeMinMax")){
			reportOptions.excludeMinMax = this.model.get("excludeMinMax");
		}
		
 		return reportOptions;
	}

});
