//N.1.northwind producting collection
db.producting.drop();
var product_map = {}, supplier_map = {}, category_map = {};
function buildProductMap() {
    var obj = {};
    var products = db.products.find({});

    products.forEach(function(product) {
        obj = {
            name:product.ProductID,
            supplier: product.SupplierID, 
			category: product.CategoryID
        };
        product_map[product.ProductID] = obj;
    });
}

// build supplier map
function buildSupplierMap() {
    var obj = {};
    var suppliers = db.suppliers.find({});

    suppliers.forEach(function(supplier) {
        obj = { name:supplier.CompanyName, country:supplier.Country };
        supplier_map[supplier.SupplierID] = obj;
    });
}

// build category map
function buildCategoryMap() {
    var obj = {};
    var categories = db.categories.find({});

    categories.forEach(function(category) {
        obj = { name:category.CategoryName };
        category_map[category.CategoryID] = obj;
    });
}
buildProductMap();
buildSupplierMap();
buildCategoryMap();
var item = db.products.find();
    item.forEach(function(item) {
		//embed
        sup_id = product_map[item.ProductID].supplier;
        item.CompanyName = supplier_map[sup_id].name;
		item.Country = supplier_map[sup_id].country;

        cat_id = product_map[item.ProductID].category;
        item.CategoryName = category_map[cat_id].name;

        //printjson(item);
        db.producting.insert(item);
    });
	
	
/*
[
	{
		"_id" : ObjectId("546afb05dac318b3f5758d50"),
		"ProductID" : "1",
		"ProductName" : "Chai",
		"SupplierID" : "1",
		"CategoryID" : "1",
		"QuantityPerUnit" : "10 boxes x 20 bags",
		"UnitPrice" : 18,
		"UnitsInStock" : 39,
		"UnitsOnOrder" : 0,
		"ReorderLevel" : 10,
		"Discontinued" : "0",
		"CompanyName" : "Exotic Liquids",
		"CategoryName" : "Beverages"
	},
	{
		"_id" : ObjectId("546afb05dac318b3f5758d77"),
		"ProductID" : "40",
		"ProductName" : "Boston Crab Meat",
		"SupplierID" : "19",
		"CategoryID" : "8",
		"QuantityPerUnit" : "24 - 4 oz tins",
		"UnitPrice" : 18.4,
		"UnitsInStock" : 123,
		"UnitsOnOrder" : 0,
		"ReorderLevel" : 30,
		"Discontinued" : "0",
		"CompanyName" : "New England Seafood Cannery",
		"CategoryName" : "Seafood"
	},
	{
		"_id" : ObjectId("546afb05dac318b3f5758d52"),
		"ProductID" : "3",
		"ProductName" : "Aniseed Syrup",
		"SupplierID" : "1",
		"CategoryID" : "2",
		"QuantityPerUnit" : "12 - 550 ml bottles",
		"UnitPrice" : 10,
		"UnitsInStock" : 13,
		"UnitsOnOrder" : 70,
		"ReorderLevel" : 25,
		"Discontinued" : "0",
		"CompanyName" : "Exotic Liquids",
		"CategoryName" : "Condiments"
	}
]
*/
