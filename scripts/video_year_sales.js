use northwind

db.northwind.aggregate(
  {$project: {
      _id:1,
      "orderId" : 1,
      "orderDate" : 1,
      "qtr" : {$add: [{$divide:[{$subtract:[{$month:"$orderDate"},1]},3]},1]},
      "month" : {$month: "$orderDate"},
      "requiredDate" : 1,
      "shippedDate" : 1,
      "shipperName" : "$shipVia",
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


[
{
	"year" : [
		{	"year" : 1997,	"Qtotal" : 147879.90000000002,	"QAverage" : 613.6095435684648			},
		{	"year" : 1998,	"Qtotal" : 315242.12000000005,	"QAverage" : 697.4383185840709			}
	],
	"totalY" : 463122.0200000001,
	"quarter" : 1
},
{
	"year" : [
		{	"year" : 1997,	"Qtotal" : 151611.09,	"QAverage" : 599.2533201581027	},
		{	"year" : 1998,	"Qtotal" : 154529.21999999997,	"QAverage" : 646.5657740585773	}
	],
	"totalY" : 306140.30999999994,
	"quarter" : 2
},
{
	"year" : [
		{	"year" : 1996,	"Qtotal" : 84437.49999999999,	"QAverage" : 456.41891891891885},
		{	"year" : 1997,	"Qtotal" : 165179.64,	"QAverage" : 645.23296875}
	],
	"totalY" : 249617.14,
	"quarter" : 3
},
{
	"year" : [
		{	"year" : 1996,	"Qtotal" : 141860.99999999994,	"QAverage" : 644.822727272727},
		{	"year" : 1997,	"Qtotal" : 193718.12000000002,	"QAverage" : 626.9194822006473}
	],
	"totalY" : 335579.12,
	"quarter" : 4
}
]
