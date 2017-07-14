/**
 * Backbone view to encapsulate the date field widget. DateField will update it's model with 
 * either..
 * - waterYear
 * - lastMonths
 * - or startDate/endDate
 * in the model. Only 1/3 of those combinations will be allowed. The back end services should be looking for and processing one of these sets of
 * date combinations.
 * 
 * The widget abstracts away all handling of the html/model binding.
 */
AQCU.view.DateField = Backbone.View.extend({
	/**
	 * Handlebars template
	 */
	template: Handlebars.compile("\
		<div class='col-sm-12 col-md-12 col-lg-12'>\
			<div class='date-range-container-top row'>\
				<div class='header-container col-sm-12 col-md-12 col-lg-12'>\
					<h5><label>Select Time Range</label>\
				</div>\
			</div>\
			<div class='date-range-container-bottom row'>\
				<div class='col-sm-3 col-md-3 col-lg-3'>\
					<div style='float:left;margin-top:.5em;'><label>Months:&nbsp;</label></div>\
					<div style='float:left;width:60%'><select class='form-control aqcu_field_lastMonths'>\
						<option value='12'>Last 12</option>\
						<option value='11'>Last 11</option>\
						<option value='10'>Last 10</option>\
						<option value='9'>Last  9</option>\
						<option value='8'>Last  8</option>\
						<option value='7'>Last  7</option>\
						<option value='6'>Last  6</option>\
						<option value='5'>Last  5</option>\
						<option value='4'>Last  4</option>\
						<option value='3'>Last  3</option>\
						<option value='2'>Last  2</option>\
						<option value='1'>Last 1</option>\
						<option value='0'>-</option>\
					</select></div>\
				</div>\
				<div class='col-sm-3 col-md-3 col-lg-3'>\
					<div style='float:left;margin-top:.5em;'><label>Water Year:&nbsp</label></div>\
					<div style='float:left;width:40%'><input type='text' class='input-sm form-control aqcu_field_waterYear' maxlength='4' placeholder='      -'/></div>\
				</div>\
				<div class='col-sm-6 col-md-6 col-lg-6'>\
					<div style='float:left;margin-top:.5em;'><label class='control-label'>Pick Range:&nbsp;</label></div>\
					<div style='float:left;' class='input-daterange'><input type='text' class='input-sm form-control aqcu_field_input_date_start' name='aqcu_field_input_date_start' placeholder='-'/></div>\
					<span class='input-group-addon' style='float:left;'>-</span>\
					<div style='float:left;' class='input-daterange'><input type='text' class='input-sm form-control aqcu_field_input_date_end' name='aqcu_field_input_date_end' placeholder='-'/></div>\
				</div>\
			</div>\
		</div>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
	},
	
	bindings: {
		'.aqcu_field_input_date_start' : {
			observe: 'startDate',
			events: ['change']
		},
		'.aqcu_field_input_date_end' : {
			observe: 'endDate',
			events: ['change']
		},
		'.aqcu_field_waterYear' : {
			observe: 'waterYear',
			events: ['blur']
		},
		'.aqcu_field_lastMonths' : {
			observe: 'lastMonths',
			events: ['change']
		},
	},
	
	/**
	 * Will create and render a text field using a fieldConfig options defined in NWIS Search Models.
	 */
	initialize: function(options) {
		this.options = options
		
		this.parentModel = this.options.parentModel;
		
		this.model = this.options.model || new Backbone.Model({
			startDate: "",
			endDate: "",
			waterYear: "",
			lastMonths: 12
		});
		
		this.waterYearMin= this.options.waterYearMin ? this.options.waterYearMin : 1800;
		this.dateFormat  = "yyyy-mm-dd";
		
		
		this.model.on("change:startDate", this.startDateSet, this);
		this.model.on("change:endDate", this.endDateSet, this);
		this.model.on("change:lastMonths", this.lastMonthsSet, this);
		this.model.on("change:waterYear", this.waterYearSet, this);

		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
		
		this.applyDateSelection();
	},
	
	applyDateSelection : function() {
		if(this.model.get('lastMonths') > 0) {
			this.parentModel.set("dateSelection", {
				lastMonths : this.model.get('lastMonths')
			});
		} else if(this.model.get('waterYear')) {
			var intYear = parseInt(this.model.get('waterYear'));
			if(intYear > 999) {
				this.parentModel.set("dateSelection", {
					waterYear : this.model.get('waterYear')
				});
			} else {
				this.applyDefaultSettings();
			}
		} else if(this.model.get('startDate')) {
			this.parentModel.set("dateSelection", {
				startDate : this.model.get('startDate'),
				endDate : this.model.get('endDate')
			});
		} else {
			this.applyDefaultSettings();
		}
	},
	
	applyDefaultSettings : function() {
		this.model.set("lastMonths", 12);
	},
	
	startDateSet: function() {
		this.model.set("lastMonths", 0);
		this.model.set("waterYear", "");
		
		if(!this.model.get("endDate")) {
			this.model.set("endDate", this.model.get('startDate'))
		}
		
		if(this.model.get("startDate") > this.model.get("endDate")) {
			alertify.error('Start date must be before end date, please review your selection'); 
			this.model.set("startDate", this.model.get('endDate'));
		}
		
		this.applyDateSelection();
	},
	
	endDateSet: function() {
		this.model.set("lastMonths", 0);
		this.model.set("waterYear", "");

		if(!this.model.get("startDate")) {
			this.model.set("startDate", this.model.get('endDate'))
		}
		
		if(this.model.get("endDate") < this.model.get("startDate")) {
			alertify.error('End date must be after start date, please review your selection'); 
			this.model.set("endDate", this.model.get('startDate'));
		}
		
		this.applyDateSelection();
	},
	
	lastMonthsSet: function() {
		if(this.model.get('lastMonths') > 0) {
			this.model.set("startDate", "");
			this.model.set("endDate", "");
			this.model.set("waterYear", "");
			
			this.applyDateSelection();
		}
	},
	
	waterYearSet: function() {
		if(this.model.get("waterYear")) {
			this.model.set("startDate", "");
			this.model.set("endDate", "");
			this.model.set("lastMonths", 0);
			
			this.applyDateSelection();
		}
	},
	
	render: function() {
		var newDom = this.template({
		}); //new DOM elements created from templates
		
		this.$el.html(newDom);
		
		this.$('.input-daterange').datepicker({
			todayBtn	  : true,
			autoclose	 : true,
			todayHighlight: true,
			format		: this.dateFormat,
		});
		
		var view = this;
		this.$('.input-daterange').datepicker();
		this.stickit();
	}
});
