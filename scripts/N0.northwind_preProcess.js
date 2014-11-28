//N.0.preprocess 前處理----------------------------------------------------------------------------
db.products.find().forEach(function(doc){	//轉型string..float..number
	doc.UnitPrice = parseFloat(doc.UnitPrice); 
	doc.UnitsInStock = Number(doc.UnitsInStock);
	doc.UnitsOnOrder = Number(doc.UnitsOnOrder);
	doc.ReorderLevel = parseInt(doc.ReorderLevel);
	db.products.save(doc);
});

db.order_details.find().forEach( function (doc) { //轉型string2float
  doc.UnitPrice = parseFloat(doc.UnitPrice); 
  doc.Quantity = parseFloat(doc.Quantity); 
  doc.Discount = parseFloat(doc.Discount); 
  db.order_details.save(doc);
});
