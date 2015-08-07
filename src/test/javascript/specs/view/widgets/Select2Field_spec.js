describe("Select2Field.js", function() {

	var select2;
	var model;
	
	var setupDom = function(){
		if ($('.select2').length === 0) {
			// this does not load the CSS
			$(document.head).append( $('<link rel="stylesheet" type="text/css" href="/webjars/select2/4.0.0/css/select2.css"/>') );
			// this CSS also is not applied
			$(document.head).append( $('<style>.dropdownCssClass{width:33px;} .vision_select_field_asdf{color:red;} span{color:red;}</style>') );
			// this is necessary - a landing place for the widget
		    $(document.body).append( $('<div class="select2"></div>') );
		}
	}
	
	beforeEach(function(){
		setupDom();
		
		model = new Backbone.Model({
			asdf1:"",
			asdf2:"",
			asdf3:"",
		});
		
		select2 = new AQCU.view.Select2Field({
			el:'.select2',
			model:model,
			fieldConfig: {
				fieldName   : "asdf1",
			},
			select2: {
				placeholder : "some placeholder text",
				dropdownCssClass: "dropdownCssClass",
			}	
		});
	});
	
	afterEach(function(){
		$('.select2').html('');
	});
	
	
	it("Defines these public attributes and API functions", function() {
		since('select2 definition').expect(AQCU.view.Select2Field).toBeDefined();
		since('select2 instance').expect(select2).toBeDefined();
	});
	
	
	it('injects DOM elements',function(){
		since('shoule no longer create a hidden input with id class').expect($('.vision_field_asdf1').length).toBe(0);
		since('Create select with id class').expect($('.vision_select_field_asdf1').length).toBe(1);
		since('Placeholder text should be set').expect($('.select2-selection__placeholder').text()).toBe("some placeholder text");
	});
	
	
	it('should fire bindings on change',function(){
		$(select2.selector).html('');
		$(select2.selector).append($('<option value="1">option 1</otpion>'))
		$(select2.selector).append($('<option value="2">option 2</otpion>'))
		$(select2.selector).append($('<option value="3">option 3</otpion>'))
		
		// we cannot test this until the select2 css can be loaded
//		since('Drop down class should be used').expect($('.dropdownCssClass').length).toBe(1);
		
		since('initial value should be empty because of tests do not suppor ajax').expect( model.get('asdf1') ).toBe('');
		$(select2.selector).val('2').change();
		since('model binding should set model value').expect( model.get('asdf1') ).toBe('2');
		model.set('asdf1','3');
		since('model binding should set element value').expect( $(select2.selector).val() ).toBe('3');
	})

	
	it('should accept custom model field name',function(){
	    $('div.select2').append( $('<div class="select2field"></div>') );		
		
		select2field = new AQCU.view.Select2Field({
			el:'.select2field',
			modelField: 'asdf4',
			model:model,
			fieldConfig: {
				fieldName   : "asdf2",
				displayName : "ASDF2",
			},
			select2: {
				placeholder : "some other placeholder text",
			}	
		});
		
		$(select2field.selector).html('');
		$(select2field.selector).append($('<option value="1">option 1</otpion>'))
		$(select2field.selector).append($('<option value="2">option 2</otpion>'))
		$(select2field.selector).append($('<option value="3">option 3</otpion>'))
		
		since('initial value should be empty because of tests do not suppor ajax').expect( model.get('asdf4') ).toBe('');
		$(select2field.selector).val('2').change();
		since('model binding should set model value').expect( model.get('asdf4') ).toBe('2');
		model.set('asdf4','3');
		since('model binding should set element value').expect( $(select2field.selector).val() ).toBe('3');
	})

	
	it('should show a field label (and description) only when given display name (and description)',function(){
		since('No display name is given there should be no <label> elements for display name')
			.expect( $('label').length ).toBe(0);
		since('No decription is given there should be no <i> elements for description')
			.expect( $('i').length ).toBe(0);
		
	    $('div.select2').append( $('<div class="select2labeled"></div>') );		
	    $('div.select2').append( $('<div class="select2described"></div>') );		
		
		select2label = new AQCU.view.Select2Field({
			el:'.select2labeled',
			model:model,
			fieldConfig: {
				fieldName   : "asdf2",
				displayName : "ASDF2",
			},
			select2: {
				placeholder : "some other placeholder text",
			}	
		});

		since('No decription is given there should be no <i> elements for description')
			.expect( $('i').length ).toBe(0);
		var labeled = $('label');
		since('A display name is given there should be a label single element')
			.expect( labeled.length ).toBe(1);
		since('A display name is given, ASDF2, there should be a label with that text')
			.expect( labeled.text().trim() ).toBe("ASDF2");

		select2desc = new AQCU.view.Select2Field({
			el:'.select2described',
			model:model,
			fieldConfig: {
				fieldName   : "asdf3",
				displayName : "ASDF3",
				description : "ASDF3 Description"
			},
			select2: {
				placeholder : "another placeholder text",
			}	
		});

		var desc = $('i.fa');
		since('With a decription is given there should be an <i> elements for description')
			.expect( desc.length ).toBe(1);
		since('A decription is given, ASDF3 Description, there should be a <i> element with that text')
			.expect( desc[0].title ).toBe("ASDF3 Description");
		
	});

});

