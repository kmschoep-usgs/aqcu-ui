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
					<div class='checkbox' style='float:left;margin-left:1.5em;'>\
						<input type='checkbox' name='aqcu_field_limit_date_selection' class='aqcu_field_limit_date_selection'>\
							Limit date picker to field visit dates.\
						</input>\
					</div>\
					<div id='errorMsg' style='float:right;color:red;'></div>\
					<div style='float:right;' class='apply-time-range-button saved-reports-button'>Fetch Time Series in Time Range</div>\
				</div>\
			</div>\
		</div>"),
	/**
	 * Backbone events object. See backbone documentation
	 */
	events: {
		'click .apply-time-range-button': "applyDateSelection"
	},
	
	bindings: {
		'.aqcu_field_limit_date_selection' : {
			observe: 'limitDateSelection',
			events: ['change']
		},
		'.aqcu_field_input_date_start' : {
			observe: 'startDate',
			events: ['changeDate','blur']
		},
		'.aqcu_field_input_date_end' : {
			observe: 'endDate',
			events: ['changeDate','blur']
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
		this.router = this.options.router;

		this.model = this.options.model || new Backbone.Model({
			site: this.parentModel.get('site'),
			limitDateSelection: false,
			fieldVisitDates: null,
			startDate: "",
			endDate: "",
			waterYear: "",
			lastMonths: 12
		});
		
		this.waterYearMin= this.options.waterYearMin ? this.options.waterYearMin : 1800;
		this.dateFormat  = "yyyy-mm-dd";
		$.fn.datepicker.defaults.format = this.dateFormat;
		
		this.model.on("change:limitDateSelection", this.limitDateSelectionSet, this);
		this.model.on("change:fieldVisitDates", this.resetDatePickers, this);
		this.model.on("change:startDate", this.startDateSet, this);
		this.model.on("change:endDate", this.endDateSet, this);
		this.model.on("change:lastMonths", this.lastMonthsSet, this);
		this.model.on("change:waterYear", this.waterYearSet, this);
		
		Backbone.View.prototype.initialize.apply(this, arguments);
		this.render();
		
		this.applyDateSelection();
		
	},
	
	addErrorMsg: function(){
		$('.input-daterange input').addClass('error');
		$("#errorMsg").append('Start date must be before end date, please review your selection');
	},
	
	removeErrorMsg: function(){
		$('.input-daterange input').removeClass('error');
		$("#errorMsg").empty();
	},
	
	applyDateSelection : function() {
		if (this.validateDateRange()) {
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
			} else if(this.model.get('startDate') && this.model.get('endDate')) {
				this.parentModel.set("dateSelection", {
					startDate : this.model.get('startDate'),
					endDate : this.model.get('endDate')
				});
			}
			else {
				this.applyDefaultSettings();
			}
		}
	},
	
	applyDefaultSettings : function() {
		this.model.set("lastMonths", 12);
	},
	
	dateInputValid: function(date) {
		return date == '' || (
			/\d{4}-\d\d?-\d\d?$/.test(date) && new Date(date).getTime() != NaN);
	},
	
	validateDateRange: function(){
		if((this.model.get("startDate") && this.model.get("endDate")) && (this.model.get("startDate") > this.model.get("endDate"))) {
			this.addErrorMsg();				
			return false;
		} else {
			return true;
		}
	},
	startDateSet: function() {
		this.removeErrorMsg();
		if (!(this.model.get("startDate") && this.model.get("endDate"))){
			$('.apply-time-range-button').prop('disabled', true).addClass('button-disabled').removeClass('saved-reports-button');
		} else {
			$('.apply-time-range-button').prop('disabled', false).removeClass('button-disabled').addClass('saved-reports-button');
		}
		if (!this.dateInputValid(this.model.get('startDate'))) {
			return;
		}
		if(this.model.get("startDate")) {
			this.model.set("lastMonths", 0);
			this.model.set("waterYear", "");
			this.parentModel.set("dateFilter", "startDate" + this.model.get("startDate"));
		}
		
		if(!this.model.get("startDate") && !this.model.get("endDate") && !this.model.get("waterYear") && !this.model.get("lastMonths") > 0){
			this.applyDefaultSettings();
			this.parentModel.set("dateFilter", "default");
		}
	},
	
	endDateSet: function() {
		this.removeErrorMsg();
		if (!(this.model.get("startDate") && this.model.get("endDate"))){
			$('.apply-time-range-button').prop('disabled', true).addClass('button-disabled').removeClass('saved-reports-button');
			this.parentModel.set("dateFilter", "endDate");
		} else {
			$('.apply-time-range-button').prop('disabled', false).removeClass('button-disabled').addClass('saved-reports-button');
		}
			
		if (!this.dateInputValid(this.model.get('endDate'))) {
			return;
		}
		
		if(this.model.get("endDate")) {
			this.model.set("lastMonths", 0);
			this.model.set("waterYear", "");
			this.parentModel.set("dateFilter", "endDate" + this.model.get("endDate"));
		}
		
		if(!this.model.get("startDate") && !this.model.get("endDate") && !this.model.get("waterYear") && !this.model.get("lastMonths") > 0){
			this.applyDefaultSettings();
			this.parentModel.set("dateFilter", "default");
		}
	},
	
	lastMonthsSet: function() {
		this.removeErrorMsg();
		if(this.model.get('lastMonths') > 0) {
			this.model.set("startDate", "");
			this.model.set("endDate", "");
			this.model.set("waterYear", "");
			$('.apply-time-range-button').prop('disabled', false).removeClass('button-disabled').addClass('saved-reports-button');
			this.parentModel.set("dateFilter", "lastMonths");
		}
	},
	
	waterYearSet: function() {
		this.removeErrorMsg();
		if(this.model.get("waterYear")) {
			this.model.set("startDate", "");
			this.model.set("endDate", "");
			this.model.set("lastMonths", 0);
			$('.apply-time-range-button').prop('disabled', false).removeClass('button-disabled').addClass('saved-reports-button');
			this.parentModel.set("dateFilter", "waterYear");
		}
	},
	
	limitDateSelectionSet: function () {
		this.resetDatePickers();
		
		// Query for field visit dates, if we don't have them yet.
		if (this.model.get('fieldVisitDates') !== null) {
			return;
		}
		$.ajax({
			url: AQCU.constants.serviceEndpoint + '/service/lookup/field-visit-dates',
			dataType: 'json',
			data: {
				siteNumber: this.model.get('site').siteNumber,
			},
			context: this,
			success: function (data) {
				this.model.set('fieldVisitDates', data.map(function (date) {
					// Return yyyy-mm-dd date in local timezone.
					var parts = date.split(/\D/);
					return new Date(parts[0], parts[1] - 1, parts[2]);
				}));
			},
			error: $.proxy(this.router.unknownErrorHandler, this.router)
		});
	},
	
	resetDatePickers: function () {
		this.removeErrorMsg();
		this.$('.input-daterange input').each(function () {
			$(this).datepicker('remove');
		});
		
		// Standard date picker - pick any date.
		if (!this.model.get('limitDateSelection')) {
			$('.input-daterange input').prop('disabled', false)
			this.$('.input-daterange').datepicker({
				todayBtn: true,
				autoclose: false,
				todayHighlight: true,
				format: this.dateFormat
			});
			return;
		}
		
		var fieldVisitDates = this.model.get('fieldVisitDates');
		
		// If `fieldVisitDates` isn't initialized yet, disable the date
		// pickers.
		if (fieldVisitDates === null) {
			$('.input-daterange input').prop('disabled', true);
			return;
		}
		
		// Create a date picker that excludes dates not in `fieldVisitDates`.
		// Date parts are compared in the local time zone.
		$('.input-daterange input').prop('disabled', false);
		this.$('.input-daterange input').datepicker({
			autoclose: true,
			format: this.dateFormat,
			startView: "decade",
			beforeShowDay: function (dt) {
				var dayObj = {enabled:false};
				var day = dt.getDate();
				var month = dt.getMonth();
				var year = dt.getFullYear();
				for (var i = 0; i < fieldVisitDates.length; i++) {
					if (fieldVisitDates[i].getDate() === day &&
							fieldVisitDates[i].getMonth() === month &&
							fieldVisitDates[i].getFullYear() === year) {
						dayObj = {enabled:true, classes:"field-visit-day"};
						return dayObj;
					}
				}
				return dayObj;
			},
			beforeShowMonth: function (dt) {
				var monthObj = {enabled:false};
				var month = dt.getMonth();
				var year = dt.getFullYear();
				for (var i = 0; i < fieldVisitDates.length; i++) {
					if (fieldVisitDates[i].getMonth() === month &&
							fieldVisitDates[i].getFullYear() === year) {
						monthObj = {enabled:true, classes:"field-visit-month"};
						return monthObj;
					}
				}
				return monthObj;
			},
			beforeShowYear: function (dt) {
				var yearObj = {enabled:false};
				var year = dt.getFullYear();
				for (var i = 0; i < fieldVisitDates.length; i++) {
					if (fieldVisitDates[i].getFullYear() === year) {
						yearObj = {enabled:true, classes:"field-visit-year"}
						return yearObj;
					}
				}
				return yearObj;
			}
		});
	},
	
	render: function() {
		var newDom = this.template({
		}); //new DOM elements created from templates
		
		this.$el.html(newDom);
		this.resetDatePickers();
		this.stickit();
	},
	destroyReportCards: function() {
		for(var r in this.displayedReportSelectors) {
			if(this.displayedReportSelectors[r]) {
				this.displayedReportSelectors[r].remove();
			}
		}
		this.displayedReportSelectors = {};
	}
});
