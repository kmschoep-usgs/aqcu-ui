describe("DateField.js", function() {
	var dateField;
	var model;
	
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
				
		dateField = new AQCU.view.DateField({
			el : '.date-range',
			parentModel  : model
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
	
	it("should clear other fields when water year is entered, then clear water year when lastMonths reentered", function() {
		$('.aqcu_field_waterYear').val('2012');
		$('.aqcu_field_waterYear').blur();
		dateField.delegateEvents();

		var dateSelection = model.get('dateSelection');
		expect(dateSelection.lastMonths).toBeUndefined();
		expect(dateSelection.startDate).toBeUndefined();
		expect(dateSelection.endDate).toBeUndefined();
		expect(dateSelection.waterYear).toBe('2012');
	});
	
	it("should clear other fields when water year is entered", function() {
		$('.aqcu_field_waterYear').val('2012');
		$('.aqcu_field_waterYear').blur();
		dateField.delegateEvents();

		var dateSelection = model.get('dateSelection');
		expect(dateSelection.lastMonths).toBeUndefined();
		expect(dateSelection.startDate).toBeUndefined();
		expect(dateSelection.endDate).toBeUndefined();
		expect(dateSelection.waterYear).toBe('2012');
		

		$('.aqcu_field_lastMonths').val(10);
		$('.aqcu_field_lastMonths').change();
		dateField.delegateEvents();
		
		var dateSelection = model.get('dateSelection');
		expect(dateSelection.lastMonths).toBe('10');
		expect(dateSelection.startDate).toBeUndefined();
		expect(dateSelection.endDate).toBeUndefined();
		expect(dateSelection.waterYear).toBeUndefined();
	});
	
	it("should update endDate if null and clear lastMonths/waterYear when start date is entered", function() {
		$('.aqcu_field_input_date_start').val("2012-12-01");
		$('.aqcu_field_input_date_start').change();
		
		var dateSelection = model.get('dateSelection');
		expect(dateSelection.lastMonths).toBeUndefined();
		expect(dateSelection.waterYear).toBeUndefined();
		testDate('expected startDate as set', dateSelection.startDate, 2012, 12, 1);
		testDate('endDate set to startDate', dateSelection.endDate,  2012, 12, 1);
		
		//end date should do the same
		$('.aqcu_field_input_date_start').val(""); //clearing start date clears both dates and sets to default
		$('.aqcu_field_input_date_start').change();
		
		var dateSelection = model.get('dateSelection');
		expect(dateSelection.lastMonths).toBe(12);
		expect(dateSelection.waterYear).toBeUndefined();
		expect(dateSelection.startDate).toBeUndefined();
		expect(dateSelection.endDate).toBeUndefined();
		

		$('.aqcu_field_input_date_end').val("2013-12-01");
		$('.aqcu_field_input_date_end').change();
		
		var dateSelection = model.get('dateSelection');
		expect(dateSelection.lastMonths).toBeUndefined();
		expect(dateSelection.waterYear).toBeUndefined();
		testDate('startDate matches endDate', dateSelection.startDate, 2013, 12, 1);
		testDate('endDate as set', dateSelection.endDate,  2013, 12, 1);
	});
});

