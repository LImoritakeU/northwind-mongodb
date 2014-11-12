// 1. Order Subtotals
db.order_details.distinct("OrderID").length 830

db.order_details.find().forEach( function (doc) {
  doc.UnitPrice = parseFloat(doc.UnitPrice); 
  doc.Quantity = parseFloat(doc.Quantity); 
  doc.Discount = parseFloat(doc.Discount); 
  db.order_details.save(doc);
});

db.order_details.aggregate(
	{$project:{
		_id:0,
		OrderID:"$OrderID",
		Subtotal:{$multiply : ["$UnitPrice", "$Quantity"]}
	}},
	{$group:{
		_id:"$OrderID",
		Subtotal:{$sum:"$Subtotal"}
	}},
	{$project:{
		_id:0,
		OrderID:"$_id",
		Subtotal:"$Subtotal"
	}},
	{$sort:{OrderID:1}}
).toArray()
[	{"Subtotal" : 440,	"OrderID" : "10248"	},
	{"Subtotal" : 1863.4,"OrderID" : "10249"},
	{"Subtotal" : 1813,	"OrderID" : "10250"	},
	{"Subtotal" : 670.8,"OrderID" : "10251"	},
	{"Subtotal" : 3730,	"OrderID" : "10252"	}]
	
// 2. Sales by Year-----------------------------------
db.northwind.aggregate(
  {$project: {
      _id:1,
      "orderId" : 1,
      //"orderDate" : 1,
      "qtr" : {$add: [{$divide:[{$subtract:[{$month:"$orderDate"},1]},3]},1]},
      //"month" : {$month: "$orderDate"},
      //"requiredDate" : 1,
      "shippedDate" : 1,
      //"shipperName" : "$shipVia",
      "freightCost" : 1,
      "orderItems.unitPrice" : 1,
      "orderItems.quantity" : 1,
      "orderItems.supplier" : 1

  }},
  {$project: {
        _id:1,
        "orderId" : 1,
        "orderDate" : 1,
        "qtr" : {$subtract: ["$qtr", {$mod:["$qtr",1]}]},
        "month" : {$month: "$orderDate"},
        "requiredDate" : 1,
        "shippedDate" : 1,
        "shipperName" : 1,
        "freightCost" : 1,
        "orderItems.unitPrice" : 1,
        "orderItems.quantity" : 1,
        "orderItems.supplier" : 1

   }},
   {$unwind : "$orderItems"},
   {$project: {
           _id:1,
           "orderId" : 1,
           "orderDate" : 1,
		   "qtr" : 1,
		   "year" : {$year:"$orderDate"},
           "month" : 1,
           "requiredDate" : 1,
           "shippedDate" : 1,
           "shipperName" : 1,
           "freightCost" : 1,
           "orderItems.unitPrice" : 1,
           "orderItems.quantity" : 1,
           "orderItems.supplier" : 1,
           "orderItems.lineItemTotal" :
              {$multiply : ["$orderItems.unitPrice", "$orderItems.quantity"]}
   }},
   {$group : {
      _id : {"q" : "$qtr","y":"$year"},
      "total" : {$sum : "$orderItems.lineItemTotal"},
	  "average": {$avg : "$orderItems.lineItemTotal"}
   }},
   {$sort : {
      "_id.q" : -1,"_id.y" : 1
   }},
   {$group : {
		_id:"$_id.q",
		"year":{
			$push:{
				"year":"$_id.y",
				"Qtotal":"$total",
				"QAverage":"$average"
			}
		},
		"totalY":{"$sum":"$total"}
   }},
   {$project :{
		"_id":0,
		"quarter":"$_id",
		"year":1,
		"totalY":1
   }}
).toArray()
	
	
	
	
	
	
	
	
	
