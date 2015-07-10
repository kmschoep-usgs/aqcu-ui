/**
 * Extends BaseView.js, see for full documentation of class functions.
 */
AQCU.view.TimeSeriesView = AQCU.view.BaseView.extend({
	templateName: 'time-series',
       
	/**
	* Used by Backbone Stickit to bind HTML input elements to Backbone models.
	* This will be built up in the initialize function.
	*/
	bindings: {},

	events: {
		'click #nav-home': "goRaHome",
		'click #time-series-prototype-btn': "goToPrototype"
	},
	initialize: function() {
		//TODO initialize model
		
		//TODO initialize/attach subviews for site selector, timeseries selector, report selector
		
		AQCU.view.BaseView.prototype.initialize.apply(this, arguments);
	},
	
	afterRender: function() {
		this.ajaxCalls = {}; //used to cancel in progress ajax calls if needed
		this.stickit();
	}
});