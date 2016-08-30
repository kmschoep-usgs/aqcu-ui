AQCU.view.UvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "UV Hydrograph", 
	reportAbbreviation: "UV",
	reportType: "uvhydrograph",
	relatedTimeseriesConfig: [{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Time Series",
			direction: "upchain",
			required: true,
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points'
		},{
			requestId: "referenceTimeseriesIdentifier",
			display: "Reference Time Series",
			direction: "downchain",
			required: false,
			publish: 'true',
			computation: 'Instantaneous',
			period: 'Points',
			skipAutoLoad: true
		},{
			requestId: "derivedMeanTimeseriesIdentifier",
			display: "Daily Mean",
			direction: "downchain",
			required: false,
			publish: 'true',
			computation: 'Mean',
			period: 'Daily'
		},{
			requestId: "derivedMaxTimeseriesIdentifier",
			display: "Daily Max",
			direction: "downchain",
			required: false,
			publish: 'true',
			computation: 'Max',
			period: 'Daily'
		},{
			requestId: "derivedMinTimeseriesIdentifier",
			display: "Daily Min",
			direction: "downchain",
			required: false,
			publish: 'true',
			computation: 'Min',
			period: 'Daily'
		},{
			requestId: "derivedMedianTimeseriesIdentifier",
			display: "Daily Median",
			direction: "downchain",
			required: false,
			publish: 'true',
			computation: 'Median',
			period: 'Daily'
	}],
	ratingModels: [{ 
			requestId: "ratingModelIdentifier", 
			display: "Primary Rating Model", 
			required: false,
			bindTo: "primaryTimeseriesIdentifier"
		},{ 
			requestId: "secondaryRatingModelIdentifier", 
			display: "Secondary Rating Model", 
			required: false,
			bindTo: "referenceTimeseriesIdentifier"
	}],
	
	initialize: function() {
		AQCU.view.BaseReportView.prototype.initialize.apply(this, arguments);
		this.model.bind("change:selectedTimeSeries", function() { this.loadAllTimeSeriesOptions(); }, this); //additional event handler
	},
	
	updateRequiredTimeseries: function() {
		//Make upchain optional if this is not a discharge UV Hydro
		if(!this.model.get("selectedTimeSeries").parameter.toLowerCase().includes("discharge")) {
			_.find(this.relatedTimeseriesConfig, function(obj) {return obj.requestId === "upchainTimeseriesIdentifier";}).required = false;
		} else {
			_.find(this.relatedTimeseriesConfig, function(obj) {return obj.requestId === "upchainTimeseriesIdentifier";}).required = true;
		}
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
				) {
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params.requestId, derivationChains);
			});
		}
	},
	
	loadAllTimeSeriesOptions : function() {
		if(this.model.get("site")) {
			AQCU.view.BaseReportView.prototype.loadAllTimeSeriesOptions.apply(this, arguments);
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
	
	buildAdvancedOptions: function() {
		this.updateRequiredTimeseries();
		
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createComparisonSiteSelector();
		this.createComparisonTimeseriesSelector();
	},
	
	validate: function() {
		this.updateRequiredTimeseries();
		
		return AQCU.view.BaseReportView.prototype.validate.apply(this, arguments);;
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
			var _this = this;
			this.loadTimeseriesIdentifiers(
				"comparisonTimeseriesIdentifier",
				{
					stationId: this.model.get("comparisonStation"),
					computationIdentifier: 'Instantaneous', //Instantaneous seems to be applied to non-mean/DV series
					computationPeriodIdentifier: 'Points' //Points seems to be applied to non-mean/DV series
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