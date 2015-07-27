AQCU.view.BaseReportView = AQCU.view.BaseView.extend({
	templateName: 'report-card',
	reportName: null, //Display name of report
	defaultFormat: 'pdf',
	selectedTimeSeries: null, //array of json objects describing selected timeseries, this array is ordered
	requiredRelatedTimeseriesConfig: [], //override this
	requiredRatingModels: [],
	optionalRelatedTimeseriesConfig: [],
	optionalRatingModels: [],
	
	events: {
		'click .report-card-header': 'applyReportOptions',
		'mouseover .report-card': 'showConfigBtn',
		'mouseout .report-card': 'hideConfigBtn'
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.ajaxCalls = {};
		this.bindings = {};
		this.parentModel = this.options.parentModel;
		this.model = new Backbone.Model({
			site: null,
			selectedTimeSeries: null,
			startDate: null,
			endDate: null,
			format: this.defaultFormat
		});

		this.model.bind("change:selectedTimeSeries", this.loadAllRequiredTimeseries, this);
		this.model.bind("change:startDate", this.loadAllRequiredTimeseries, this);
		this.model.bind("change:endDate", this.loadAllRequiredTimeseries, this);

		this.model.bind("change:site", this.loadAllTimeSeriesOptions, this);
		this.model.bind("change:startDate", this.loadAllTimeSeriesOptions, this);
		this.model.bind("change:endDate", this.loadAllTimeSeriesOptions, this);
	},
	
	preRender: function() {
		this.unstickit();
		this.removeSelectFields();
		this.context = {
			reportName: this.reportName,
			reportType: this.reportType
		}
	},
	
	afterRender: function() {
		this.hideConfigBtn();
		this.hideWarning();
		this.bindAllRatingModels();
		this.buildAdvancedOptions();
		this.loadAllTimeSeriesOptions();
		this.stickit();
	},
	
	remove: function() {
		this.removeSelectFields();
		AQCU.view.BaseView.prototype.remove.apply(this, arguments);
	},
	
	removeSelectFields: function() {
		if(this.formatSelector) {
			this.formatSelector.remove();
		}

		for(var key in this.builtSelectorFields){
			this.builtSelectorFields[key].remove();
		}
	},
	
	buildAdvancedOptions: function() {
		this.advancedOptionsContainer = this.$(".adv-options-container");
		this.builtSelectorFields = {};
		this.selectorParams = {};
		
		var newContainer = $("<div>");
		this.formatSelector = new AQCU.view.SelectField({
			router: this.router,
			model: this.model,
			fieldConfig: {
				fieldName : "format",
				displayName : "Report Format",
				description : ""
			},
			renderTo: newContainer,
			startHidden: false
		});
		$.extend(this.bindings, this.formatSelector.getBindingConfig());
		this.formatSelector.setSelectOptions([{KeyValue: "html", DisplayValue: "html"}, {KeyValue: "pdf", DisplayValue: "pdf"}]);
		this.advancedOptionsContainer.append(newContainer);
		
		for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
			this.createTimeseriesSelectionBox(this.advancedOptionsContainer, this.requiredRelatedTimeseriesConfig[i], true);
		}
		
		for(var i = 0; i < this.requiredRatingModels.length; i++) {
			this.createRatingModelDisplay(this.advancedOptionsContainer, this.requiredRatingModels[i], true);
		}
		for(var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
			this.createTimeseriesSelectionBox(this.advancedOptionsContainer, this.optionalRelatedTimeseriesConfig[i], false);
		}

		for(var i = 0; i < this.optionalRatingModels.length; i++) {
			this.createRatingModelDisplay(this.advancedOptionsContainer, this.optionalRatingModels[i], false);
		}
	},
	
	createTimeseriesSelectionBox : function(container, params, isRequired) {
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
	},
	
	loadAllTimeSeriesOptions : function() {
		for(var key in this.builtSelectorFields){
			if(this.model.get("site")) {
				var tsSelector = this.builtSelectorFields[key];
				var params = this.selectorParams[key];
				this.populateTimeSeriesSelector(tsSelector, params);
			} 
		}
	},
	
	populateTimeSeriesSelector: function(tsSelector, params) {
		var _this = this;
		this.$(".vision_select_field_" + params.requestId).removeClass("nwis-loading-indicator");
		tsSelector.removeSelectOptions();
		this.abortAjax(this.ajaxCalls["tsList" + params.requestId]);
		this.ajaxCalls["tsList" + params.requestId] = $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/timeseries/identifiers",
			timeout: 120000,
			dataType: "json",
			data: {
				stationId: this.model.get("site").siteNumber,
				parameter: params.parameter,
				publish: params.publish,
				computationIdentifier: params.computation,
				computationPeriodIdentifier: params.period 
			},
			success: function(data) {
				var sortedArray=[];
				for(var opt in data){
					sortedArray.push([opt,data[opt]])
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

				var list = [];
				for(var i = 0; i < sortedArray.length; i++) {
					list.push({ KeyValue: sortedArray[i][0], DisplayValue: sortedArray[i][1].identifier});
				}
				tsSelector.setSelectOptions(list);
				_this.stickit();
				_this.$(".vision_select_field_" + params.requestId).removeClass("nwis-loading-indicator");
				
			},
			error: function() {
				//TODO warn user?
			}
		});
	},
	
	createRatingModelDisplay : function(container, params, isRequired) {
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
	
	setSelectedTimeSeries: function(selectedTimeSeries) {
		this.model.set("selectedTimeSeries", selectedTimeSeries);
		if(selectedTimeSeries) {
			this.model.set("primaryTimeseriesIdentifier", selectedTimeSeries.uid);
		}
	},
	
	setSite: function(site) {
		this.model.set("site", site);
	},
	
	setStartDate: function(startDate) {
		this.model.set("startDate", startDate);
	},
	
	setEndDate: function(endDate) {
		this.model.set("endDate", endDate);
	},
	
	abortAjax : function(ajaxCall) {
		if(ajaxCall && ajaxCall.abort) {
			ajaxCall.abort();
		} 
	},
	
	loadAllRequiredTimeseries: function() {
		this.clearRatingModels();
		
		if(this.model.get("selectedTimeSeries") && this.model.get("startDate") && this.model.get("endDate")) {
			for(var i = 0; i < this.requiredRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.requiredRelatedTimeseriesConfig[i]);
			}
			for(var i = 0; i < this.optionalRelatedTimeseriesConfig.length; i++) {
				this.loadRelatedTimeseries(this.optionalRelatedTimeseriesConfig[i]);
			}
		}
	},

	loadRelatedTimeseries: function(params){
		this.abortAjax(this.ajaxCalls[params.requestId]);
		this.ajaxCalls[params.requestId] = $.ajax({
			url: AQCU.constants.serviceEndpoint + 
				"/service/lookup/derivationChain/find",
			timeout: 120000,
			dataType: "json",
			data: {
				timeSeriesIdentifier: this.model.get("selectedTimeSeries").uid,
				direction: params.direction,
				publish: params.publish,
				parameter: params.parameter,
				computationIdentifier: params.computation || 'Unknown',
				computationPeriodIdentifier: params.period || 'Unknown',
				startDate: this.model.get("startDate"),
				endDate: this.model.get("endDate")
			},
			context: this,
			success: function(data) {
				if(data[0]) {
					this.model.set(params.requestId, data[0]);
				}
			},
			error: function() {
				this.model.set(params.requestId, null);
			}
		});
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
		}, this)
	},
	
	setRatingModel: function(params){
		if(params.timeseriesUid){
			var _this = this;
			this.abortAjax(this.ajaxCalls[params.requestId]);
			this.ajaxCalls[params.requestId] = $.ajax({
				url: AQCU.constants.serviceEndpoint + 
					"/service/lookup/derivationChain/ratingModel",
				timeout: 120000,
				dataType: "json",
				data: {
					timeSeriesIdentifier: params.timeseriesUid,
					startDate: this.model.get("startDate"),
					endDate: this.model.get("endDate")
				},
				context: this,
				success: function(data){
					if(data && data[0]) {
						console.log("Setting " + params.requestId + " with " + data[0]);
						_this.model.set(params.requestId, data[0]);
					}
				},
				error: function() {
					_this.model.set(params.requestId, null);
				}
			});
		} else {
			this.model.set(params.requestId, null);
		}
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
	
	hideConfigBtn: function() {
		this.$(".config-btn").hide();
	},
	
	showConfigBtn: function() {
		this.$(".config-btn").show();
	},
	
	hideWarning: function() {
		this.$(".warning-indicator").hide();
	},
	
	flashWarning: function() {
		this.$(".warning-indicator").show().fadeOut(2000, function(){});
	}
});