describe("query.js", function() {
	it("has these dependencies", function() {
	});

	it("defines these API functions and fields", function() {
		expect(AQCU.util.query).toBeDefined();
		expect(AQCU.util.query.getQueryAllParameters).toBeDefined();
		expect(AQCU.util.query.getDisplayNameFromConfig).toBeDefined();
		expect(AQCU.util.query.isRangeTypeField).toBeDefined();
	});
});

describe("AQCU.util.query.getQueryAllParameters", function() {
	it("correctly produces all parameters from an array of search models", function() {
		var testModel1 = new Backbone.Model();
		testModel1.serviceView = "aViewName";

		testModel1.fieldConfig = [
			{fieldName: "field1"},
			{fieldName: "field2", exp: "exp2"}
		];
		testModel1.set("field1", "value1");
		testModel1.set("field2", "value2");

		var testModel2 = new Backbone.Model();
		testModel2.serviceView = "anotherViewName";

		testModel2.fieldConfig = [
			{fieldName: "field12"},
			{fieldName: "field22", exp: "exp2"}
		];
		testModel2.set("field12", "value12");
		testModel2.set("field22", "value22");

		var params = AQCU.util.query.getQueryAllParameters([testModel1, testModel2]);
		expect(params["aViewName.field1"]).toBe("value1");
		expect(params["aViewName.field2.exp2"]).toBe("value2");
		expect(params["anotherViewName.field12"]).toBe("value12");
		expect(params["anotherViewName.field22.exp2"]).toBe("value22");
	});
});


describe("AQCU.util.query.getDisplayNameFromConfig", function() {
	it("correctly finds the display name of a field in a search model", function() {
		var testModel = new Backbone.Model();
		testModel.serviceView = "aViewName";

		testModel.fieldConfig = [
			{fieldName: "field1", displayName: "FIELD 1 DISPLAY"}, //given just a field
			{fieldName: "field2", exp: "exp2", displayName: "FIELD 2 DISPLAY"}, //given an overriding expression
			{fieldName: "field3", exp: "exp3", dataType: "dataType3", displayName: "FIELD 3 DISPLAY"} //given a data type
		];

		expect(AQCU.util.query.getDisplayNameFromConfig(testModel, "field1")).toBe("FIELD 1 DISPLAY");
		expect(AQCU.util.query.getDisplayNameFromConfig(testModel, "field2")).toBe("FIELD 2 DISPLAY");
		expect(AQCU.util.query.getDisplayNameFromConfig(testModel, "field3")).toBe("FIELD 3 DISPLAY");
	});
});

