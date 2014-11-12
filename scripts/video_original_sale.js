var s5a=
{
	"$project" : {
		"_id" : 0,
		"quarter" : {
			"$cond" : [{"$gt" : [{"$month" : "$d"}, 9]},
				"Q4", {
					"$cond" : [{"$gt" : [{"$month" : "$d"}, 6]},
						"Q3" : {
							"$cond" : [{"$gt" : [{"$month" : "$d"}, 3]},
								"Q2",
								"Q1"
							]
						}
					]
				}
			]
		},
		"year":{"$year":"$date"},
		"saleTotal":{
			"$multiply":[
				"$product.price",
				"$product.quantity"
			]
		}
	}
}

var s5b=
{
	"$group":{
		"_id":{
			"q":"$quarter",
			"y":"$year"
		}
		"total":  {"$sum":"$saleTotal"},
		"average":{"$avg":"$saleTotal"}
	}
}

var s5c=
{
	"$sort":{"$_id.y":1}
}
var s5d=
{
	"$group":{
		"_id":"$_id.q",
		"year":{
			"$push":{
				"year":"$_id.y",
				"QTotal":"$total",
				"QAverage":"$average"
			}
		},
		"totalY":{"$sum":"$total"}
	}
}
var s5e=
{
	"$project":{
		"_id":0,
		"quarter":"$_id",
		"years":1,
		"totalY":1
	}
}
db.sales.aggregate(s5a,s5b,s5c,s5d,s5e);


