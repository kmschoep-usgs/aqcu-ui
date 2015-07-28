/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.TimeSeriesSelectionGridView = AQCU.view.BaseView.extend({
	templateName: 'time-series-selection-grid',
       
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
		"click .time-series-selection-grid-row": "timeSeriesClicked"
	},
	
	initialize: function() {
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
				
		this.router = this.options.router;
		
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
				timeSeriesList: this.options.timeSeriesList
			});
			
		this.model.bind("change:visibility",this.changeVisibility,this);
		//this.model.bind("change:site",this.fetchTimeSeries,this);
		this.site = this.options.site;
		this.fetchTimeSeries();
	},
	
		fetchTimeSeries: function () {
		this.model.set('visibility','loading');
		var _this = this;
		var site = this.site;
		$.ajax({
			url: AQCU.constants.serviceEndpoint +
					"/service/lookup/timeseries/identifiers",
			timeout: 120000,
			dataType: "json",
			data: {
				stationId: site.siteNumber,
				computationIdentifier: "Unknown", //Unknown seems to be applied to non-mean/DV series
				computationPeriodIdentifier: "Unknown" //Unknown seems to be applied to non-mean/DV series
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
				_this.beautify();
				_this.model.set('visibility','shown');
				_this.render();
			},
			error: function () {

			}
		});
	},
	
	afterRender: function() {
	},
	
	preRender: function(){
	},
	
	beautify: function(){
		var timeSeriesList = this.model.get("timeSeriesList");
		for(var i=0;i < timeSeriesList.length;i++){
			timeSeriesList[i]["identifier"] = 
				timeSeriesList[i]["identifier"].split("@",1)[0];
		}
		this.context = {
			selectedTimeSeries: this.model.get("selectedTimeSeries"),
			timeSeriesList: timeSeriesList
		};
	},
	
	timeSeriesClicked: function(event){
		this.model.set('visibility','hidden');
		var targetID = $(event.currentTarget).attr("id");
		targetID = parseInt(targetID.substring(targetID.indexOf("-")+1));
		this.parentModel.set("selectedTimeSeries",this.model.get("timeSeriesList")[targetID]);
	},
	
	changeVisibility: function(){
		switch(this.model.get("visibility")){
			case "hidden":
				this.$el.removeClass('nwis-loading-indicator');
				this.$el.addClass('hidden');
				break;
			case "loading":
				this.$el.removeClass('hidden');
				this.$el.addClass('nwis-loading-indicator');
				break;
			case "shown":
				this.$el.removeClass('nwis-loading-indicator');
				this.$el.removeClass('hidden');
				break;
		}
	},
	
	closeButtonClicked: function(){
		this.model.set('visibility','shown');
	}
});