AQCU.view.BaseReportView = AQCU.view.BaseView.extend({
	templateName: 'report-card',
	reportName: null, //Display name of report
	reportAbbreviation: null, //short name for reports
	defaultFormat: 'html',
	selectedTimeSeries: null, //array of json objects describing selected timeseries, this array is ordered
	requiredRelatedTimeseriesConfig: [], //override this
	requiredRatingModels: [],
	optionalRelatedTimeseriesConfig: [],
	optionalRatingModels: [],
	
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
		this.loadAllTimeSeriesOptions(this.loadAllRequiredTimeseries);
		
		//hook up save button
		$('.add-to-saved-reports').confirmation({
			title: "Save this " + this.reportName + " report?",
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
		
		if(this.requiredRelatedTimeseriesConfig.length || this.optionalRelatedTimeseriesConfig.length) {
			this.createPrimaryPublishFilters();
		}
		
		for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
			this.createTimeseriesSelectionBox($.extend(this.requiredRelatedTimeseriesConfig[i], { baseField: true }), true);
		}
		
		for(var i = 0; i < this.requiredRatingModels.length; i++) {
			this.createRatingModelDisplay(this.requiredRatingModels[i], true);
		}
		for(var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
			this.createTimeseriesSelectionBox($.extend(this.optionalRelatedTimeseriesConfig[i], { baseField: true }), false);
		}

		for(var i = 0; i < this.optionalRatingModels.length; i++) {
			this.createRatingModelDisplay(this.optionalRatingModels[i], false);
		}
	},
	
	createTimeseriesSelectionBox : function(params, isRequired) {
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
				displayName : params.display + (isRequired ? " *" : ""),
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
		if(this.model.get("site")) {
			for(var key in this.builtSelectorFields){
				var tsSelector = this.builtSelectorFields[key];
				var params = this.selectorParams[key];
				if(params.baseField) { //this is done so that any select boxes added by subclasses do not auto load with this function
					this.loadTimeseriesIdentifiers(
							key,
							{
								stationId: this.model.get("site").siteNumber,
								parameter: params.parameter,
								publish: params.publish,
								computationIdentifier: params.computation,
								computationPeriodIdentifier: params.period 
							});
				}
			}
			if(callback) {
				$.proxy(callback, this, this.ajaxCalls)();
			}
		} 
	},
	
	createPrimaryPublishFilters: function() {
		var primaryPubField = $("<div><div><div class='row field-container'>" +
				
				"<div class='col-sm-5 col-md-5 col-lg-5'>" +
				"<label for='filterPublish'>Filter Time Series Selections To</label><br>" +
				"</div>" +
				
				"<div class='checkbox col-sm-7 col-md-7 col-lg-7'>" +
				"<label><input class='filterPublish' name='filterPublish' type='checkbox' value='check' checked=true>Publish Only</label>" +
				"&nbsp;<label><input class='filterPrimary' type='checkbox' value='check' checked=true>Primary Only</label>" +
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
		if (params.stationId) {
			$.ajax({
				url: AQCU.constants.serviceEndpoint +
						"/service/lookup/timeseries/identifiers",
				timeout: 120000,
				dataType: "json",
				data: params,
				context: this,
				success: function (data) {
					this.model.set(selectorIdentifier + "FullList", data);
					this.populateTsSelect(selectorIdentifier);
				},
				error: function () {

				}
			});
		}
	},
	
	setFilteredDerivationChain : function(params, derivationChainArray) {
		var selectorIdentifier = params.requestId;
		var publishFlag = this.getPublishFilter();
		var primaryFlag = this.getPrimaryFilter();
		var data = this.model.get(selectorIdentifier + "FullList");
		if(data) {
			var dataArray = [];
			var dataArray = _.toArray(_.clone(data));
			var filteredData = _.filter(dataArray, function(obj){
				return (obj.publish == publishFlag || _.isNull(publishFlag))
					&& (obj.primary == primaryFlag || _.isNull(primaryFlag))
			})
			var filteredDerivationChain = _.find(filteredData, function(ts){
				return _.contains(derivationChainArray,ts.uid);
			});
			return filteredDerivationChain.uid;
		}
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
			var publishFlag = this.getPublishFilter();
			var primaryFlag = this.getPrimaryFilter();
			
			for(var i = 0; i < sortedFormattedArray.length; i++) {
				var skip = false;
				if(publishFlag && !sortedFormattedArray[i].publish) {
					skip = true;
				}
				if(primaryFlag && !sortedFormattedArray[i].primary) {
					skip = true;
				}
				if(!skip) {
					timeSeriesList.push({ KeyValue: sortedFormattedArray[i].uid, DisplayValue: sortedFormattedArray[i].identifier});
				}
			}
			tsSelector.setSelectOptions(timeSeriesList);
		}
	},
	
	createRatingModelDisplay : function(params, isRequired) {
		var container = this.advancedOptionsContainer;
		var newContainer = $("<div>");
		var	ratingModelText  = new AQCU.view.TextField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : params.requestId,
				readOnly: "readonly",
				displayName : params.display + (isRequired ? " *" : ""),
				description : "",
				placeHolderText: "No rating model found"
			},
			renderTo: newContainer,
			startHidden: false
		});
		$.extend(this.bindings, ratingModelText.getBindingConfig());
		container.append(newContainer);
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
	
	loadAllRequiredTimeseries: function() {
		this.clearRatingModels();
		
		if(this.model.get("selectedTimeSeries") && this.model.get("dateSelection")) {
			for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.requiredRelatedTimeseriesConfig[i]);
			}
			for(var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.optionalRelatedTimeseriesConfig[i]);
			}
		}
	},

	loadRelatedTimeseries: function(params){
		if(params.skipAutoLoad) {
			return;
		}
		
		var computationFilter = params.computation || params.defaultComputation;
		computationFilter = computationFilter || 'Instantaneous';
		
		var periodFilter = params.period || params.defaultPeriod;
		periodFilter = periodFilter || 'Points';
		
		this.startAjax(params.requestId, $.ajax({
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
				if(data[0]) {
					this.model.set(params.requestId, this.setFilteredDerivationChain(params, data));
				}
			},
			error: function() {
				this.model.set(params.requestId, null);
			}
		}));
	},
	
	clearRatingModels: function(){
		for(var i = 0; i < this.requiredRatingModels.length; i++) {
			this.model.set(this.requiredRatingModels[i].requestId, null);
		}
		for(var i = 0; i < this.optionalRatingModels.length; i++) {
			this.model.set(this.optionalRatingModels[i].requestId, null);
		}
	},
	
	//automatically load rating models based on the bound timeseries selection
	bindAllRatingModels: function() {
		//required
		for(var i = 0; i < this.requiredRatingModels.length; i++) {
			this.bindRatingModel(this.requiredRatingModels[i]);
			
		}

		//optional
		for(var i = 0; i < this.optionalRatingModels.length; i++) {
			this.bindRatingModel(this.optionalRatingModels[i]);
		}
	},
	
	bindRatingModel: function(binding) {
		this.model.bind("change:" + binding.bindTo, function(){
			this.setRatingModel({
				requestId: binding.requestId,
				timeseriesUid: this.model.get(binding.bindTo)
			});
		}, this);
		
		//bind date change as well
		this.model.bind("change:dateSelection", function(){
			this.setRatingModel({
				requestId: binding.requestId,
				timeseriesUid: this.model.get(binding.bindTo)
			});
		}, this);
	},
	
	setRatingModel: function(params){
		if(params.timeseriesUid){
			var _this = this;
			this.startAjax(params.requestId, $.ajax({
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
						_this.model.set(params.requestId, data[0]);
					}
				},
				error: function() {
					_this.model.set(params.requestId, null);
				}
			}));
		} else {
			this.model.set(params.requestId, null);
		}
	},
	
	//returns a map to match IDs to display values
	constructDisplayValuesMap: function(requestParams) {
		var displayValues = {};
		_.each(requestParams, function(val, key){
			var selectedTs = this.model.get("selectedTimeSeries");
			if(val) {
				if(key == "primaryTimeseriesIdentifier") {
					displayValues[val] = selectedTs.identifier + "@" + this.model.get("site").siteNumber;
				} else {
					var advancedField = this.builtSelectorFields[key];
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

		//attach required time series selections
		for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
			reportOptions[this.requiredRelatedTimeseriesConfig[i].requestId] = this.model.get(this.requiredRelatedTimeseriesConfig[i].requestId);
		}
		
		//attach required rating model selections
		for(var i = 0; i < this.requiredRatingModels.length; i++) {
			reportOptions[this.requiredRatingModels[i].requestId] = this.model.get(this.requiredRatingModels[i].requestId);
		}
		

		//attach required time series selections
		for(var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
			reportOptions[this.optionalRelatedTimeseriesConfig[i].requestId] = this.model.get(this.optionalRelatedTimeseriesConfig[i].requestId);
		}
		
		//attach required rating model selections
		for(var i = 0; i < this.optionalRatingModels.length; i++) {
			reportOptions[this.optionalRatingModels[i].requestId] = this.model.get(this.optionalRatingModels[i].requestId);
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
		
		//check required time series ids
		for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
			if(!this.model.get(this.requiredRelatedTimeseriesConfig[i].requestId)) {
				return false;
			}
		}
		
		//check required rating models
		for(var i = 0; i < this.requiredRatingModels.length; i++) {
			if(!this.model.get(this.requiredRatingModels[i].requestId)) {
				return false;
			}
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