/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.TimeSeriesSelectionGridView = AQCU.view.BaseView.extend({
	templateName: 'time-series-selection-grid',
       
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {
	},

	events: {
		"click .see-reports-btn": "loadReportCards",
		"click .remove-reports-btn": "removeReportCards"
	},
	
	initialize: function() {
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
		
		this.ajaxCalls = {};
		
		this.savedReportsController = this.options.savedReportsController;
		
		this.router = this.options.router;
		
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				timeSeriesList: this.options.timeSeriesList, //this gets set by select,
				filter: this.parentModel.get("filter")
		});

		this.model.bind("change:visibility",this.changeVisibility,this);
		this.parentModel.bind("change:filter",this.displayGrid,this);
		this.parentModel.bind("change:site", this.fetchTimeSeries, this);
		this.parentModel.bind("change:dateSelection", this.fetchTimeSeries, this);
		
		this.displayedReportSelectors = {};
		
		this.fetchTimeSeries();
	},
	
	startAjax : function(ajaxId, ajaxPromise) {
		this.model.set('visibility','loading');
		//if call previous call in progress
		this.abortAjax(this.ajaxCalls[ajaxId]);
		this.ajaxCalls[ajaxId] = ajaxPromise;
		
		var _this = this;
		$.when(ajaxPromise).done(function(){
			this.displayGrid();
		});
	}, 
	
	abortAjax : function(ajaxCall) {
		if(ajaxCall && ajaxCall.abort) {
			ajaxCall.abort();
		} 
	},
	
	displayGrid: function() {
		this.destroyReportCards();
		this.model.set("filter", this.parentModel.get("filter"));

		this.beautifyAndFilter();
		this.model.set('visibility','shown');
		this.render();
	},
	
	fetchTimeSeries: function () {
		var _this = this;
		var site = this.parentModel.get("site");
		if(site) {
			_this.model.set("timeSeriesList", []);
			this.displayGrid();
			this.startAjax(site + 'fetchTimeSeries', $.ajax({
				url: AQCU.constants.serviceEndpoint +
						"/service/lookup/timeseries/identifiers",
				timeout: 120000,
				dataType: "json",
				data: {
					stationId: site.siteNumber
				},
				context: _this,
				success: function (data) {
					var sortedArray = [];
					for (var opt in data) {
						sortedArray.push([opt, data[opt]]);
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
					_this.model.set("timeSeriesList", sortedFormattedArray);
					_this.displayGrid();
				},
				error: function (a, b, c) {
					$.proxy(this.router.unknownErrorHandler, this.router)(a, b, c);
				}
			}));
		} else {
			this.model.set('visibility','hidden');
		}
	},
	
	isVisibleComputation: function(input) {
		var visibleComputations = this.model.get("filter").computationFilter;
		
		if(visibleComputations == null || visibleComputations.length == 0){
			return true;
		}
		
		for(var i=0; i < visibleComputations.length; i++) {
			if(input.indexOf(visibleComputations[i])) {
				return true;
			}			
		}
		return false;
	},
	
	isVisiblePeriod: function(input) {
		var visiblePeriods = this.model.get("filter").periodFilter;
		
		if(visiblePeriods == null || visiblePeriods.length == 0){
			return true;
		}
		
	    for(var i=0; i < visiblePeriods.length; i++) {
			if(input.indexOf(visiblePeriods[i])) {
				return true;
			}			
		}
	    return false;
	},
		
	afterRender: function() {
		this.stickit();
	},
	
	preRender: function(){
	},
	
	beautifyAndFilter: function(){
		var timeSeriesList = this.model.get("timeSeriesList");
		var filteredList = []
		for(var i=0;i < timeSeriesList.length;i++){
			var newRec = timeSeriesList[i];
			var includeRec = true;
			if(this.model.get("filter").onlyPublish && !newRec.publish) {
				includeRec = false;
			}

			if(this.model.get("filter").onlyPrimary && !newRec.primary) {
				includeRec = false;
			}

			if(!this.isVisibleComputation(newRec.computation) || !this.isVisiblePeriod(newRec.period))
			{
				includeRec = false;
			}

			if(includeRec) {
				newRec["identifier"] = newRec["identifier"].split("@",1)[0]
				filteredList.push(newRec);
			}
		}
		this.model.set("filteredList", filteredList);
		this.context = {
			timeSeriesList: filteredList
		};
	},
	
	loadReportCards: function(event){
		var targetID = $(event.currentTarget).attr("id");
		targetID = parseInt(targetID.substring(targetID.indexOf("-")+1));
		var selectedTimeSeries = this.model.get("filteredList")[targetID];
		 
		this.$("#timeseries-" + targetID).addClass('hidden');
		this.$("#remtimeseries-" + targetID).removeClass('hidden');
		
		if(!this.displayedReportSelectors[selectedTimeSeries.uid]) { //only create a new report card selector if not already exists
			//get the element inside the grid to render a new report config view to
			var reportSelectorContainer = this.$(".reports-container-" + targetID)[0];
			
			this.displayedReportSelectors[selectedTimeSeries.uid] = new AQCU.view.ReportConfigSelectionView({
				parentModel: this.parentModel,
				router: this.router,
				selectedTimeSeries: selectedTimeSeries,
				savedReportsController: this.savedReportsController,
				el: reportSelectorContainer
			});
		}
	},
	
	removeReportCards: function(event) {
		var targetID = $(event.currentTarget).attr("id");
		targetID = parseInt(targetID.substring(targetID.indexOf("-")+1));
		var selectedTimeSeries = this.model.get("filteredList")[targetID];

		this.$("#timeseries-" + targetID).removeClass('hidden');
		this.$("#remtimeseries-" + targetID).addClass('hidden');
		
		if(this.displayedReportSelectors[selectedTimeSeries.uid]) { //only create a new report card selector if not already exists
			this.displayedReportSelectors[selectedTimeSeries.uid].remove();
			this.displayedReportSelectors[selectedTimeSeries.uid] = null;
		}
	},
	
	destroyReportCards: function() {
		for(var r in this.displayedReportSelectors) {
			if(this.displayedReportSelectors[r]) {
				this.displayedReportSelectors[r].remove();
			}
		}
		this.displayedReportSelectors = {};
	},
	
	changeVisibility: function(){
		switch(this.model.get("visibility")){
			case "hidden":
				this.$el.removeClass('aqcu-lg-loader-spinner');
				this.$el.addClass('hidden');
				break;
			case "loading":
				this.$el.removeClass('hidden');
				this.$el.addClass('aqcu-lg-loader-spinner');
				break;
			case "shown":
				this.$el.removeClass('aqcu-lg-loader-spinner');
				this.$el.removeClass('hidden');
				break;
		}
	}
});