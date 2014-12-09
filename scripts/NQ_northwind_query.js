//{1. Order Subtotals  訂單小計------------------------------------------------------------------
db.order_details.distinct("OrderID").length 830

db.order_details.aggregate(
	{$project:{
		_id:0,
		OrderID:"$OrderID",
		Subtotal:{$multiply : ["$UnitPrice", "$Quantity"]}
	}}
	,{$group:{
		_id:"$OrderID",
		Subtotal:{$sum:"$Subtotal"}
	}}
	,{$project:{
		_id:0,
		OrderID:"$_id",
		Subtotal:"$Subtotal"
	}}
	,{$sort:{OrderID:1}}
	//,{$out:"a1_orderSubtotal"}
).toArray()
}
[	{"Subtotal" : 440,	"OrderID" : "10248"	},
	{"Subtotal" : 1863.4,"OrderID" : "10249"},
	{"Subtotal" : 1813,	"OrderID" : "10250"	},
	{"Subtotal" : 670.8,"OrderID" : "10251"	},
	{"Subtotal" : 3730,	"OrderID" : "10252"	}]
	
//{2. Sales by Year 年度業績---------------------------------------------------------------------
db.northwind.aggregate(
	{$match : {
		//shippedDate:{//var startT = new Date(1996,12,24); var startT = new Date(1997,9,30); 
			//$gte:ISODate("1996-12-24T00:00:00.000Z"),//$gte:{$date:startT},
			//$lte:ISODate("1997-01-01T00:00:00.000Z")}//$lte:{$date:endT}}
        orderId:{$in:["10389","10371","10386","10390","10370"]}
	}}
	,{$unwind : "$orderItems"}
	,{$project : {
		"orderId" : 1,
		"shippedDate" : 1,
		"Year" : {	$year : "$shippedDate"},
		"customer" : 1,
		"orderItems.unitPrice" : 1,
		"orderItems.quantity" : 1,
		"orderItems.lineItemTotal" : {
			$multiply : [
				"$orderItems.unitPrice",
				"$orderItems.quantity", 
				{	$subtract : [(1.0).valueOf(), "$orderItems.discount"]	}
			]
		}
	}}
	,{$group : {
		_id : {
			"Year" : "$Year",
			"orderId" : "$orderId"
		},
		"shippedDate" : {$first : "$shippedDate"},
		"SubTotal" : {	$sum : "$orderItems.lineItemTotal"}
	}} 
	,{$sort : {"_id.shippedDate" : -1}}
	,{$project: {
		_id:0,
		shippedDate:1,
		orderId:"$_id.orderId",
		SubTotal:1,
		Year:"$_id.Year"
	}}
	//,{$out:"a2_salesByYear"} 
).toArray()
}
{ "_id" : { "Year" : 1997, "orderId" : "10684" }, "shippedDate" : ISODate("1997-09-29T16:00:00Z"), "SubTotal" : 1768 }
{ "_id" : { "Year" : 1997, "orderId" : "10682" }, "shippedDate" : ISODate("1997-09-30T16:00:00Z"), "SubTotal" : 375.5 }
{ "_id" : { "Year" : 1997, "orderId" : "10680" }, "shippedDate" : ISODate("1997-09-25T16:00:00Z"), "SubTotal" : 1682.5 }
{ "_id" : { "Year" : 1997, "orderId" : "10673" }, "shippedDate" : ISODate("1997-09-18T16:00:00Z"), "SubTotal" : 412.35 }
{ "_id" : { "Year" : 1997, "orderId" : "10671" }, "shippedDate" : ISODate("1997-09-23T16:00:00Z"), "SubTotal" : 920.1 }


{ "shippedDate" : ISODate("1996-12-24T16:00:00Z"), "SubTotal" : 166, "orderId" : "10386", "Year" : 1996 }
{ "shippedDate" : ISODate("1996-12-25T16:00:00Z"), "SubTotal" : 2275.2, "orderId" : "10390", "Year" : 1996 }
{ "shippedDate" : ISODate("1996-12-26T16:00:00Z"), "SubTotal" : 1174, "orderId" : "10370", "Year" : 1996 }
{ "shippedDate" : ISODate("1996-12-29T16:00:00Z"), "SubTotal" : 136, "orderId" : "10366", "Year" : 1996 }
{ "shippedDate" : ISODate("1996-12-30T16:00:00Z"), "SubTotal" : 86.39999999999999, "orderId" : "10391", "Year" : 1996 }
{ "shippedDate" : ISODate("1996-12-31T16:00:00Z"), "SubTotal" : 1440, "orderId" : "10392", "Year" : 1996 }

//3. Employee Sales by Country 國別業務人員業績--------------------------------------------------

//4. Alphabetical List of Products 產品清單依照筆畫排--------------------------------------------
> db.producting.find().sort({ProductName:1})

//5. Current Product List 目前產品清單-----------------------------------------------------------
db.products.find({Discontinued:"0"},{_id:0,ProductID:1,ProductName:1})

{ "ProductID" : "3", "ProductName" : "Aniseed Syrup" }
{ "ProductID" : "4", "ProductName" : "Chef Anton's Cajun Seasoning" }
{ "ProductID" : "6", "ProductName" : "Grandma's Boysenberry Spread" }

//{6. Order Details Extended 訂貨明細小計---------------------------------------------------------
db.northwind.aggregate(
    //{$match : {"orderId":"10248"}},
	{$unwind : "$orderItems"}
	,{$project : {
		_id:0,
		OId : "$orderId",
		PId : "$orderItems.productId",
		PName : "$orderItems.productName",
		Unit$ : "$orderItems.unitPrice",
		Quantity : "$orderItems.quantity",
		Discount : "$orderItems.discount",
		//"discount":,Number("1"),(1.0).valueOf()
		Extended$ : {
			$multiply : [
				"$orderItems.unitPrice",
				"$orderItems.quantity", 
				{	$subtract : [(1.0).valueOf(), "$orderItems.discount"]	}
			]
		}
	}}
	//,{$out:"a6_orderDetailsExtended"}
).toArray()
}
[
	{	"OId" : "11077","PId" : "41","PName" : "Jack's New England Clam Chowder",
		"Unit$" : 9.65,		"Quantity" : 3,		"Discount" : 0,		"Extended$" : 28.950000000000003	},
	{	"OId" : "11077","PId" : "52","PName" : "Filo Mix",
		"Unit$" : 7,		"Quantity" : 2,		"Discount" : 0,		"Extended$" : 14	},
	{	"OId" : "11077","PId" : "75","PName" : "Rhonbrau Klosterbier",
		"Unit$" : 7.75,		"Quantity" : 4,		"Discount" : 0,		"Extended$" : 31	}
]

//{7. Sales by Category 產品類別業績--------------------------------------------------------------
db.northwind.aggregate(
	{$match : {
		shippedDate:{//var startT = new Date(1996,12,24); var startT = new Date(1997,9,30); 
			$gte:ISODate("1997-01-01T00:00:00.000Z"),//$gte:{$date:startT},
			$lte:ISODate("1998-01-01T00:00:00.000Z")}//$lte:{$date:endT}}
	}}
	,{$unwind : "$orderItems"}
	,{$project : {
		"orderItems.categoryID":1,
		"orderItems.categoryName":1,
		"orderItems.productId":1,
		"orderItems.productName":1,
		"orderItems.lineItemTotal" : {
			$multiply : ["$orderItems.unitPrice", "$orderItems.quantity",
			{	$subtract : [(1.0).valueOf(), "$orderItems.discount"]	}]
		}
	}} 
	,{$group : {
		_id : {
			categoryID : "$orderItems.categoryID",
			CategoryName : "$orderItems.categoryName",
			ProductName : "$orderItems.productName"
		},
		ProductSales : {$sum : "$orderItems.lineItemTotal"}
	}}
	,{$sort : {"_id.CategoryName":1,"_id.ProductName":1}}
	,{$project :{
		_id:0,
		CategoryName : "$_id.CategoryName",
        ProductName:"$_id.ProductName",
		ProductSales : 1
	}}
	//,{$out:"a7_SalesbyCategory"} 
)
}
{ "_id" : { "CategoryName" : "Beverages", "ProductName" : "Chai" }, 			"ProductSales" : 4887 }
{ "_id" : { "CategoryName" : "Beverages", "ProductName" : "Chang" }, 			"ProductSales" : 7038.549999999999 }
{ "_id" : { "CategoryName" : "Beverages", "ProductName" : "Chartreuse verte" }, "ProductSales" : 4475.700000000001 }
{ "_id" : { "CategoryName" : "Beverages", "ProductName" : "Cote de Blaye" }, 	"ProductSales" : 46563.085 }
{ "_id" : { "CategoryName" : "Beverages", "ProductName" : "Guarana Fantastica" }, "ProductSales" : 1553.625 }

//{8. Ten Most Expensive Products 10個最貴商品----------------------------------------------------
> db.products.find({},{_id:0,ProductName:1,UnitPrice:1}).sort({UnitPrice:-1}).limit(10)
}
{ "ProductName" : "Cote de Blaye", "UnitPrice" : 263.5 }
{ "ProductName" : "Thuringer Rostbratwurst", "UnitPrice" : 123.79 }
{ "ProductName" : "Mishi Kobe Niku", "UnitPrice" : 97 }

//{9. Products by Category 產品-依類別區分--------------------------------------------------------


//{10. Customers and Suppliers by City 客戶與共應商城市排列---------------------------------------
//10.1
db.contact_list.drop();
var customers = db.customers.find();
while (customers.hasNext()) {
    var customer = customers.next();
	customer = {"customer" : customer};
	db.contact_list.insert(customer);
}
var suppliers = db.suppliers.find();
while (suppliers.hasNext()) {
	var supplier = suppliers.next();
	supplier = { "supplier": supplier};
	//printjson(supplier);
	db.contact_list.insert(supplier);
}
> db.contact_list.find({},{_id:0,"customer.CompanyName":1,"supplier.CompanyName":1});
//10.2
db.contact_list.drop();
var customers = db.customers.find();
while (customers.hasNext()) {
    var customer = customers.next();
	customer.Relationship = "customer";
	db.contact_list.insert(customer);
}
var suppliers = db.suppliers.find();
while (suppliers.hasNext()) {
	var supplier = suppliers.next();
	supplier.Relationship = "supplier";
	//printjson(supplier);
	db.contact_list.insert(supplier);
}
}
> db.contact_list.find({},{_id:0,City:1,CompanyName:1,ContactName:1,Relationship:1})
{ "CompanyName" : "Alfreds Futterkiste", "ContactName" : "Maria Anders", "City" : "Berlin", "relation" : "customer" }
{ "CompanyName" : "Ana Trujillo Emparedados y helados", "ContactName" : "Ana Trujillo", "City" : "Mexico D.F.", "relation" : "customer" }
{ "CompanyName" : "Antonio Moreno Taqueria", "ContactName" : "Antonio Moreno", "City" : "Mexico D.F.", "relation" : "customer" }
{ "CompanyName" : "Around the Horn", "ContactName" : "Thomas Hardy", "City" : "London", "relation" : "customer" }
{ "CompanyName" : "Berglunds snabbkop", "ContactName" : "Christina Berglund", "City" : "Lulea", "relation" : "customer" }

//{11. Products Above Average Price 產品單價高於平均單價清單--------------------------------------
var avgPrice;
db.products.aggregate(
	{$group : {
		_id : null,
		avg : {$avg:"$UnitPrice"}
	}}
).forEach(function(doc){
	avgPrice = doc.avg;
});
//avgPriceResult
db.products.aggregate(
	{$match : {UnitPrice:{$gte:avgPrice}}}
	,{$project : {
		_id:0,
		
		UnitPrice : 1,
		ProductName : 1,
	}}
	//,{$out:"a11_orderDetailsExtended"}
).toArray()
}
{ "ProductName" : "Uncle Bob's Organic Dried Pears", 	"UnitPrice" : 30 }
{ "ProductName" : "Northwoods Cranberry Sauce", 		"UnitPrice" : 40 }
{ "ProductName" : "Mishi Kobe Niku", 					"UnitPrice" : 97 }
{ "ProductName" : "Queso Manchego La Pastora", 			"UnitPrice" : 38 }
{ "ProductName" : "Alice Mutton", 						"UnitPrice" : 39 }


//{12. Product Sales for 1997 產品銷售業績1997----------------------------------------------------
db.northwind.aggregate(
	{$match : {
		shippedDate:{//var startT = new Date(1996,12,24); var startT = new Date(1997,9,30); 
			$gte:ISODate("1997-01-01T00:00:00.000Z"),//$gte:{$date:startT},
			$lte:ISODate("1998-01-01T00:00:00.000Z")}//$lte:{$date:endT}}
	}}
	,{$project : { //計算qtr
		_id : 1,		
		"orderItems.productName" : 1,
		"orderItems.categoryName" : 1,
		"qtr" : { $let: {vars: {	quarter:{$add : [{$divide : [{$subtract : [{$month : "$orderDate"}, 1]}, 3]}, 1]}
					},	in:{$subtract : ["$$quarter", {	$mod : ["$$quarter", 1]}]}
				}},
		"orderItems.unitPrice" : 1,
		"orderItems.quantity" : 1,
		"orderItems.discount" : 1
	}}
	,{$unwind : "$orderItems"}
	,{$match:{"orderItems.categoryName" :"Beverages"}}//,"customer.companyName":"Ernst Handel"}},
	,{$project : { //業績
		_id : 1,
		"orderItems.categoryName" : 1,
		"orderItems.productName" : 1,
		"qtr" : 1,
		"orderItems.lineItemTotal" : {
			$multiply : ["$orderItems.unitPrice", "$orderItems.quantity", 
						{$subtract : [(1.0).valueOf(), "$orderItems.discount"]}	]
		}
	}}
	,{$group : {//group product
		_id : {
			"ShippedQuarter" : "$qtr",
			"categoryName" : "$orderItems.categoryName",
			"productName" : "$orderItems.productName"
		},	"Sales" : {	$sum : "$orderItems.lineItemTotal"}
	}}
	,{$sort:{"_id.categoryName":1,"_id.productName":1,"_id.qtr":1}}
	,{$project : {
		_id:0,
		"ShippedQuarter" : "$_id.ShippedQuarter",
		"categoryName" : "$_id.categoryName",
		"productName" : "$_id.productName",
		"Sales":1
	}}
	//,{$out:"a12_productSalesfor1997"} 
).toArray()
}
{ "_id" : { "ShippedQuarter" : 3, "categoryName" : "Beverages", "productName" : "Chai" }, "Sales" : 1647 }
{ "_id" : { "ShippedQuarter" : 4, "categoryName" : "Beverages", "productName" : "Chai" }, "Sales" : 1656 }
{ "_id" : { "ShippedQuarter" : 2, "categoryName" : "Beverages", "productName" : "Chai" }, "Sales" : 878.4 }
{ "_id" : { "ShippedQuarter" : 1, "categoryName" : "Beverages", "productName" : "Chai" }, "Sales" : 705.6 }
{ "_id" : { "ShippedQuarter" : 4, "categoryName" : "Beverages", "productName" : "Chang" }, "Sales" : 2313.25 }


//{13. Category Sales for 1997 產品類別銷售業績 1997----------------------------------------------
db.northwind.aggregate(
	{$match : {
		shippedDate:{//var startT = new Date(1996,12,24); var startT = new Date(1997,9,30); 
			$gte:ISODate("1997-01-01T00:00:00.000Z"),//$gte:{$date:startT},
			$lte:ISODate("1998-01-01T00:00:00.000Z")}//$lte:{$date:endT}}
	}}
	,{$unwind : "$orderItems"}
	,{$project : {
		"orderItems.categoryID":1,
		"orderItems.categoryName":1,
		"orderItems.lineItemTotal" : {
			$multiply : ["$orderItems.unitPrice", "$orderItems.quantity",
			{	$subtract : [(1.0).valueOf(), "$orderItems.discount"]	}]
		}
	}} 
	,{$group : {
		_id : {
			CategoryName : "$orderItems.categoryName",
		},
		CategorySales : {$sum : "$orderItems.lineItemTotal"}
	}}
	,{$sort : {CategoryName:1,ProductName:1}}
	,{$project :{
		_id:0,
		CategoryName : "$_id.CategoryName",
		CategorySales : 1
	}}
	//,{$out:"a3_categorySalesfor1997"} 
)
}
{ "_id" : { "CategoryName" : "Condiments" }, "CategorySales" : 55277.59 }
{ "_id" : { "CategoryName" : "Grains/Cereals" }, "CategorySales" : 55948.825 }
{ "_id" : { "CategoryName" : "Produce" }, "CategorySales" : 53019.98750000001 }
{ "_id" : { "CategoryName" : "Confections" }, "CategorySales" : 80894.15149999999 }
{ "_id" : { "CategoryName" : "Beverages" }, "CategorySales" : 102074.305 }

//{14. Quarterly Orders by Product 產品別銷貨季報表-----------------------------------------------
db.northwind.aggregate(
	{$match : {
		orderDate:{//var startT = new Date(1996,12,24); var startT = new Date(1997,9,30); 
			$gte:ISODate("1997-01-01T00:00:00.000Z"),//$gte:{$date:startT},
			$lte:ISODate("1998-01-01T00:00:00.000Z")}//$lte:{$date:endT}}
	}}
	,{$project : { //計算qtr
		_id : 1,
		"orderId" : 1,
		"orderDate" : 1,
		
		"orderItems.productName" : 1,
		"customer.companyName" : 1,
		"qtr" : { $let: {vars: {	quarter:{$add : [{$divide : [{$subtract : [{$month : "$orderDate"}, 1]}, 3]}, 1]}
					},	in:{$subtract : ["$$quarter", {	$mod : ["$$quarter", 1]}]}
				}},
		"orderItems.unitPrice" : 1,
		"orderItems.quantity" : 1,
		"orderItems.discount" : 1
	}}  
	,{$unwind : "$orderItems"}
	//{$match:{"orderItems.productName" :"Alice Mutton"}},//,"customer.companyName":"Ernst Handel"}},
	,{$project : { //業績
		_id : 1,
		"orderId" : 1,
		"orderDate" : 1,
		"orderItems.productName" : 1,
		"customer.companyName" : 1,
		"qtr" : 1,
		"OrderYear" : {	$year : "$orderDate"},
		"orderItems.lineItemTotal" : {
			$multiply : ["$orderItems.unitPrice", "$orderItems.quantity", 
						{$subtract : [(1.0).valueOf(), "$orderItems.discount"]}	]
		}
	}}
	,{$group : {//group product
		_id : {
			"qtr" : "$qtr",
			"OrderYear" : "$OrderYear",
			"productName" : "$orderItems.productName",
			"companyName" : "$customer.companyName"
		},
		"total" : {
				$sum : "$orderItems.lineItemTotal"
		}
	}}
	,{$sort:{"_id.productName":1,"_id.companyName":1,"_id.OrderYear":1,"_id.qtr":1}}
	,{$project : {
		_id:0,
		"qtr" : "$_id.qtr",
		"OrderYear" : "$_id.OrderYear",
		"productName" : "$_id.productName",
		"companyName" : "$_id.companyName",
		"total":1
	}}
	,{$group : {//push qtr
		_id : {
			"OrderYear" : "$OrderYear",
			"productName" : "$productName",
			"companyName" : "$companyName"
		},
		"Sales" : {
			$push :{
				"qtr" : "$qtr",
				"total":"$total"}
		}
	}}
).toArray()
}}
{ "_id" : { "OrderYear" : 1997, "productName" : "Zaanse koeken", "companyName" : "Wellington Importadora" }, "Sales" : [ { "qtr" : 2, "total" : 142.5 } ] }
{ "_id" : { "OrderYear" : 1997, "productName" : "Zaanse koeken", "companyName" : "Save-a-lot Markets" }, "Sales" : [ { "qtr" : 3, "total" : 95 }, { "qtr" : 4, "total" : 356.25 } ] }
{ "_id" : { "OrderYear" : 1997, "productName" : "Zaanse koeken", "companyName" : "QUICK-Stop" }, "Sales" : [ { "qtr" : 1, "total" : 418 } ] }
{ "_id" : { "OrderYear" : 1997, "productName" : "Zaanse koeken", "companyName" : "Morgenstern Gesundkost" }, "Sales" : [ { "qtr" : 4, "total" : 114 } ] }
{ "_id" : { "OrderYear" : 1997, "productName" : "Zaanse koeken", "companyName" : "Great Lakes Food Market" }, "Sales" : [ { "qtr" : 3, "total" : 51.300000000000004 } ] }



//15. Invoice 發票-------------------------------------------------------------------------------
db.northwind.aggregate(
	{$unwind : "$orderItems"}
	,{$project : {
		"orderId" : 1,
		"customer" : 1,
		"salesperson":"$employee",
		"orderDate" : 1,
		"requiredDate" :1,
		"shippedDate" : 1,
		"shipVia" : 1,
		"freightCost" : 1,
		unitPrice : "$orderItems.unitPrice",
		quantity : "$orderItems.quantity",
		discount: "$orderItems.discount",
		ExtendedPrice : {
			$multiply : [	
				"$orderItems.unitPrice", 
				"$orderItems.quantity",
				{$subtract : [(1.0).valueOf(),"$orderItems.discount"]} 
			]
		}
	}}
	,{$sort : {"shipVia" :1}}
	,{$match : {orderId:"11011"}}
	,{$group : {
		_id : {
			"orderId" : "$orderId"
		},
		"customer" : 	{$first:"$customer"},
		"salesperson":	{$first:"$salesperson"},
		
		"requiredDate" :{$first:"$requiredDate"},
		"shippedDate" : {$first:"$shippedDate"},
		"shipVia" : 	{$first:"$shipVia"},
		"freightCost" : {$first:"$freightCost"},
		
		"unitPrice" : 	{$first:"$orderItems.unitPrice"},
		"quantity" : 	{$first:"$orderItems.quantity"},
		"discount":		{$first:"$orderItems.discount"},
		"ExtendedPrice" : {	$sum : "$orderItems.lineItemTotal"}
	}} 
	
	,{$project: {
		_id:0,
		"orderId":"$_id.orderId",
		"customer" : 	1,
		"salesperson":	1,
		
		"requiredDate" :1,
		"shippedDate" : 1,
		"shipVia" : 	1,
		"freightCost" : 1,
		
		"unitPrice" : 	1,
		"quantity" : 	1,
		"discount":		1,
		"ExtendedPrice":1
	}}
	//,{$out:"a15_invoice"} 
).toArray()


//16. Number of units in stock by category and supplier continent 產品類別業績-------------------
db.producting.aggregate(
{"$project" : {
	"_id" : 0,
	"CategoryName":1,
	"UnitsInStock":1,
	"Continent" : {
		"$cond" : [
			{"$Country" : {$in:["UK","Spain","Sweden","Germany","Norway",'Denmark','Netherlands','Finland','Italy']}},
			"Europe", {
			"$cond" : {"$Country" :{$in ['USA','Canada','Brazil']}},
					"America" ,
					"Asia-Pacific"
				
			}
		]
	}
}})
//{17. Customer vs. Supplier 客戶供應商比例-------------------------------------------------------
> db.customers.count()
91
> db.suppliers.count()
29
> var ccount = db.customers.count()
> var scount = db.suppliers.count()
> ccount/scount
3.1379310344827585
}


>s51




>s51
db.producting.aggregate(
{"$project" : {
	"_id" : 0,
	"CategoryName":1,
	"UnitsInStock":1,
	Continent : {
		$cond : {
			if:{    "$Country":{$in : ["USA","Canada","Brazil"]}    },
			then:"America",
			else:"other"
		}
	}
}})

db.producting.find({"Country":{$in : ["UK","Spain","Sweden","Germany","Norway",'Denmark','Netherlands','Finland','Italy']}})
db.inventory.find( { tags: { $in: [ /^be/, /^st/ ] } } )
db.inventory.aggregate(
{
 $project: {
	 item: 1,
	 discount:  {
		 $cond: {
			if: { $gte: [ "$qty", 250 ] }, 
			then: 30, 
			else: 20 
		}
	}
}})
