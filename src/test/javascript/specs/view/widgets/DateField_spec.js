describe("DateField.js", function() {
	it("Defines these public attributes and API functions", function() {
		expect(AQCU.view.DateField).toBeDefined();
	});
	
	it("Sets Default Date Range", function() {
		var dateField;
		var model = new Backbone.Model();
		expect(model.get('startDate')).not.toBeDefined();
		expect(model.get('endDate')).not.toBeDefined();
		model.set('startDate','');
		model.set('endDate','');
		
		runs(function () {
			dateField = new AQCU.view.DateField({
				router  : this.router,
				model   : model,
				renderTo: $('.date-range'),
				format  : "yyyy-mm-dd",
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
			expect(dateField).toBeDefined();
	    });

	    waitsFor(function() {
	      return model.get('startDate') !== undefined && model.get('startDate') !== '';
	    }, 5000); 

	    runs(function () {
			expect(model.get('startDate')).toBeDefined();
			expect(model.get('endDate')).toBeDefined();
			
			expect(model.get('startDate').getDate()).toBe(new Date().getDate());
			expect(model.get('startDate').getMonth()).toBe(new Date().getMonth());
			expect(model.get('startDate').getYear()).toBe(new Date().getYear());
			expect(model.get('endDate').getDate()).toBe(new Date().getDate());
			expect(model.get('endDate').getMonth()).toBe(new Date().getMonth());
			expect(model.get('endDate').getYear()).toBe(new Date().getYear()+1);
	    });
			
	});
});

