AQCU.view.DvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "DV Hydrograph", 
	reportAbbreviation: "DV",
	reportType: "dvhydrograph",
	relatedTimeseriesConfig: [{
			requestId: "firstDownChainIdentifier",
			display: "Stat Derived Time Series 1",
			direction: "downchain",
			required: false,
			dummyForName: true,
			defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "secondDownChainIdentifier",
			display: "Stat Derived Time Series 2",
			direction: "downchain",
			required: false,
			dummyForName: true,
			defaultComputation: "Max",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "thirdDownChainIdentifier",
			display: "Stat Derived Time Series 3",
			direction: "downchain",
			required: false,
			dummyForName: true,
			defaultComputation: "Min",
			publish: 'true',
			period: 'Daily',
			dynamicParameter: 'true'
		}, {
			requestId: "secondaryReferenceIdentifier",
			display: "Secondary Reference Time Series",
			direction: "downchain",
			required: false,
			//defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily'
		}, {
			requestId: "tertiaryReferenceIdentifier",
			display: "Tertiary Reference Time Series",
			direction: "downchain",
			required: false,
			//defaultComputation: "Mean",
			publish: 'true',
			period: 'Daily'
		}, {
			requestId: "quaternaryReferenceIdentifier",
			display: "Quaternary Reference Time Series",
			direction: "downchain",
			required: false,
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
				&& _.find(this.relatedTimeseriesConfig, function(ts){
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
		this.createZeroNegativeExclusionSelector();
		this.createExcludeMinMaxSelector();
	},
	
	//create exclude delete corrections filter
	createZeroNegativeExclusionSelector: function() {
		var excludeCorrectionField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='excludeZeroNegative'>Zero/Negative Values</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='excludeZeroNegative' name='excludeZeroNegative' type='checkbox'>Exclude Zero/Negative Values</label>" +
				"</div>" +
				
				"</div></div></div>");//not sure this warrants using a template YET
		this.model.set("excludeZeroNegative", false);
		$.extend(this.bindings, {
			".excludeZeroNegative" : "excludeZeroNegative"
		});
		this.advancedOptionsContainer.append(excludeCorrectionField);
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
		
		if(this.model.get("excludeMinMax")){
			reportOptions.excludeMinMax = this.model.get("excludeMinMax");
		}
		
 		return reportOptions;
	}

});
