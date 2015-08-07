AQCU.view.UvHydrographReportView = AQCU.view.BaseReportView.extend({
	reportName: "UV Hydrograph",
	reportType: "swuvhydrograph",
	optionalRelatedTimeseriesConfig: [{
			requestId: "secondaryTimeseriesIdentifier",
			display: "Secondary Time Series",
			direction: "downchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
		},{
			requestId: "upchainTimeseriesIdentifier",
			display: "Upchain Time Series",
			direction: "upchain",
			publish: 'true',
			computation: 'Unknown',
			period: 'Unknown'
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
			computation: 'Minn',
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
	
	removeSelectFields: function() {
		if(this.comparisonSite){
			this.comparisonSite.remove();
		}
		if(this.comparisonSelect) {
			this.comparisonSelect.remove();
		}
		AQCU.view.BaseReportView.prototype.removeSelectFields.apply(this, arguments);
	},
	
	buildAdvancedOptions: function() {
		AQCU.view.BaseReportView.prototype.buildAdvancedOptions.apply(this, arguments);
		this.createComparisonSiteSelector();
		this.createComparisonTimeseriesSelector();
	},
	
	createComparisonSiteSelector: function() {
		var newContainer = $('<div class="aqcu-uv-comparison-site"></div>');
		this.advancedOptionsContainer.append(newContainer);

		this.comparisonSite = new AQCU.view.Select2Field({
			el: '.aqcu-uv-comparison-site',
			model : this.model,
			fieldConfig: {
				fieldName   : "comparisonSite",
				displayName: "Comparison Site",
				description : ""
			},
			select2: {
				placeholder : "Comparison siter",
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
		this.model.bind("change:comparisonSite", this.loadComparisonTimeSeriesList, this);	
	},
	
	createComparisonTimeseriesSelector: function() {
		var newContainer = $("<div>");
		this.comparisonSelect = new AQCU.view.SelectField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : "comparisonTimeseriesIdentifier",
				displayName : "Comparison Time Series",
				description : ""
			},
			renderTo: newContainer,
			startHidden: false
		});
		$.extend(this.bindings, this.comparisonSelect.getBindingConfig());
		this.advancedOptionsContainer.append(newContainer);
	},
	
	loadComparisonTimeSeriesList: function() {
		var siteNumber = this.model.get("comparisonSite");
		if (siteNumber) {
			$.ajax({
				url: AQCU.constants.serviceEndpoint +
						"/service/lookup/timeseries/identifiers",
				timeout: 120000,
				dataType: "json",
				data: {
					stationId: siteNumber,
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
					var timeSeriesList = [];
					for(var i = 0; i < sortedFormattedArray.length; i++) {
						timeSeriesList.push({ KeyValue: sortedFormattedArray[i].uid, DisplayValue: sortedFormattedArray[i].identifier});
					}
					this.comparisonSelect.setSelectOptions(timeSeriesList);
				},
				error: function () {

				}
			});
		}
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