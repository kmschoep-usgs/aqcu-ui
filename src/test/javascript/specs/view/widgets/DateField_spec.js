describe("DateField.js", function() {
	var dateField;
	var model;
	
	var testDate = function(description, dateStr, expectedYear, expectedMonth, expectedDate) {
		since(description + " is " + dateStr).expect(dateStr).toBeDefined();
		
		var parts = dateStr.split('-');
		
		since(description + " year").expect(parseInt(parts[0])).toBe(expectedYear);
		since(description + " month").expect(parseInt(parts[1])).toBe(expectedMonth);
		since(description + " day").expect(parseInt(parts[2])).toBe(expectedDate);
	}

	afterEach(function(){
		$('.date-range').html('');
	});
	
	beforeEach(function(){
		model = new Backbone.Model();
		expect(model.get('startDate')).not.toBeDefined();
		expect(model.get('endDate')).not.toBeDefined();
		
		model.set('startDate','');
		model.set('endDate','');
		
		var dom = $('<div class="date-range"></div>');
	    $(document.body).append(dom);
		
		dateField = new AQCU.view.DateField({
			el     : '.date-range',
			renderTo : $('.date-range'),
			model  : model,
			format : "yyyy-mm-dd",
			fieldConfig: {
				isDateRange        : true,
				includeLastMonths  : true,
				includeWaterYear   : true,
				startDateFieldName : "startDate",
				endDateFieldName   : "endDate",
				displayName        : "Date Range",
				fieldName          : "date_range",
				description        : "",
			},
		});
	});
	
	it("defines these public attributes and API functions", function() {
		expect(AQCU.view.DateField).toBeDefined();
		expect(dateField).toBeDefined();
		expect(model).toBeDefined();
	});
	
	it("should set default start and end date", function() {
	    var test = model.get('startDate') !== undefined && model.get('startDate') !== '';
	    since('expect date fields to be initialized').expect(test).toBeTruthy();

		var date = new Date();
		testDate('initial startDate', model.get('startDate'), date.getYear()+1900-1, date.getMonth()+1, date.getDate());
		testDate('initial endDate', model.get('endDate'), date.getYear()+1900, date.getMonth()+1, date.getDate());
	});
});

