db.northwind.findOne()
{
	"_id" : ObjectId("53b309def468718462e0c390"),
	"customer" : {
		"companyName" : "Vins et alcools Chevalier",
		"contactName" : "Paul Henriot",
		"address" : "59 rue de l'Abbaye",
		"city" : "Reims",
		"region" : "NULL",
		"postalCode" : 51100,
		"country" : "France",
		"phone" : "26.47.15.10",
		"fax" : "26.47.15.11"
	},
	"employee" : {
		"employeeId" : 5,
		"firstName" : "Steven",
		"lastName" : "Buchanan"
	},
	"orderItems" : [
		{
			"productName" : "Queso Cabrales",
			"supplier" : "Cooperativa de Quesos 'Las Cabras'",
			"category" : "Dairy Products",
			"productId" : 11,
			"unitPrice" : 14,
			"quantity" : 12
		},
		{
			"productName" : "Singaporean Hokkien Fried Mee",
			"supplier" : "Leka Trading",
			"category" : "Grains/Cereals",
			"productId" : 42,
			"unitPrice" : 9.8,
			"quantity" : 10
		},
		{
			"productName" : "Mozzarella di Giovanni",
			"supplier" : "Formaggi Fortini s.r.l.",
			"category" : "Dairy Products",
			"productId" : 72,
			"unitPrice" : 34.8,
			"quantity" : 5
		}
	],
	"orderId" : 10248,
	"orderDate" : ISODate("1996-07-04T07:00:00Z"),
	"requiredDate" : ISODate("1996-08-01T07:00:00Z"),
	"shippedDate" : ISODate("1996-07-16T07:00:00Z"),
	"shipVia" : "Federal Shipping",
	"freightCost" : 32.38
}
