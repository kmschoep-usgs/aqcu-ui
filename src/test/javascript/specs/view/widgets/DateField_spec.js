describe("DateField.js", function() {
	var dateField;
	var model;
	var parentModel;
	
	var testDate = function(description, dateStr, expectedYear, expectedMonth, expectedDate) {
		since(description + " is " + dateStr).expect(dateStr).toBeDefined();
		
		var parts = dateStr.split('-');
		
		since(description + " year").expect(parseInt(parts[0],10)).toBe(expectedYear);
		since(description + " month").expect(parseInt(parts[1],10)).toBe(expectedMonth);
		since(description + " day").expect(parseInt(parts[2],10)).toBe(expectedDate);
	}

	afterEach(function(){
		dateField.remove();
	});
		
	var setupDom = function(){
		if ($('.date-range').length === 0) {
			var dom = $('<div class="date-range"></div>');
			$(document.body).append(dom);
		}
	}
	
	beforeEach(function(){
		setupDom();
		
		model = new Backbone.Model();
		expect(model.get('startDate')).not.toBeDefined();
		expect(model.get('endDate')).not.toBeDefined();
		
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
				
		dateField = new AQCU.view.DateField({
			el : '.date-range',
			parentModel  : model,
			model : model
		});
	});
	
	it("defines these public attributes and API functions", function() {
		expect(AQCU.view.DateField).toBeDefined();
		expect(dateField).toBeDefined();
		expect(model).toBeDefined();
	});
	
	it("should set default to last 12 months", function() {
		var dateSelection = model.get('dateSelection');
		since('expect date range result to be initialized').expect(dateSelection).toBeTruthy();

		expect(dateSelection.lastMonths).toBe(12);
		expect(dateSelection.startDate).toBeUndefined();
		expect(dateSelection.endDate).toBeUndefined();
		expect(dateSelection.waterYear).toBeUndefined();
	});
	
	it("should clear other fields when water year is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
		
		$('.aqcu_field_waterYear').val('2012');
		$('.aqcu_field_waterYear').blur();
		dateField.delegateEvents();

		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(startDate).toBe('');
		expect(endDate).toBe('');
		expect(waterYear).toBe('2012');
		
		model.set('startDate','2012-01-01');
		model.set('endDate','2013-01-01');
		model.set('lastMonths', 0);
		model.set('waterYear','');
		
		$('.aqcu_field_waterYear').val('2012');
		$('.aqcu_field_waterYear').blur();
		dateField.delegateEvents();

		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(startDate).toBe('');
		expect(endDate).toBe('');
		expect(waterYear).toBe('2012');
		
		
	});
	
	it("should clear other fields when water year is entered, then clear water year when lastMonths reentered", function() {
		$('.aqcu_field_waterYear').val('2012');
		$('.aqcu_field_waterYear').blur();
		dateField.delegateEvents();

		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(startDate).toBe('');
		expect(endDate).toBe('');
		expect(waterYear).toBe('2012');

		$('.aqcu_field_lastMonths').val(10);
		$('.aqcu_field_lastMonths').change();
		dateField.delegateEvents();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe('10');
		expect(startDate).toBe('');
		expect(endDate).toBe('');
		expect(waterYear).toBe('');
	});
	
	it("should clear lastMonths when start date is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
		
		$('.aqcu_field_input_date_start').val("2012-12-01");
		$('.aqcu_field_input_date_start').blur();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(waterYear).toBe('');
		testDate('expected startDate as set', startDate, 2012, 12, 1);
		
	});
	
	it("should clear waterYear when start date is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', '');
		model.set('waterYear','2016');
		
		$('.aqcu_field_input_date_start').val("2012-12-01");
		$('.aqcu_field_input_date_start').blur();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(waterYear).toBe('');
		expect(endDate).toBe('');
		testDate('expected startDate as set', startDate, 2012, 12, 1);
		
		$('.aqcu_field_input_date_start').val(""); //clearing start date clears both dates and sets to default
		$('.aqcu_field_input_date_start').blur();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(12);
		expect(waterYear).toBe('');
		expect(startDate).toBe('');
		expect(endDate).toBe('');
	});
	
	it("should clear lastMonths/waterYear when end date is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
		
		$('.aqcu_field_input_date_end').val("2012-12-01");
		$('.aqcu_field_input_date_end').blur();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(waterYear).toBe('');
		
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', '');
		model.set('waterYear','2016');
		
		$('.aqcu_field_input_date_end').val("2012-12-01");
		$('.aqcu_field_input_date_end').blur();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(0);
		expect(waterYear).toBe('');
		
		$('.aqcu_field_input_date_end').val(""); //clearing start date clears both dates and sets to default
		$('.aqcu_field_input_date_end').blur();
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		expect(lastMonths).toBe(12);
		expect(waterYear).toBe('');
		expect(startDate).toBe('');
		expect(endDate).toBe('');
	});
	
	it("Fetch Time Series Button should only be enabled when one of 3 options is populated", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', '');
		model.set('waterYear','2016');
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		var buttonProperty = null;
		buttonProperty = $('.apply-time-range-button').prop('disabled');
		
		expect(buttonProperty).toBe(false);
		
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', '3');
		model.set('waterYear','');
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		var buttonProperty = null;
		buttonProperty = $('.apply-time-range-button').prop('disabled');
		
		expect(buttonProperty).toBe(false);
		
		model.set('startDate','2016-01-05');
		model.set('endDate','2017-01-05');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		var buttonProperty = null;
		buttonProperty = $('.apply-time-range-button').prop('disabled');
		
		expect(buttonProperty).toBe(false);
		
		model.set('startDate','2016-01-05');
		model.set('endDate','');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		var buttonProperty = null;
		buttonProperty = $('.apply-time-range-button').prop('disabled');
		
		expect(buttonProperty).toBe(true);
		
		model.set('startDate','');
		model.set('endDate','2016-01-05');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		var lastMonths = model.get('lastMonths');
		var startDate = model.get('startDate');
		var endDate = model.get('endDate');
		var waterYear = model.get('waterYear');
		
		var buttonProperty = null;
		buttonProperty = $('.apply-time-range-button').prop('disabled');
		
		expect(buttonProperty).toBe(true);
	});
	
	it("Error message should appear when start date is after end date", function() {
		model.set('startDate','2017-01-05');
		model.set('endDate','2018-01-05');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		var validate = dateField.validateDateRange();
		
		var errorMessage = null;
		errorMessage = $("#errorMsg").html();
		
		expect(validate).toBe(true);
		expect(errorMessage).toBeNull;
		
		model.set('startDate','2018-01-05');
		model.set('endDate','2017-01-05');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		var validate = dateField.validateDateRange();
		
		var errorMessage = null;
		errorMessage = $("#errorMsg").html();
		
		expect(validate).toBe(false);
		expect(errorMessage).not.toBeNull();
		
		model.set('startDate','2017-01-05');
		model.set('endDate','2018-01-05');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		var validate = dateField.validateDateRange();
		
		var errorMessage = null;
		errorMessage = $("#errorMsg").html();
		
		expect(validate).toBe(true);
		expect(errorMessage).toBeNull;
	});
	
	it("should set parentModel when water year is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
		
		$('.aqcu_field_waterYear').val('2012');
		$('.aqcu_field_waterYear').blur();
		dateField.delegateEvents();

		var dateFilter = model.get('dateFilter');
		
		expect(dateFilter).toBe('waterYear');
	});
	it("should set parentModel when lastMonthsr is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', '');
		model.set('waterYear','2012');
		
		$('.aqcu_field_lastMonths').val(12);
		$('.aqcu_field_lastMonths').change();
		dateField.delegateEvents();

		var dateFilter = model.get('dateFilter');
		
		expect(dateFilter).toBe('lastMonths');
	});
	
	it("should set parentModel when start date is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
		
		$('.aqcu_field_input_date_start').val("2012-12-01");
		$('.aqcu_field_input_date_start').blur();
		dateField.delegateEvents();

		var dateFilter = model.get('dateFilter');
		
		expect(dateFilter).toBe('startDate2012-12-01');
	});
	
	it("should set parentModel when end date is entered", function() {
		model.set('startDate','');
		model.set('endDate','');
		model.set('lastMonths', 12);
		model.set('waterYear','');
		
		$('.aqcu_field_input_date_end').val("2012-12-01");
		$('.aqcu_field_input_date_end').blur();
		dateField.delegateEvents();

		var dateFilter = model.get('dateFilter');
		
		expect(dateFilter).toBe('endDate2012-12-01');
	});
	
	it("should set parentModel when end date is changed", function() {
		model.set('startDate','2012-01-01');
		model.set('endDate','2012-10-01');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		$('.aqcu_field_input_date_end').val("2012-12-01");
		$('.aqcu_field_input_date_end').blur();
		dateField.delegateEvents();

		var dateFilter = model.get('dateFilter');
		
		expect(dateFilter).toBe('endDate2012-12-01');
	});
	it("should set parentModel when start date is changed", function() {
		model.set('startDate','2012-01-01');
		model.set('endDate','2012-10-01');
		model.set('lastMonths', '');
		model.set('waterYear','');
		
		$('.aqcu_field_input_date_start').val("2012-02-01");
		$('.aqcu_field_input_date_start').blur();
		dateField.delegateEvents();

		var dateFilter = model.get('dateFilter');
		
		expect(dateFilter).toBe('startDate2012-02-01');
	});



});

