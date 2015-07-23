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
	},
	
	afterRender: function() {
		
	},
	
	preRender: function(){
		/** The block below changes the identifiers so that the site number
		 * is not displayed after the descriptive elements of the identifier.
		 * It does so by splitting on "@" and using only the first element of the formed array. **/
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
		var targetID = $(event.currentTarget).attr("id");
		targetID = parseInt(targetID.substring(targetID.indexOf("-")+1));
		this.parentModel.set("selectedTimeSeries",this.model.get("timeSeriesList")[targetID]);
	}
});