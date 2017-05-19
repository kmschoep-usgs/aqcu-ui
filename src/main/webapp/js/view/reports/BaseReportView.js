AQCU.view.BaseReportView = AQCU.view.BaseView.extend({
	templateName: 'report-card',
	reportName: null, //Display name of report
	reportAbbreviation: null, //short name for reports
	defaultFormat: 'html',
	selectedTimeSeries: null, //array of json objects describing selected timeseries, this array is ordered
	relatedTimeseriesConfig: [], //override this
	ratingModels: [],
	excludedCorrections: [], // if you override with items in reports, you'll have the exclude selector appear
	
	events: {
		'click .report-card-header': 'applyReportOptions'
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.savedReportsController = this.options.savedReportsController;
		
		this.ajaxCalls = {};
		this.bindings = {};
		this.parentModel = this.options.parentModel;
		this.model = new Backbone.Model({
			site: this.parentModel.get("site"),
			selectedTimeSeries: this.options.selectedTimeSeries,
			dateSelection: this.parentModel.get("dateSelection"),
			format: this.defaultFormat
		});
		
		this.parentModel.bind("change:dateSelection", this.updateDateSelection, this);
		this.parentModel.bind("change:site", this.updateSite, this);
		this.model.bind("change:site", function() { this.loadAllTimeSeriesOptions(); }, this);
		this.model.bind("change:dateSelection", this.loadAllRequiredTimeseries, this);
		this.loading = true;
	},
	
	updateDateSelection: function() {
		this.model.set("dateSelection", this.parentModel.get("dateSelection"));
	},
	
	updateSite: function() {
		this.model.set("site", this.parentModel.get("site"));
	},
	
	preRender: function() {
		this.unstickit();
		this.removeSelectFields();
		this.context = {
			reportName: this.reportName,
			reportAbbreviation: this.reportAbbreviation,
			reportType: this.reportType,
			primaryTimeseriesIdentifier: this.model.get("selectedTimeSeries").uid,
			primaryTsLabel: this.model.get("selectedTimeSeries").identifier
		}
	},
	
	afterRender: function() {
		this.hideWarning();
		this.hideLoader();
		this.bindAllRatingModels();
		this.buildAdvancedOptions();
		this.stickit();
		this.loadAllTimeSeriesOptions();
		
		//hook up save button
		$('.add-to-saved-reports').confirmation({
			title: "Add this " + this.reportName + " report to your list?",
			placement: "left",
			onConfirm: $.proxy(this.saveReport, this),
			btnOkLabel: "Yes",
			btnCancelLabel: "No"
			
		});
		
		//this is lame, but this triggers the rating models to load
		this.model.set("primaryTimeseriesIdentifier", null);
		this.model.set("primaryTimeseriesIdentifier", this.options.selectedTimeSeries.uid);
	},
	
	remove: function() {
		this.removeSelectFields();
		AQCU.view.BaseView.prototype.remove.apply(this, arguments);
	},
	
	removeSelectFields: function() {
		for(var key in this.builtSelectorFields){
			this.builtSelectorFields[key].remove();
		}
	},
	
	buildAdvancedOptions: function() {
		this.advancedOptionsContainer = this.$(".adv-options-container");
		this.builtSelectorFields = {};
		this.selectorParams = {};
		
		if(this.relatedTimeseriesConfig.length) {
			this.createPrimaryPublishFilters();
		}
		
		for(var i = 0; i < this.relatedTimeseriesConfig.length; i++) {
			this.createTimeseriesSelectionBox($.extend(this.relatedTimeseriesConfig[i], { baseField: true }));
		}
		
		for(var i = 0; i < this.ratingModels.length; i++) {
			this.createRatingModelDisplay(this.ratingModels[i], true);
		}
	},
	
	createTimeseriesSelectionBox : function(params) {
		var container = this.advancedOptionsContainer;
		
		this.bindToPrimPubFilters(function() { 
			this.populateTsSelect(params.requestId); 
		}, this);
		
		var newContainer = $("<div>");
		this.selectorParams[params.requestId] = params;
		this.builtSelectorFields[params.requestId] = new AQCU.view.SelectField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : params.requestId,
				displayName : params.display + (params.required ? " *" : ""),
				description : ""
			},
			renderTo: newContainer,
			startHidden: false
		});
		$.extend(this.bindings, this.builtSelectorFields[params.requestId].getBindingConfig());
		container.append(newContainer);
		
		return this.builtSelectorFields[params.requestId];
	},
	
	loadAllTimeSeriesOptions : function(callback) {
		var _this = this;
		if(this.model.get("site")) {
			for(var key in this.builtSelectorFields){
				this.loadAllTimeSeriesOption(key);
			}
		} 
	},
	
	/**
	 * The for loop in loadAllTimeSeriesOptions has scope/variable issues, call this function to create its
	 * own closure
	 */
	loadAllTimeSeriesOption : function(key) {
		var tsSelector = this.builtSelectorFields[key];
		var params = this.selectorParams[key];
		if(params.baseField) { //this is done so that any select boxes added by subclasses do not auto load with this function
			var _this = this;
			this.loadTimeseriesIdentifiers(
				key,
				{
					stationId: this.model.get("site").siteNumber,
					parameter: params.parameter,
					publish: params.publish,
					computationIdentifier: params.computation,
					computationPeriodIdentifier: params.period 
				}).done(function(data){
					_this.model.set(key + "FullList", data);
					_this.populateTsSelect(key);
					_this.loadAllRequiredTimeseries(params);
				});
		}
	},
	
	createPrimaryPublishFilters: function() {
		var primaryPubField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='filterPublish'>Filter Time Series Selections To</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='filterPublish' name='filterPublish' type='checkbox' value='check' checked=false>Publish Only</label>" +
				"&nbsp;<label><input class='filterPrimary' type='checkbox' value='check' checked=false>Primary Only</label>" +
				"</div>" +
				
				"</div></div></div>");//not sure this warrants using a template YET
		this.model.set("filterPublish", true);
		this.model.set("filterPrimary", true);
		$.extend(this.bindings, {
			".filterPublish" : "filterPublish",
			".filterPrimary" : "filterPrimary"
		});
		this.advancedOptionsContainer.append(primaryPubField);
	},
	
	getPrimaryFilter : function() {
		return this.model.get("filterPrimary");
	},
	
	getPublishFilter : function() {
		return this.model.get("filterPublish");
	},
	
	bindToPrimPubFilters: function(bindFunc, scope) {
		this.model.bind("change:filterPublish", bindFunc, scope);
		this.model.bind("change:filterPrimary", bindFunc, scope);
	},
	
	loadTimeseriesIdentifiers: function(selectorIdentifier, params) {
		var _this = this;
		var loadTimeseriesIdentifiersFetched = $.Deferred();
		if (params.stationId) {
			this.startAjax(selectorIdentifier + 'loadTimeseriesIdentifiers', $.ajax({
				url: AQCU.constants.serviceEndpoint +
						"/service/lookup/timeseries/identifiers",
				timeout: 120000,
				dataType: "json",
				data: params,
				context: this,
				success: function (data) {
					loadTimeseriesIdentifiersFetched.resolve(data);
				},
				error: function (a, b, c) {
					loadTimeseriesIdentifiersFetched.reject();
					$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c);
				}
			}));
		}
		return loadTimeseriesIdentifiersFetched.promise();
	},
	
	populateTsSelect : function(selectorIdentifier) {
		var tsSelector = this.builtSelectorFields[selectorIdentifier];
		tsSelector.removeSelectOptions();
		var data = this.model.get(selectorIdentifier + "FullList");
		if(data) {
			var sortedArray = [];
			for (var opt in data) {
				sortedArray.push([opt, data[opt]])
			}
			sortedArray = _.sortBy(sortedArray, function(obj){
				return obj[1].identifier;
				});
			var sortedFormattedArray = [];
			_.each(sortedArray, function(obj){
				var timeSeriesEntry = obj[1];
				timeSeriesEntry.uid = obj[0];
				sortedFormattedArray.push(timeSeriesEntry);
				});	
			var timeSeriesList = [];
			var publishFlag = this.getPublishFilter();
			var primaryFlag = this.getPrimaryFilter();
			_.each(sortedFormattedArray, function(obj){
				var skip = false;
				if(publishFlag && !obj.publish) {
					skip = true;
				}
				if(primaryFlag && !obj.primary) {
					skip = true;
				}
				if(!skip) {
					timeSeriesList.push({ KeyValue: obj.uid, DisplayValue: obj.identifier});
				}
			});
			tsSelector.setSelectOptions(timeSeriesList);
		}
	},
	
	createRatingModelDisplay : function(params) {
		var container = this.advancedOptionsContainer;
		var newContainer = $("<div>");
		var	ratingModelText  = new AQCU.view.TextField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : params.requestId,
				readOnly: "readonly",
				displayName : params.display + (params.required ? " *" : ""),
				description : "",
				placeHolderText: "No rating model found"
			},
			renderTo: newContainer,
			startHidden: false
		});
		$.extend(this.bindings, ratingModelText.getBindingConfig());
		container.append(newContainer);
	},
	//create exclude delete corrections filter
	createCorrectionExclusionSelector: function() {
		var excludeCorrectionField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='excludedCorrections'>Exclude Corrections</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='excludeDeleteRegion' name='excludeDeleteRegion' type='checkbox'>Exclude Delete Region Corrections</label>" +
				"</div>" +
				
				"</div></div></div>");//not sure this warrants using a template YET
		this.model.set("excludeDeleteRegion", false);
		$.extend(this.bindings, {
			".excludeDeleteRegion" : "excludeDeleteRegion"
		});
		this.advancedOptionsContainer.append(excludeCorrectionField);
	},
        
	bindToCorrectionExclusionSelectors: function(bindFunc, scope) {
		this.model.bind("change:excludeDeleteRegion", bindFunc, scope);
	},
        
	updateExcludedCorrections: function() {
			this.excludedCorrections = [];
			this.excludedCorrections.push(this.model.get("excludeDeleteRegion")?"DeleteRegion":null);
	},

	startAjax : function(ajaxId, ajaxPromise) {
		this.showLoader();
		//if call previous call in progress
		this.abortAjax(this.ajaxCalls[ajaxId]);
		this.ajaxCalls[ajaxId] = ajaxPromise;
		
		var _this = this;
		$.when(ajaxPromise).done(function(){
			_this.hideLoader();
		});
	}, 
	
	abortAjax : function(ajaxCall) {
		if(ajaxCall && ajaxCall.abort) {
			ajaxCall.abort();
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
			){
			_this.loadRelatedTimeseries(params).done(function(derivationChains){
				_this.setRelatedTimeseries(params, derivationChains, params.parameter);
			});
		}
	},	
	
	loadRelatedTimeseries: function(params){
		var _this = this;
		var loadRelatedTimeseriesFetched = $.Deferred();
		if(params.skipAutoLoad) {
			loadRelatedTimeseriesFetched.resolve(null);
			return loadRelatedTimeseriesFetched.promise();
		};
		var rdata;
		var computationFilter = params.computation || params.defaultComputation;
		computationFilter = computationFilter || 'Instantaneous';
		
		var periodFilter = params.period || params.defaultPeriod;
		periodFilter = periodFilter || 'Points';
		
		this.startAjax(params.requestId + 'loadRelatedTimeseries', $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/derivationChain/find",
			timeout: 120000,
			dataType: "json",
			data: {
				timeSeriesIdentifier: this.model.get("selectedTimeSeries").uid,
				direction: params.direction,
				publish: params.publish,
				parameter: params.parameter,
				computationIdentifier: computationFilter,
				computationPeriodIdentifier: periodFilter,
				startDate: this.model.get("dateSelection").startDate,
				endDate: this.model.get("dateSelection").endDate,
				waterYear: this.model.get("dateSelection").waterYear,
				lastMonths: this.model.get("dateSelection").lastMonths
			},
			context: this,
			success: function(data) {
				   rdata = data;
					loadRelatedTimeseriesFetched.resolve(data);
			},
			error: function(a, b, c) {
				//this.model.set(params.requestId, null);
				loadRelatedTimeseriesFetched.reject();
				$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c);
			}
		}));
		return loadRelatedTimeseriesFetched.promise();
	},
	
	setRelatedTimeseries : function(params, derivationChains, parameterToMatch) {
		var _this = this;
		var selectorIdentifier = params.requestId;
		var parameter;
		
		if(parameterToMatch !== null && parameterToMatch !== undefined && arguments.length === 3){
			parameter = parameterToMatch;
		} else {
			parameter = _this.model.get("selectedTimeSeries").parameter; 
		}
		if (derivationChains != null){
			//var selectorIdentifier = params.requestId;
			var fullList = _this.model.get(selectorIdentifier + "FullList");
			if(fullList) {
				var dataArray = [];
				var dataArray = _.toArray(_.clone(fullList));
				var filteredData;
				
				if(params !== undefined && params.autofillWithSameUnits === "true" && parameter !== null){
					filteredData = _.filter(dataArray, function(ts){
						return _.contains(derivationChains,ts.uid) && (parameter === ts.parameter) && ts.primary && ts.publish;
					});
				} else {
				// find all the time series from the FullList that match the incoming derivation chains AND have publish/primary set to true
					filteredData = _.filter(dataArray, function(ts){
						return _.contains(derivationChains,ts.uid) && ts.primary && ts.publish;
					});
				}
				// sort the result by publish and primary, which will put the true-trues a the top, then true-false, then false-true, then false-false
				var sortedArray = _(filteredData).chain().sortBy('publish').sortBy('primary').reverse().value();
				// we want the first one, which will be true-true, if it exists.
				var filteredDerivationChain = _.first(sortedArray);
				if (filteredDerivationChain){
					_this.model.set(selectorIdentifier, filteredDerivationChain.uid);
				} else {
					_this.model.set(selectorIdentifier, null);
				}
			} 
		} else {
				_this.model.set(selectorIdentifier, derivationChains);
		}
	},

	clearRatingModels: function(){
		for(var i = 0; i < this.ratingModels.length; i++) {
			this.model.set(this.ratingModels[i].requestId, null);
		}
	},
	
	//automatically load rating models based on the bound timeseries selection
	bindAllRatingModels: function() {
		for(var i = 0; i < this.ratingModels.length; i++) {
			this.bindRatingModel(this.ratingModels[i]);
		}
	},
	
	bindRatingModel: function(binding) {
		var _this = this;
		this.model.bind("change:" + binding.bindTo, function(){
			this.setRatingModel({
				requestId: binding.requestId,
				timeseriesUid: this.model.get(binding.bindTo)
			}).done(function(data){
				_this.model.set(binding.requestId, data)
			});
		}, this);
		
		//bind date change as well
		this.model.bind("change:dateSelection", function(){
			this.setRatingModel({
				requestId: binding.requestId,
				timeseriesUid: this.model.get(binding.bindTo)
			}).done(function(data){
				_this.model.set(binding.requestId, data)
			});
		}, this);
	},
	
	setRatingModel: function(params){
		var _this = this;
		var ratModDeffered = $.Deferred()
		if(params.timeseriesUid){
			this.startAjax(params.requestId + 'setRatingModel', $.ajax({
				url: AQCU.constants.serviceEndpoint + 
					"/service/lookup/derivationChain/ratingModel",
				timeout: 120000,
				dataType: "json",
				data: {
					timeSeriesIdentifier: params.timeseriesUid,
					startDate: this.model.get("dateSelection").startDate,
					endDate: this.model.get("dateSelection").endDate,
					waterYear: this.model.get("dateSelection").waterYear,
					lastMonths: this.model.get("dateSelection").lastMonths
				},
				context: this,
				success: function(data){
					if(data && data[0]) {
						ratModDeffered.resolve(data[0]);
					}
				},
				error: function(a, b, c) {
					ratModDeffered.resolve(null);
					$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c);
				}
			}));
		} else {
			ratModDeffered.resolve(null);
		}
		return ratModDeffered.promise();
	},
	
	//returns a map to match IDs to display values
	constructDisplayValuesMap: function(requestParams) {
		var _this = this;
		var displayValues = {};
		_.each(requestParams, function(val, key){
			var selectedTs = this.model.get("selectedTimeSeries");
			if(val) {
				if(key == "primaryTimeseriesIdentifier") {
					displayValues[val] = selectedTs.identifier + "@" + this.model.get("site").siteNumber;
				} else {
					var advancedField = _this.builtSelectorFields[key];
					if(advancedField) {
						displayValues[val] = advancedField.getOptionDisplayValue(val);
					}
				}
			}
		}, this) 
		return displayValues;
	},
	
	constructReportOptions: function() {
		var reportOptions = {
			primaryTimeseriesIdentifier: this.model.get("primaryTimeseriesIdentifier")
		};

		//attach time series selections
		for(var i = 0; i < this.relatedTimeseriesConfig.length; i++) {
			reportOptions[this.relatedTimeseriesConfig[i].requestId] = this.model.get(this.relatedTimeseriesConfig[i].requestId);
		}
		
		//attach rating model selections
		for(var i = 0; i < this.ratingModels.length; i++) {
			reportOptions[this.ratingModels[i].requestId] = this.model.get(this.ratingModels[i].requestId);
		}
		
		//date and site
		reportOptions.station = this.model.get("site").siteNumber.trim();

		if(this.model.get("dateSelection").startDate) 
			reportOptions.startDate = this.model.get("dateSelection").startDate;
		
		if(this.model.get("dateSelection").endDate) 
			reportOptions.endDate = this.model.get("dateSelection").endDate;
		
		if(this.model.get("dateSelection").waterYear) 
			reportOptions.waterYear = this.model.get("dateSelection").waterYear;
		
		if(this.model.get("dateSelection").lastMonths) 
			reportOptions.lastMonths = this.model.get("dateSelection").lastMonths;
                    		
		return reportOptions;
	},
	
	validate: function() {
		var valid = true;
		var noneFilled = false;
		var atLeastOne = false;
		
		//check required time series ids
		for(var i = 0; i < this.relatedTimeseriesConfig.length; i++) {
			if(!this.model.get(this.relatedTimeseriesConfig[i].requestId) && this.relatedTimeseriesConfig[i].required) {
				return false;
			}
		}
		
		//check required rating models
		for(var i = 0; i < this.ratingModels.length; i++) {
			if(!this.model.get(this.ratingModels[i].requestId) && this.ratingModels[i].required) {
				return false;
			}
		}
                
                //Check for at least one time series option filled
		for(var i = 0; i < this.relatedTimeseriesConfig.length; i++) {
			if(this.relatedTimeseriesConfig[i].oneOfSeveralRequired){
				if(!this.model.get(this.relatedTimeseriesConfig[i].requestId)){
					noneFilled = true;
				}
				else {
					atLeastOne = true;
				}
			}
		}
		if(noneFilled && !atLeastOne){
			valid = false;
		}
		
		return valid;
	},
	
	applyReportOptions: function() {
		if(this.loading) {
			return;
		}
		
		if(this.validate()) {
			this.parentModel.set("reportOptions", {
				reportType: this.reportType,
				isHtml: this.model.get("format") == 'html'
			});
			this.parentModel.set("requestParams", this.constructReportOptions());
		} else {
			this.flashWarning();
		}
	},
	
	saveReport: function() {
		if(this.validate()) {
			var requestParams = this.constructReportOptions();
			this.savedReportsController.saveReport(this.reportType, this.reportName, this.model.get("format"), this.constructDisplayValuesMap(requestParams), requestParams);
		} else {
			this.flashWarning();
		}
	},
	
	hideWarning: function() {
		this.$(".warning-indicator").hide();
		this.$(".config-btn").show();
	},
	
	flashWarning: function() {
		_this = this;
		this.$(".config-btn").hide();
		this.$(".warning-indicator").show().fadeOut(2000, function(){_this.$(".config-btn").show();});
	},
	
	showLoader: function() {
		this.loading = true;
		this.$(".config-btn").hide();
		this.$(".add-to-saved-reports").hide();
		this.$(".loading-indicator").show();
		
	},
	
	hideLoader: function() {
		//for wait for all ajax request before turning off the loader
		var callsInProgress = false;
		_.each(this.ajaxCalls, function(val, key){
			if(val.readyState < 4) {
				callsInProgress = true;
			}
		});
		if(!callsInProgress) {
			this.loading = false;
			this.$(".loading-indicator").hide();
			this.$(".config-btn").show();
			this.$(".add-to-saved-reports").show();
		}
	}
});