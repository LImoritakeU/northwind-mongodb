--01. Quarterly Orders by Product
TRANSFORM Sum(CCur([Order Details].[UnitPrice]*[Quantity]*(1-[Discount])/100)*100) AS ProductAmount
SELECT Products.ProductName, Orders.CustomerID, Year([OrderDate]) AS OrderYear
FROM Products INNER JOIN (Orders INNER JOIN [Order Details] ON Orders.OrderID = [Order Details].OrderID) ON Products.ProductID = [Order Details].ProductID
WHERE (((Orders.OrderDate) Between #1/1/1997# And #12/31/1997#))
GROUP BY Products.ProductName, Orders.CustomerID, Year([OrderDate])
PIVOT "Qtr " & DatePart("q",[OrderDate],1,0) In ("Qtr 1","Qtr 2","Qtr 3","Qtr 4");

--02. Alphabetical List of Products
SELECT DISTINCTROW Products.*, Categories.CategoryName
FROM Categories INNER JOIN Products ON Categories.CategoryID = Products.CategoryID
WHERE (((Products.Discontinued)=No));

--03. Category Sales for 1997
SELECT DISTINCTROW [Product Sales for 1997].CategoryName, Sum([Product Sales for 1997].ProductSales) AS CategorySales
FROM [Product Sales for 1997]
GROUP BY [Product Sales for 1997].CategoryName;
--04. Current Product List
SELECT [Product List].ProductID, [Product List].ProductName
FROM Products AS [Product List]
WHERE ((([Product List].Discontinued)=No))
ORDER BY [Product List].ProductName;

--05. Employee Sales by Country
PARAMETERS [Beginning Date] DateTime, [Ending Date] DateTime;
SELECT DISTINCTROW Employees.Country, Employees.LastName, Employees.FirstName, Orders.ShippedDate, Orders.OrderID, [Order Subtotals].[Subtotal] AS SaleAmount
FROM Employees INNER JOIN (Orders INNER JOIN [Order Subtotals] ON [Orders].[OrderID]=[Order Subtotals].[OrderID]) ON [Employees].[EmployeeID]=[Orders].[EmployeeID]
WHERE ((([Orders].[ShippedDate]) Between [Beginning Date] And [Ending Date]));

--06. Invoices
SELECT DISTINCTROW Orders.ShipName, Orders.ShipAddress, Orders.ShipCity, Orders.ShipRegion, Orders.ShipPostalCode, Orders.ShipCountry, Orders.CustomerID, Customers.CompanyName, Customers.Address, Customers.City, Customers.Region, Customers.PostalCode, Customers.Country, [FirstName] & " " & [LastName] AS Salesperson, Orders.OrderID, Orders.OrderDate, Orders.RequiredDate, Orders.ShippedDate, Shippers.CompanyName, [Order Details].ProductID, Products.ProductName, [Order Details].UnitPrice, [Order Details].Quantity, [Order Details].Discount, CCur([Order Details].[UnitPrice]*[Quantity]*(1-[Discount])/100)*100 AS ExtendedPrice, Orders.Freight
FROM Shippers INNER JOIN (Products INNER JOIN ((Employees INNER JOIN (Customers INNER JOIN Orders ON Customers.[CustomerID] = Orders.[CustomerID]) ON Employees.[EmployeeID] = Orders.[EmployeeID]) INNER JOIN [Order Details] ON Orders.[OrderID] = [Order Details].[OrderID]) ON Products.[ProductID] = [Order Details].[ProductID]) ON Shippers.[ShipperID] = Orders.[ShipVia];

--07. Invoices Filter
SELECT DISTINCTROW Invoices.*
FROM Invoices
WHERE ((([Invoices].[OrderID])=[Forms]![Orders]![OrderID]));

--08. Order Details Extended
SELECT DISTINCTROW [Order Details].OrderID, [Order Details].ProductID, Products.ProductName, [Order Details].UnitPrice, [Order Details].Quantity, [Order Details].Discount, CCur([Order Details].[UnitPrice]*[Quantity]*(1-[Discount])/100)*100 AS ExtendedPrice
FROM Products INNER JOIN [Order Details] ON Products.[ProductID] = [Order Details].[ProductID]
ORDER BY [Order Details].OrderID;

--09. Order Subtotals
SELECT DISTINCTROW [Order Details].OrderID, Sum(CCur([UnitPrice]*[Quantity]*(1-[Discount])/100)*100) AS Subtotal
FROM [Order Details]
GROUP BY [Order Details].OrderID;

--10. Orders Qry
SELECT DISTINCTROW Orders.OrderID, Orders.CustomerID, Orders.EmployeeID, Orders.OrderDate, Orders.RequiredDate, Orders.ShippedDate, Orders.ShipVia, Orders.Freight, Orders.ShipName, Orders.ShipAddress, Orders.ShipCity, Orders.ShipRegion, Orders.ShipPostalCode, Orders.ShipCountry, Customers.CompanyName, Customers.Address, Customers.City, Customers.Region, Customers.PostalCode, Customers.Country
FROM Customers INNER JOIN Orders ON Customers.[CustomerID] = Orders.[CustomerID];

--11. Product Sales for 1997
SELECT DISTINCTROW Categories.CategoryName, Products.ProductName, Sum(CCur([Order Details].[UnitPrice]*[Quantity]*(1-[Discount])/100)*100) AS ProductSales, "Qtr " & DatePart("q",[ShippedDate]) AS ShippedQuarter
FROM (Categories INNER JOIN Products ON Categories.[CategoryID] = Products.[CategoryID]) INNER JOIN (Orders INNER JOIN [Order Details] ON Orders.[OrderID] = [Order Details].[OrderID]) ON Products.[ProductID] = [Order Details].[ProductID]
WHERE (((Orders.ShippedDate) Between #1/1/1997# And #12/31/1997#))
GROUP BY Categories.CategoryName, Products.ProductName, "Qtr " & DatePart("q",[ShippedDate]);

--12. Products Above Average Price
SELECT DISTINCTROW Products.ProductName, Products.UnitPrice
FROM Products
WHERE (((Products.UnitPrice)>(SELECT AVG([UnitPrice]) From Products)))
ORDER BY Products.UnitPrice DESC;

--13. Products by Category
SELECT DISTINCTROW Categories.CategoryName, Products.ProductName, Products.QuantityPerUnit, Products.UnitsInStock, Products.Discontinued
FROM Categories INNER JOIN Products ON Categories.[CategoryID] = Products.[CategoryID]
WHERE (((Products.Discontinued)<>Yes))
ORDER BY Categories.CategoryName, Products.ProductName;

--14. Quarterly Orders
SELECT DISTINCTROW Customers.CustomerID, Customers.CompanyName, Customers.City, Customers.Country
FROM Customers RIGHT JOIN Orders ON Customers.[CustomerID] = Orders.[CustomerID]
WHERE (((Orders.OrderDate) Between #1/1/1997# And #12/31/1997#));

--15. Sales by Category
SELECT DISTINCTROW Categories.CategoryID, Categories.CategoryName, Products.ProductName, Sum([Order Details Extended].[ExtendedPrice]) AS ProductSales
FROM Categories INNER JOIN (Products INNER JOIN (Orders INNER JOIN [Order Details Extended] ON [Orders].[OrderID]=[Order Details Extended].[OrderID]) ON [Products].[ProductID]=[Order Details Extended].[ProductID]) ON [Categories].[CategoryID]=[Products].[CategoryID]
WHERE ((([Orders].[OrderDate]) Between #1/1/97# And #12/31/97#))
GROUP BY Categories.CategoryID, Categories.CategoryName, Products.ProductName
ORDER BY [Products].[ProductName];

--16. Sales by Year
PARAMETERS Forms![Sales by Year Dialog]!BeginningDate DateTime, Forms![Sales by Year Dialog]!EndingDate DateTime;
SELECT DISTINCTROW Orders.ShippedDate, Orders.OrderID, [Order Subtotals].Subtotal, Format([ShippedDate],"yyyy") AS [Year]
FROM Orders INNER JOIN [Order Subtotals] ON [Orders].[OrderID]=[Order Subtotals].[OrderID]
WHERE ((([Orders].[ShippedDate]) Is Not Null And ([Orders].[ShippedDate]) Between [Forms]![Sales by Year Dialog]![BeginningDate] And [Forms]![Sales by Year Dialog]![EndingDate]));

--17. Ten Most Expensive Products
SELECT DISTINCTROW TOP 10 Products.ProductName AS TenMostExpensiveProducts, Products.UnitPrice
FROM Products
ORDER BY Products.UnitPrice DESC;

--18. Customers and Suppliers by City
SELECT City, CompanyName, ContactName, "Customers" AS [Relationship] 
FROM Customers
UNION SELECT City, CompanyName, ContactName, "Suppliers"
FROM Suppliers
ORDER BY City, CompanyName;
