describe("local_storage.js", function() {
	it("Defines these public attributes and API functions", function() {
		expect(AQCU.util.localStorage).toBeDefined();
		expect(AQCU.util.localStorage.getData).toBeDefined();
		expect(AQCU.util.localStorage.setData).toBeDefined();
	});
});

describe("AQCU.util.localStorage", function() {
	it("Has functions which store and retrieve data", function() {
		var testData = {
				field1: "value1",
				field2: "value2"
		}
		
		AQCU.util.localStorage.setData("myTestData", testData);
		
		var retrievedTestData = AQCU.util.localStorage.getData("myTestData");
		
		expect(retrievedTestData.field1).toBe("value1");
		expect(retrievedTestData.field2).toBe("value2");
	});
});

