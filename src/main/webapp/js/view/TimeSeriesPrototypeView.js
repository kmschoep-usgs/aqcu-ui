/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.TimeSeriesPrototypeView = AQCU.view.BaseView.extend({
	templateName: 'time-series-prototype',
	MIN_SITE_NUMBER_LENGTH: 5,
       
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
		'click #time-series-back': "goHome",
		'click .time-series-report-download-button': "startDownloadPdf",
		'click .time-series-report-preview-button': "startDownloadHtml"
	},
	initialize: function() {
		this.model = new Backbone.Model({search_site_no:""});
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
	},
	
	afterRender: function() {
		this.ajaxCalls = {}; //used to cancel in progress ajax calls if needed
		this.buildFields();
		this.stickit();
	},

	/**
	* Use widgets to generate input fields, also build up
	* bindings object to link these generated input fields to the search model.
	*/
	buildFields: function() {
		this.bindings = {};
		this.generateReportTypeSelect();
		this.generateTimeSeriesDateRangeInput();
		this.generateTimeSeriesWaterYearInput();
		this.generateTimeSeriesIdentifierFields();
		this.generateTimeSeriesSiteSearch();
		
		//consolidate UI bindings
		this.listenTo(this.model, "change:search_site_no", this.populateSiteSelect);	
		this.listenTo(this.model, "change:search_comp_site_no", this.populateComparisonSiteSelect);	
		
		var updateRatingModel = function(m, v) {
			var timeRange = this.getTimeParams();
			if(v && (timeRange.waterYear || (timeRange.startDate && timeRange.endDate))) {
				this.setRatingModel({
					timeSeriesIdentifier: v,
					startDate: timeRange.startDate,
					endDate: timeRange.endDate,
					waterYear: timeRange.waterYear
				});
			}
		};
		this.listenTo(this.model, "change:primaryTimeseriesIdentifier", updateRatingModel);	
		this.listenTo(this.model, "change:primaryTimeseriesIdentifier", this.setOtherDefaults);	
		this.listenTo(this.model, "change:secondaryTimeseriesIdentifier", updateRatingModel);	
		
		this.listenTo(this.model, "change:select_site_no", this.populateTimeSeriesIdentifiers);		
		this.listenTo(this.model, "change:water_year", this.populateTimeSeriesIdentifiers);		
		this.listenTo(this.model, "change:time_series_date_range", this.populateTimeSeriesIdentifiers);		

		this.listenTo(this.model, "change:select_comp_site_no", this.populateComparisonIdentifiers);
		this.listenTo(this.model, "change:water_year", this.populateComparisonIdentifiers);		
		this.listenTo(this.model, "change:time_series_date_range", this.populateComparisonIdentifiers);
	},
	
	/**
	* Helper function, generates NwisDateRange inputs.
	*/
	generateTimeSeriesDateRangeInput: function() {
		var dateRange = new AQCU.view.NwisDateRange({
			searchModel: this.model,
			fieldConfig: {
				fieldName : "time_series_date_range",
				displayName : "Date Range (yyyymmdd)",
				description : "Enter desired date range to search for Time Series information"
			},
			renderTo: this.$('.range')
		});
		$.extend(this.bindings, dateRange.getBindingConfig());
	},
	
	/**
	* Helper function, generates text inputs.
	*/
	generateTimeSeriesWaterYearInput: function() {
		var textField = new AQCU.view.TextField({
			searchModel: this.model,
			fieldConfig: {
				fieldName : "water_year",
				displayName : "Water Year (yyyy)",
				description : "Enter Water Year."
			},
			renderTo: this.$('.year')
		});
		$.extend(this.bindings, textField.getBindingConfig());
	},
	
	/**
	* Helper function, generates text input and select form.
	* Also, listen for changes on text input to populate select form.
	*/
	generateTimeSeriesSiteSearch: function() {
		var	searchField = new AQCU.view.TextField({
			searchModel: this.model,
			fieldConfig: {
				fieldName : "search_site_no",
				displayName : "Site Number Search and Select",
				placeHolderText: "Search by site number",
				description : "Enter at least " + this.MIN_SITE_NUMBER_LENGTH + " digits of a site number to locate a site.  The result will display in the drop down below for selection."
			},
			renderTo: this.$('.site-search')
		});
		$.extend(this.bindings, searchField.getBindingConfig());
		
		var	select = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "select_site_no",
				displayName : "",
				description : ""
			},
			renderTo: this.$('.site-select'),
			startHidden: false
		});
		$.extend(this.bindings, select.getBindingConfig());
		this.siteSelect = select;
		
		var	comparisonSearchField = new AQCU.view.TextField({
			searchModel: this.model,
			fieldConfig: {
				fieldName : "search_comp_site_no",
				displayName : "Site Number Search and Select",
				placeHolderText: "Search by site number",
				description : "Enter at least " + this.MIN_SITE_NUMBER_LENGTH + " digits of a site number to locate a site.  The result will display in the drop down below for selection."
			},
			renderTo: this.$('.comp-site-search')
		});
		$.extend(this.bindings, comparisonSearchField.getBindingConfig());
		
		var	comparisonSelect = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "select_comp_site_no",
				displayName : "",
				description : ""
			},
			renderTo: this.$('.comp-site-select'),
			startHidden: false
		});
		$.extend(this.bindings, comparisonSelect.getBindingConfig());
	},
	
	generateTimeSeriesIdentifierFields : function() {
		var	primaryTimeseriesIdentifier  = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "primaryTimeseriesIdentifier",
				displayName : "Primary Timeseries",
				description : "Select a Primary Timeseries to use in report."
			},
			renderTo: this.$('.primary-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, primaryTimeseriesIdentifier.getBindingConfig());
		this.primaryTimeseriesIdentifier  = primaryTimeseriesIdentifier;
		
		var	comparisonTimeseriesIdentifier  = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "comparisonTimeseriesIdentifier",
				displayName : "Comparison Timeseries",
				description : "Select a Comparison Timeseries to use in report."
			},
			renderTo: this.$('.comparison-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, comparisonTimeseriesIdentifier.getBindingConfig());
		this.comparisonTimeseriesIdentifier  = comparisonTimeseriesIdentifier;
		
		var	secondaryTimeseriesIdentifier  = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "secondaryTimeseriesIdentifier",
				displayName : "Secondary Timeseries",
				description : "Select a Secondary Timeseries to use in report."
			},
			renderTo: this.$('.secondary-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, secondaryTimeseriesIdentifier.getBindingConfig());
		this.secondaryTimeseriesIdentifier  = secondaryTimeseriesIdentifier;
		
		var	upchainTimeseriesIdentifier   = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "upchainTimeseriesIdentifier",
				displayName : "Upchain Timeseries",
				description : "Select a Upchain Timeseries to use in report."
			},
			renderTo: this.$('.upchain-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, upchainTimeseriesIdentifier.getBindingConfig());
		this.upchainTimeseriesIdentifier   = upchainTimeseriesIdentifier;
		
		var	derivedMeanTimeseriesIdentifier  = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "derivedMeanTimeseriesIdentifier",
				displayName : "Derived Mean Timeseries",
				description : "Select a Derived Mean Timeseries to use in report."
			},
			renderTo: this.$('.derived-mean-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, derivedMeanTimeseriesIdentifier.getBindingConfig());
		this.derivedMeanTimeseriesIdentifier  = derivedMeanTimeseriesIdentifier;
		
		var	derivedMaxTimeseriesIdentifier  = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "derivedMaxTimeseriesIdentifier",
				displayName : "Derived Max Timeseries",
				description : "Select a Derived Max Timeseries to use in report."
			},
			renderTo: this.$('.derived-max-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, derivedMaxTimeseriesIdentifier.getBindingConfig());
		this.derivedMaxTimeseriesIdentifier  = derivedMaxTimeseriesIdentifier;
		
		var	derivedMinTimeseriesIdentifier  = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "derivedMinTimeseriesIdentifier",
				displayName : "Derived Min Timeseries",
				description : "Select a Derived Min Timeseries to use in report."
			},
			renderTo: this.$('.derived-min-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, derivedMinTimeseriesIdentifier.getBindingConfig());
		this.derivedMinTimeseriesIdentifier  = derivedMinTimeseriesIdentifier;
		
		var	ratingModelIdentifier  = new AQCU.view.TextField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "ratingModelIdentifier",
				readOnly: "readonly",
				displayName : "Rating Model",
				description : "The rating model will be derived from the selected Discharge Timeseries",
				placeHolderText: "Rating model will be auto-populated"
			},
			renderTo: this.$('.rating-model-identifier'),
			startHidden: false
		});
		$.extend(this.bindings, ratingModelIdentifier.getBindingConfig());
		this.ratingModelIdentifier  = ratingModelIdentifier;
	},
	
	generateReportTypeSelect : function() {
		var	select = new AQCU.view.SelectField({
			router: this.router,
			searchModel: this.model,
			fieldConfig: {
				fieldName : "report_type",
				displayName : "Report Type",
				description : "Select the report you wish to create"
			},
			renderTo: this.$('.report-select'),
			startHidden: false
		});
		$.extend(this.bindings, select.getBindingConfig());
		this.reportSelect = select;
		var reportSelect = this.reportSelect;
		var reportTypeField = this.$(".vision_select_field_report_type");
		reportTypeField.addClass("nwis-loading-indicator");
		$.ajax({
			url: AQCU.constants.serviceEndpoint + "/service/lookup/report/types",
			timeout: 120000,
			dataType: "json",
			data: {},
			context: this,
			success: function(data) {
				reportTypeField.removeClass("nwis-loading-indicator");
				var reportList = [];
				for(var opt in data) {
					reportList.push({ KeyValue: opt, DisplayValue: data[opt]});
				}
				reportSelect.setSelectOptions(reportList);
				reportSelect.updateSelectedOption();
			},
			error: $.proxy(this.router.unknownErrorHandler, this.router)
		});
	},
	
	/**
	* When the search input field contains enough characters, use the input
	* to populate the select form.
	*/
	populateSiteSelect: function() {
		var val = this.model.get("search_site_no");
		if (val.length >= this.MIN_SITE_NUMBER_LENGTH) {
			this.abortAjax(this.ajaxCalls.sites);
			this.ajaxCalls.sites = this.loadOptionsSiteSelect({"sitefile.site_no.like.varchar.trim": '%'+val+'%'}, 'select_site_no');
		} else {
			var dispDialog = function($div) {
				$div.dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			};
			dispDialog($("#dialog-criteria-problem-site-number"));
		}
	},
	
	populateComparisonSiteSelect: function() {
		var val = this.model.get("search_comp_site_no");
		if (val.length >= this.MIN_SITE_NUMBER_LENGTH) {
			this.abortAjax(this.ajaxCalls.compSites);
			this.ajaxCalls.compSites = this.loadOptionsSiteSelect({"sitefile.site_no.like.varchar.trim": '%'+val+'%'}, 'select_comp_site_no');
		} else {
			var dispDialog = function($div) {
				$div.dialog({
					modal: true,
					buttons: {
						Ok: function() {
							$(this).dialog("close");
						}
					}
				});
			};
			dispDialog($("#dialog-criteria-problem-site-number"));
		}
	}, 
	
	/**
	* Triggers an ajax call to load the select
	* @param params
	*/
	loadOptionsSiteSelect: function(param, targetField) {
		var selectField = this.$(".vision_select_field_" + targetField);
		
		//remove all current options
		selectField.find('option').each(function() {
			$(this).remove();
		});

		selectField.addClass("nwis-loading-indicator");
		return $.ajax({
			url: "service/nwisra/report/SiteInformation/json?",
			timeout: 120000,
			dataType: "json",
			data: param,
			context: this,
			success: function(data) {
				selectField.append('<option value="">Not selected</option>');
				for (var i = 0; i < data.records.length; i++) {
					selectField.append('<option value="' + data.records[i].SITE_NO + '">' + data.records[i].SITE_NO + " - " + data.records[i].STATION_NM + '</option>');
				}
				selectField.removeClass("nwis-loading-indicator");
			},
			error: $.proxy(this.router.unknownErrorHandler, this.router)
		});
	},
	
	abortAjax : function(ajaxCall) {
		if(ajaxCall && ajaxCall.abort) {
			ajaxCall.abort();
		} 
	},
	
	clearTimeSeriesSelectBoxes: function() {
		this.model.set({
			"primaryTimeseriesIdentifier" : "",
			"secondaryTimeseriesIdentifier" : "",
			"upchainTimeseriesIdentifier" : "",
			"derivedMeanTimeseriesIdentifier" : "",
			"derivedMaxTimeseriesIdentifier" : "",
			"derivedMinTimeseriesIdentifier" : "",
			"ratingModelIdentifier" : ""
		});
		
		this.primaryTimeseriesIdentifier.removeSelectOptions();
		this.secondaryTimeseriesIdentifier.removeSelectOptions();
		this.upchainTimeseriesIdentifier.removeSelectOptions();
		this.derivedMeanTimeseriesIdentifier.removeSelectOptions();
		this.derivedMaxTimeseriesIdentifier.removeSelectOptions();
		this.derivedMinTimeseriesIdentifier.removeSelectOptions();
	},
	
	populateTimeSeriesIdentifiers : function() {
		this.clearTimeSeriesSelectBoxes();
		var _this = this;
		var stationId = this.model.get("select_site_no");
		var timeRange = this.getTimeParams();
		if(stationId && (timeRange.waterYear || (timeRange.endDate && timeRange.startDate))) {
			stationId = stationId.trim();
			this.abortAjax(this.ajaxCalls.primary);
			this.ajaxCalls.primary = this.loadTimeSeriesIdentifiers({ stationId: stationId, fieldName: 'primaryTimeseriesIdentifier', 
				publish: 'true',
				computationIdentifier: 'Unknown',
				computationPeriodIdentifier: 'Unknown'}
				);
			
			this.abortAjax(this.ajaxCalls.secondary);
			this.ajaxCalls.secondary = this.loadTimeSeriesIdentifiers({ stationId: stationId, fieldName: 'secondaryTimeseriesIdentifier', publish: 'true',
				computationIdentifier: 'Unknown',
				computationPeriodIdentifier: 'Unknown'}
				);
			
			this.abortAjax(this.ajaxCalls.upchain);
			this.ajaxCalls.upchain = this.loadTimeSeriesIdentifiers({ stationId: stationId, fieldName: 'upchainTimeseriesIdentifier', publish: 'true',
				computationIdentifier: 'Unknown',
				computationPeriodIdentifier: 'Unknown'});
			
			this.abortAjax(this.ajaxCalls.derivedMean);
			this.ajaxCalls.derivedMean = this.loadTimeSeriesIdentifiers({ 
				stationId: stationId, 
				fieldName: 'derivedMeanTimeseriesIdentifier', 
				computationPeriodIdentifier: 'Daily', 
				computationIdentifier: 'Mean'
			});

			this.abortAjax(this.ajaxCalls.derivedMax);
			this.ajaxCalls.derivedMax = this.loadTimeSeriesIdentifiers({ 
				stationId: stationId, 
				fieldName: 'derivedMaxTimeseriesIdentifier', 
				computationPeriodIdentifier: 'Daily', 
				computationIdentifier: 'Max'
			});

			this.abortAjax(this.ajaxCalls.derivedMin);
			this.ajaxCalls.derivedMin = this.loadTimeSeriesIdentifiers({ 
				stationId: stationId, 
				fieldName: 'derivedMinTimeseriesIdentifier', 
				computationPeriodIdentifier: 'Daily', 
				computationIdentifier: 'Min'
			});
			
			$.when(this.ajaxCalls.primary, this.ajaxCalls.secondary, this.ajaxCalls.upchain, this.ajaxCalls.derivedMean, this.ajaxCalls.derivedMax, this.ajaxCalls.derivedMin
			).then(function( data, textStatus, jqXHR ) { _this.setDefaultPrimary() });
		}
	},
	
	populateComparisonIdentifiers : function() {
		this.model.set({
			"comparisonTimeseriesIdentifier" : ""
		});

		this.comparisonTimeseriesIdentifier.removeSelectOptions();
		
		var _this = this;
		var stationId = this.model.get("select_comp_site_no");
		var timeRange = this.getTimeParams();
		if(stationId && (timeRange.waterYear || (timeRange.endDate && timeRange.startDate))) {
			stationId = stationId.trim();
			this.abortAjax(this.ajaxCalls.comparison);
			this.ajaxCalls.comparison = this.loadTimeSeriesIdentifiers({ stationId: stationId, fieldName: 'comparisonTimeseriesIdentifier', primary: 'true', publish: 'true',
				computationIdentifier: 'Unknown',
				computationPeriodIdentifier: 'Unknown'}
				);
			$.when(this.ajaxCalls.primary, this.ajaxCalls.secondary, this.ajaxCalls.upchain, this.ajaxCalls.derivedMean, this.ajaxCalls.derivedMax, this.ajaxCalls.derivedMin
			).then(function( data, textStatus, jqXHR ) { _this.setDefaultPrimaryForComparison() });
		}
	},
	
	setDefaultPrimary: function() {
		var stationId = this.model.get("select_site_no").trim();
		var dischargeField = this.$(".vision_select_field_primaryTimeseriesIdentifier");

		//load spinners and disable fields while we load
		dischargeField.addClass("nwis-loading-indicator");
		dischargeField.prop("disabled", "disabled");
		
		var _this = this;
		this.abortAjax(this.ajaxCalls.primaryDisc);
		this.ajaxCalls.primaryDisc = this.lookupTimeSeriesIdentifiers({
				stationId: stationId,
				parameter: "Discharge",
				primary: "true",
				computationIdentifier: "Unknown", //Unknown seems to be applied to non-mean/DV series
				computationPeriodIdentifier: "Unknown" //Unknown seems to be applied to non-mean/DV series
			}, function(data) {
				dischargeField.removeClass("nwis-loading-indicator"); 
				dischargeField.prop("disabled", false);
				
				if(_.size(data) > 0) {
					var primaryDischargeId = Object.keys(data)[0];
					this.model.set("primaryTimeseriesIdentifier", primaryDischargeId);
					_this.primaryTimeseriesIdentifier.updateSelectedOption();
				}
			},
			function() { 
				dischargeField.removeClass("nwis-loading-indicator"); 
				dischargeField.prop("disabled", false);
			});
	},
	
	setDefaultPrimaryForComparison: function() {
		this.model.set({
			"comparisonTimeseriesIdentifier" : ""
		});
		
		var stationId = this.model.get("select_comp_site_no").trim();
		var comparisonTsField = this.$(".vision_select_field_comparisonTimeseriesIdentifier");

		//load spinners and disable fields while we load
		comparisonTsField.addClass("nwis-loading-indicator");
		comparisonTsField.prop("disabled", "disabled");
		
		var _this = this;
		this.abortAjax(this.ajaxCalls.primaryDisc);
		this.ajaxCalls.primaryDisc = this.lookupTimeSeriesIdentifiers({
				stationId: stationId,
				parameter: "Discharge",
				primary: "true",
				computationIdentifier: "Unknown", //Unknown seems to be applied to non-mean/DV series
				computationPeriodIdentifier: "Unknown" //Unknown seems to be applied to non-mean/DV series
			}, function(data) {
				comparisonTsField.removeClass("nwis-loading-indicator"); 
				comparisonTsField.prop("disabled", false);
				
				if(data[0]) {
					var comparisonDischargeId = data[0];
					this.model.set("comparisonTimeseriesIdentifier", comparisonDischargeId);
					_this.comparisonTimeseriesIdentifier.updateSelectedOption();
				}
			},
			function() { 
				comparisonTsField.removeClass("nwis-loading-indicator"); 
				comparisonTsField.prop("disabled", false);
			});
	},
	
	setOtherDefaults : function() {
		var _this = this;
		var primaryDischargeId = this.model.get("primaryTimeseriesIdentifier");
		var timeRange = this.getTimeParams();
		
		//find gage height up derivation chain
		this.abortAjax(this.ajaxCalls.upchainStage);

		var upchainField = this.$(".vision_select_field_upchainTimeseriesIdentifier");
		upchainField.addClass("nwis-loading-indicator");
		upchainField.prop("disabled", "disabled");
		this.ajaxCalls.upchainStage = this.findIdentifiersInDerivationChain({
				timeSeriesIdentifier: primaryDischargeId,
				direction: "upchain",
				publish: 'true',
				computationIdentifier: 'Unknown',
				computationPeriodIdentifier: 'Unknown',
				startDate: timeRange.startDate,
				endDate: timeRange.endDate,
				waterYear: timeRange.waterYear
			}, function(data) {
				upchainField.removeClass("nwis-loading-indicator");
				upchainField.prop("disabled", false);
				if(data[0]) {
					_this.model.set("upchainTimeseriesIdentifier", data[0]);
					_this.upchainTimeseriesIdentifier.updateSelectedOption();
				}
			},
			function() { 
				upchainField.removeClass("nwis-loading-indicator");
				upchainField.prop("disabled", false);
			}
		);
		
		this.abortAjax(this.ajaxCalls.downchainMean);
		var derivedMeanField = this.$(".vision_select_field_derivedMeanTimeseriesIdentifier");
		derivedMeanField.addClass("nwis-loading-indicator");
		derivedMeanField.prop("disabled", "disabled");
		this.ajaxCalls.downchainMean = this.findIdentifiersInDerivationChain({
				timeSeriesIdentifier: primaryDischargeId,
				direction: "downchain",
				publish: 'true',
				computationIdentifier: 'Mean',
				computationPeriodIdentifier: 'Daily',
				startDate: timeRange.startDate,
				endDate: timeRange.endDate,
				waterYear: timeRange.waterYear
			}, function(data) {
				derivedMeanField.removeClass("nwis-loading-indicator");
				derivedMeanField.prop("disabled", false);
				if(data[0]) {
					_this.model.set("derivedMeanTimeseriesIdentifier", data[0]);
					_this.derivedMeanTimeseriesIdentifier.updateSelectedOption();
				}
			},
			function() { 
				derivedMeanField.removeClass("nwis-loading-indicator"); 
				derivedMeanField.prop("disabled", false);
			}
		);
		
		this.abortAjax(this.ajaxCalls.downchainMax);
		var derivedMaxField = this.$(".vision_select_field_derivedMaxTimeseriesIdentifier");
		derivedMaxField.addClass("nwis-loading-indicator");
		derivedMaxField.prop("disabled", "disabled");
		this.ajaxCalls.downchainMax = this.findIdentifiersInDerivationChain({
				timeSeriesIdentifier: primaryDischargeId,
				direction: "downchain",
				publish: 'true',
				computationIdentifier: 'Max',
				computationPeriodIdentifier: 'Daily',
				startDate: timeRange.startDate,
				endDate: timeRange.endDate,
				waterYear: timeRange.waterYear
			}, function(data) {
				derivedMaxField.removeClass("nwis-loading-indicator");
				derivedMaxField.prop("disabled", false);
				if(data[0]) {
					_this.model.set("derivedMaxTimeseriesIdentifier", data[0]);
					_this.derivedMaxTimeseriesIdentifier.updateSelectedOption();
				}
			},
			function() { 
				derivedMaxField.removeClass("nwis-loading-indicator"); 
				derivedMaxField.prop("disabled", false);
			}
		);
		
		this.abortAjax(this.ajaxCalls.downchainMin);
		var derivedMinField = this.$(".vision_select_field_derivedMinTimeseriesIdentifier");
		derivedMinField.addClass("nwis-loading-indicator");
		derivedMinField.prop("disabled", "disabled");
		this.ajaxCalls.downchainMin = this.findIdentifiersInDerivationChain({
				timeSeriesIdentifier: primaryDischargeId,
				direction: "downchain",
				publish: 'true',
				computationIdentifier: 'Min',
				computationPeriodIdentifier: 'Daily',
				startDate: timeRange.startDate,
				endDate: timeRange.endDate,
				waterYear: timeRange.waterYear
			}, function(data) {
				derivedMinField.removeClass("nwis-loading-indicator");
				derivedMinField.prop("disabled", false);
				if(data[0]) {
					_this.model.set("derivedMinTimeseriesIdentifier", data[0]);
					_this.derivedMinTimeseriesIdentifier.updateSelectedOption();
				}
			},
			function() { 
				derivedMinField.removeClass("nwis-loading-indicator"); 
				derivedMinField.prop("disabled", false);
			}
		);
	},
	
	/**
	* Triggers an ajax call to load the select
	* @param params
	*/
	loadTimeSeriesIdentifiers: function(param, callback) {
		var selectField = this.$(".vision_select_field_" + param.fieldName);
		
		//remove all current options
		this.model.set(param.fieldName, "");
		selectField.find('option').each(function() {
			$(this).remove();
		});

		var mySelectField = this.$(".vision_select_field_" + param.fieldName);
		mySelectField.addClass("nwis-loading-indicator");
		var _this = this;
		var _callback = function(data) {
			selectField.append('<option value="">Not selected</option>');
			
			var sortedArray=[];
			for(var opt in data){
				sortedArray.push([opt,data[opt]]);
			}
			sortedArray.sort(function(a,b){
				if(a[1].identifier > b[1].identifier) {
					return 1;
				} else if(a[1].identifier < b[1].identifier) {
					return -1;
				} else {
					return 0;
				}
			});
			
			for (var i = 0; i < sortedArray.length; i++) {
				selectField.append('<option value="' + sortedArray[i][0] + '">' + sortedArray[i][1].identifier + '</option>');
			}
			_this.$(".vision_select_field_" + param.fieldName).removeClass("nwis-loading-indicator");
			if(callback) {
				callback();
			}
		};
		return this.lookupTimeSeriesIdentifiers(param, _callback, function() {
			mySelectField.removeClass("nwis-loading-indicator");
			_this.displayErrorWindow("Could not find timeseries identifiers", "The chosen site may not have a timeseries associated with it.");
		});
	},
	
	lookupTimeSeriesIdentifiers: function(param, callback, failCallback){
		return $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/timeseries/identifiers",
			timeout: 120000,
			dataType: "json",
			data: param,
			context: this,
			success: callback,
			error: function() {
				if(failCallback) {
					failCallback();
				}
			}
		});
	},
	
	findIdentifiersInDerivationChain: function(param, callback, failCallback){
		//do not send empty params
		for(var k in param) {
			if(param[k] === null || param[k] === '') {
				delete param[k];
			}
		}
		
		return $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/derivationChain/find",
			timeout: 120000,
			dataType: "json",
			data: param,
			context: this,
			success: callback,
			error: function() {
				if(failCallback) {
					failCallback();
				}
			}
		});
	},
	
	setRatingModel: function(ajaxParams){
		var ratingModelIdentifier = this.$(".vision_field_ratingModelIdentifier");
		this.model.set("ratingModelIdentifier", "");
		ratingModelIdentifier.addClass("nwis-loading-indicator");
		
		//do not send null params
		for(var k in ajaxParams) {
			if(ajaxParams[k] === null || ajaxParams[k] === '') {
				delete ajaxParams[k];
			}
		}
		
		var _this = this;
		this.abortAjax(this.ajaxCalls.ratingModel);
		this.ajaxCalls.ratingModel = $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/derivationChain/ratingModel",
			timeout: 120000,
			dataType: "json",
			data: ajaxParams,
			context: this,
			success: function(data){
				ratingModelIdentifier.removeClass("nwis-loading-indicator");
				if(data && data[0]) {
					_this.model.set("ratingModelIdentifier", data[0]);
				}
			},
			error: function() {
				ratingModelIdentifier.removeClass("nwis-loading-indicator");
				_this.displayErrorWindow("Could not find Rating Model", "The chosen Discharge Timeseries may not have a Rating Model associated with it.");
			}
		});
	},

	startDownload: function(isHtml) {
		if (this.validateParameters()) {			
			var params = this.getQueryParameters();
			var reportType = this.model.get("report_type").trim();
			this.router.startDownload(AQCU.constants.serviceEndpoint + "/service/reports/" + reportType + (!isHtml ? "/download" : ""), params, "");
		}
	},
	
	startDownloadHtml: function() {
		this.startDownload(true);
	},	
	startDownloadPdf: function() {
		this.startDownload(false);
	},
	
	displayErrorWindow: function(title, message) {
		var _this = this;
		new AQCU.view.PopupView({
			title: title,
			message: message,
			callback: function() {
			}
		});
	},
	
	/**
	* Helper function, validates report criteria
	* 
	* @returns boolean 
	*/
	validateParameters: function() {
		var reportType = this.model.get("report_type");
		var site = this.model.get("select_site_no");
		var timeParams = this.getTimeParams();
		var fromDate = timeParams.startDate;
		var toDate = timeParams.endDate;
		var waterYear = this.model.get("water_year");
		var primaryTimeseriesIdentifier = this.model.get("primaryTimeseriesIdentifier");
		
		var dispDialog = function($div) {
			$div.dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$(this).dialog("close");
					}
				}
			});
		};
		
		if (site) {
			if (fromDate && waterYear) {
				dispDialog($("#dialog-criteria-problem-date"));
				return false;
			}
			else if (fromDate){
				if (!toDate) {
					dispDialog($("#dialog-criteria-problem-date-range"));									
					return false;
				}
			}
			else if (!waterYear) {
				dispDialog($("#dialog-criteria-problem-date"));								
				return false;
			}
		} else {
			dispDialog($("#dialog-criteria-problem-site-missing"));			
			return false;
		}
		
		if(!primaryTimeseriesIdentifier) {
			dispDialog($("#dialog-criteria-problem-timeseries-info"));
			return false;
		}

		if(!reportType) {
			dispDialog($("#dialog-criteria-problem-report-type"));
			return false;
		}
		
		return true;
	},
	
	getTimeParams : function() {
		var criteria = {};
		var rawRange = this.model.get("time_series_date_range") || "";
		var range = rawRange.split(",");
		var fromDate = range[0];
		var toDate = range.length > 1 ? range[1] : "";
		var waterYear = this.model.get("water_year");
		
		if (fromDate) {
			var fromYY = fromDate.toString().substr(0,4);
			var fromMM = fromDate.toString().substr(4,2);
			var fromDD = fromDate.toString().substr(6,2);
			var fromObj = new Date(fromYY, fromMM-1, fromDD, 0, 0, 0, 0);
			var fromISO = fromObj.toISOString();
			var toYY = toDate.toString().substr(0,4);
			var toMM = toDate.toString().substr(4,2);
			var toDD = toDate.toString().substr(6,2);
			var toObj = new Date(toYY, toMM-1, toDD, 0, 0, 0, 0);
			var toISO = toObj.toISOString();
			var fromDateParam = {
					startDate: fromISO
			}
			$.extend(criteria, fromDateParam);			
			var toDateParam = {
					endDate: toISO
			}
			$.extend(criteria, toDateParam);			
		}
		else {
			var waterYearParam = {
					waterYear: waterYear
			}
			$.extend(criteria, waterYearParam);				
		}
		
		return criteria;
	},
	
	/**
	* Helper function, extracts the report criteria and
	* builds objects.
	* 
	* @returns JSON object with all report parameters
	*/
	getQueryParameters: function() {
		var criteria = {};
		var site = this.model.get("select_site_no").trim();

		var siteParam = {
				station: site
		};
		$.extend(criteria, siteParam);
		
		criteria.primaryTimeseriesIdentifier = this._getTimeSeriesId("primaryTimeseriesIdentifier");
		criteria.secondaryTimeseriesIdentifier = this._getTimeSeriesId("secondaryTimeseriesIdentifier");
		criteria.upchainTimeseriesIdentifier = this._getTimeSeriesId("upchainTimeseriesIdentifier");
		criteria.derivedMeanTimeseriesIdentifier =  this._getTimeSeriesId("derivedMeanTimeseriesIdentifier");
		criteria.derivedMaxTimeseriesIdentifier =  this._getTimeSeriesId("derivedMaxTimeseriesIdentifier");
		criteria.derivedMinTimeseriesIdentifier =  this._getTimeSeriesId("derivedMinTimeseriesIdentifier");
		criteria.ratingModelIdentifier =  this._getTimeSeriesId("ratingModelIdentifier");

		criteria.comparisonTimeseriesIdentifier = this.model.get("comparisonTimeseriesIdentifier") ? this.model.get("comparisonTimeseriesIdentifier") : null;;
		criteria.comparisonStation =  this.model.get("select_comp_site_no") ? this.model.get("select_comp_site_no").trim() : null;
		
		$.extend(criteria, this.getTimeParams());

		return criteria;
	},
	
	_getTimeSeriesId: function(tsId) {
		return this.model.get(tsId) ? this.model.get(tsId) : null;
	}
});