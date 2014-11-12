--1. Order Subtotals
--For each order, calculate a subtotal for each Order (identified by OrderID). This is a simple query using GROUP BY to aggregate data for each order.
-- Get subtotal for each order.
select OrderID, 
    format(sum(UnitPrice * Quantity * (1 - Discount)), 2) as Subtotal
from order_details
group by OrderID
order by OrderID;
--Here is the query result. 830 records returned.
--Northwind Order subtotals.
+---------+----------+
| OrderID | Subtotal |
+---------+----------+
|   10248 | 440.00   |
|   10249 | 1,863.40 |
|   10250 | 1,552.60 |
|   10251 | 654.06   |
|   10252 | 3,597.90 |
+---------+----------+


--2. Sales by Year
--This query shows how to get the year part from Shipped_Date column. A subtotal is calculated by a sub-query for each order. The sub-query forms a table and then joined with the Orders table.

select distinct date(a.ShippedDate) as ShippedDate, 
    a.OrderID, 
    b.Subtotal, 
    year(a.ShippedDate) as Year
from orders a 
inner join
(
    -- Get subtotal for each order
    select distinct OrderID, 
        format(sum(UnitPrice * Quantity * (1 - Discount)), 2) as Subtotal
    from order_details
    group by OrderID    
) b on a.OrderID = b.OrderID
where a.ShippedDate is not null
    and a.ShippedDate between date('1996-12-24') and date('1997-09-30')
order by a.ShippedDate;
--Here is the query result. 296 records returned.
--MySQL Northwind - yearly sales total.
+-------------+---------+----------+------+
| ShippedDate | OrderID | Subtotal | Year |
+-------------+---------+----------+------+
| 1996-12-24  |   10389 | 1,832.80 | 1996 |
| 1996-12-24  |   10371 | 72.96    | 1996 |
| 1996-12-25  |   10386 | 166.00   | 1996 |
| 1996-12-26  |   10390 | 2,090.88 | 1996 |
| 1996-12-27  |   10370 | 1,117.60 | 1996 |
+-------------+---------+----------+------+




--3. Employee Sales by Country
--For each employee, get their sales amount, broken down by country name.

select distinct b.*, a.CategoryName
from categories a 
inner join products b on a.CategoryID = b.CategoryID
where b.Discontinued = 'N'
order by b.ProductName;
--Here is the query result. 296 records returned.
--MySQL Northwind - Employee Sales by Country.
+-----------+-------------------+------------+------------+---------------------+-----------+--------------+--------------+--------------+--------------+----------------+
| ProductID | ProductName       | SupplierID | CategoryID | QuantityPerUnit     | UnitPrice | UnitsInStock | UnitsOnOrder | ReorderLevel | Discontinued | CategoryName   |
+-----------+-------------------+------------+------------+---------------------+-----------+--------------+--------------+--------------+--------------+----------------+
|         3 | Aniseed Syrup     |          1 |          2 | 12 - 550 ml bottles |        10 |           13 |           70 |           25 | n            | Condiments     |
|        40 | Boston Crab Meat  |         19 |          8 | 24 - 4 oz tins      |      18.4 |          123 |            0 |           30 | n            | Seafood        |
|        60 | Camembert Pierrot |         28 |          4 | 15 - 300 g rounds   |        34 |           19 |            0 |            0 | n            | Dairy Products |
|        18 | Carnarvon Tigers  |          7 |          8 | 16 kg pkg.          |      62.5 |           42 |            0 |            0 | n            | Seafood        |
|         1 | Chai              |          1 |          1 | 10 boxes x 20 bags  |        18 |           39 |            0 |           10 | n            | Beverages      |
+-----------+-------------------+------------+------------+---------------------+-----------+--------------+--------------+--------------+--------------+----------------+


--4. Alphabetical List of Products
--This is a rather simple query to get an alphabetical list of products.

select distinct b.*, a.CategoryName
from categories a 
inner join products b on a.CategoryID = b.CategoryID
where b.Discontinued = 'N'
order by b.ProductName;
--Here is the query result. 69 records returned.
--Alphabetical List of Products.
+-----------+-------------------+------------+------------+---------------------+-----------+--------------+--------------+--------------+--------------+----------------+
| ProductID | ProductName       | SupplierID | CategoryID | QuantityPerUnit     | UnitPrice | UnitsInStock | UnitsOnOrder | ReorderLevel | Discontinued | CategoryName   |
+-----------+-------------------+------------+------------+---------------------+-----------+--------------+--------------+--------------+--------------+----------------+
|         3 | Aniseed Syrup     |          1 |          2 | 12 - 550 ml bottles |        10 |           13 |           70 |           25 | n            | Condiments     |
|        40 | Boston Crab Meat  |         19 |          8 | 24 - 4 oz tins      |      18.4 |          123 |            0 |           30 | n            | Seafood        |
|        60 | Camembert Pierrot |         28 |          4 | 15 - 300 g rounds   |        34 |           19 |            0 |            0 | n            | Dairy Products |
|        18 | Carnarvon Tigers  |          7 |          8 | 16 kg pkg.          |      62.5 |           42 |            0 |            0 | n            | Seafood        |
|         1 | Chai              |          1 |          1 | 10 boxes x 20 bags  |        18 |           39 |            0 |           10 | n            | Beverages      |
+-----------+-------------------+------------+------------+---------------------+-----------+--------------+--------------+--------------+--------------+----------------+



--5. Current Product List
--This is another simple query. No aggregation is used for summarizing data.

select ProductID, ProductName
from products
where Discontinued = 'N'
order by ProductName;
--Here is the query result. 69 records returned.
+-----------+-------------------+
| ProductID | ProductName       |
+-----------+-------------------+
|         3 | Aniseed Syrup     |
|        40 | Boston Crab Meat  |
|        60 | Camembert Pierrot |
|        18 | Carnarvon Tigers  |
|         1 | Chai              |
+-----------+-------------------+

--6. Order Details Extended
--This query calculates sales price for each order after discount is applied.

select distinct y.OrderID, 
    y.ProductID, 
    x.ProductName, 
    y.UnitPrice, 
    y.Quantity, 
    y.Discount, 
    round(y.UnitPrice * y.Quantity * (1 - y.Discount), 2) as ExtendedPrice
from products x
inner join order_details y on x.ProductID = y.ProductID
order by y.OrderID;
--Here is the query result. 2,155 records returned.
--Order Details in MySQL Northwind database.
+---------+-----------+-------------------------------+-----------+----------+----------+---------------+
| OrderID | ProductID | ProductName                   | UnitPrice | Quantity | Discount | ExtendedPrice |
+---------+-----------+-------------------------------+-----------+----------+----------+---------------+
|   10248 |        11 | Queso Cabrales                |        14 |       12 |        0 |        168.00 |
|   10248 |        42 | Singaporean Hokkien Fried Mee |       9.8 |       10 |        0 |         98.00 |
|   10248 |        72 | Mozzarella di Giovanni        |      34.8 |        5 |        0 |        174.00 |
|   10249 |        14 | Tofu                          |      18.6 |        9 |        0 |        167.40 |
|   10249 |        51 | Manjimup Dried Apples         |      42.4 |       40 |        0 |       1696.00 |
+---------+-----------+-------------------------------+-----------+----------+----------+---------------+


--7. Sales by Category
--For each category, we get the list of products sold and the total sales amount. Note that, the inner query for table c is to get sales for each product on each order. It then joins with outer query on Product_ID. In the outer query, products are grouped for each category.

select distinct a.CategoryID, 
    a.CategoryName, 
    b.ProductName, 
    sum(c.ExtendedPrice) as ProductSales
from categories a 
inner join products b on a.CategoryID = b.CategoryID
inner join 
(
    select distinct y.OrderID, 
        y.ProductID, 
        x.ProductName, 
        y.UnitPrice, 
        y.Quantity, 
        y.Discount, 
        round(y.UnitPrice * y.Quantity * (1 - y.Discount), 2) as ExtendedPrice
    from products x
    inner join order_details y on x.ProductID = y.ProductID
    order by y.OrderID
) c on c.ProductID = b.ProductID
inner join orders d on d.OrderID = c.OrderID
where d.OrderDate between date('1997/1/1') and date('1997/12/31')
group by a.CategoryID, a.CategoryName, b.ProductName
order by a.CategoryName, b.ProductName, ProductSales;
--Here is the query result. 77 records returned.
--Sales by Category in MySQL Northwind database.
+------------+--------------+----------------------+--------------+
| CategoryID | CategoryName | ProductName          | ProductSales |
+------------+--------------+----------------------+--------------+
|          1 | Beverages    | Chai                 |      4887.00 |
|          1 | Beverages    | Chang                |      7038.55 |
|          1 | Beverages    | Chartreuse verte     |      4192.20 |
|          1 | Beverages    | Côte de Blaye        |     49198.08 |
|          1 | Beverages    | Guaraná Fantástica   |      1630.12 |
+------------+--------------+----------------------+--------------+


--8. Ten Most Expensive Products
--The two queries below return the same result. It demonstrates how MySQL limits the number of records returned.
--The first query uses correlated sub-query to get the top 10 most expensive products.
--The second query retrieves data from an ordered sub-query table and then the keyword LIMIT is used outside the sub-query to restrict the number of rows returned.

-- Query 8.1
select distinct ProductName as Ten_Most_Expensive_Products, 
	UnitPrice
from products as a
where 10 >= (select count(distinct UnitPrice)
	from products as b
	where b.UnitPrice >= a.UnitPrice)
order by UnitPrice desc;
 
-- Query 8.2
select * from
(
    select distinct ProductName as Ten_Most_Expensive_Products, 
           UnitPrice
    from products
    order by UnitPrice desc
) as a
limit 10;
--Here is the query result. 10 records returned.
--Ten Most Expensive Products in MySQL Northwind database.
+-----------------------------+-----------+
| Ten_Most_Expensive_Products | UnitPrice |
+-----------------------------+-----------+
| Côte de Blaye               |     263.5 |
| Thüringer Rostbratwurst     |    123.79 |
| Mishi Kobe Niku             |        97 |
| Sir Rodney`s Marmalade      |        81 |
| Carnarvon Tigers            |      62.5 |
+-----------------------------+-----------+


--9. Products by Category
--This is a simple query just because it's in Access Northwind so we converted it here in MySQL.

select distinct a.CategoryName, 
    b.ProductName, 
    b.QuantityPerUnit, 
    b.UnitsInStock, 
    b.Discontinued
from categories a
inner join products b on a.CategoryID = b.CategoryID
where b.Discontinued = 'N'
order by a.CategoryName, b.ProductName;

--Here is the query result. 69 records returned.
--Products by Category in MySQL Northwind database.
+--------------+------------------+--------------------+--------------+--------------+
| CategoryName | ProductName      | QuantityPerUnit    | UnitsInStock | Discontinued |
+--------------+------------------+--------------------+--------------+--------------+
| Beverages    | Chai             | 10 boxes x 20 bags |           39 | n            |
| Beverages    | Chang            | 24 - 12 oz bottles |           17 | n            |
| Beverages    | Chartreuse verte | 750 cc per bottle  |           69 | n            |
| Beverages    | Côte de Blaye    | 12 - 75 cl bottles |           17 | n            |
| Beverages    | Ipoh Coffee      | 16 - 500 g tins    |           17 | n            |
+--------------+------------------+--------------------+--------------+--------------+



--10. Customers and Suppliers by City
--This query shows how to use UNION to merge Customers and Suppliers into one result set by identifying them as having different relationships to Northwind Traders - Customers and Suppliers.

select City, CompanyName, ContactName, 'Customers' as Relationship 
from customers
union
select City, CompanyName, ContactName, 'Suppliers'
from suppliers
order by City, CompanyName;
--Here is the query result. 120 records returned.
+-------------+----------------------------+---------------+--------------+
| City        | CompanyName                | ContactName   | Relationship |
+-------------+----------------------------+---------------+--------------+
| Aachen      | Drachenblut Delikatessen   | Sven Ottlieb  | Customers    |
| Albuquerque | Rattlesnake Canyon Grocery | Paula Wilson  | Customers    |
| Anchorage   | Old World Delicatessen     | Rene Phillips | Customers    |
| Ann Arbor   | Grandma Kelly`s Homestead  | Regina Murphy | Suppliers    |
| Annecy      | Gai pâturage               | Eliane Noz    | Suppliers    |
+-------------+----------------------------+---------------+--------------+



--11. Products Above Average Price
--This query shows how to use sub-query to get a single value (average unit price) that can be used in the outer-query.

select distinct ProductName, UnitPrice
from products
where UnitPrice > (select avg(UnitPrice) from products)
order by UnitPrice;
--Here is the query result. 25 records returned.
--Products Above Average Price by City in MySQL Northwind database.
+---------------------------------+-----------+
| ProductName                     | UnitPrice |
+---------------------------------+-----------+
| Uncle Bob`s Organic Dried Pears |        30 |
| Ikura                           |        31 |
| Gumbär Gummibärchen             |     31.23 |
| Mascarpone Fabioli              |        32 |
| Perth Pasties                   |      32.8 |
+---------------------------------+-----------+


--12. Product Sales for 1997
--This query shows how to group categories and products by quarters and shows sales amount for each quarter.

select distinct a.CategoryName, 
    b.ProductName, 
    format(sum(c.UnitPrice * c.Quantity * (1 - c.Discount)), 2) as ProductSales,
    concat('Qtr ', quarter(d.ShippedDate)) as ShippedQuarter
from categories a
inner join products b on a.CategoryID = b.CategoryID
inner join order_details c on b.ProductID = c.ProductID
inner join orders d on d.OrderID = c.OrderID
where d.ShippedDate between date('1997-01-01') and date('1997-12-31')
group by a.CategoryName, 
    b.ProductName, 
    concat('Qtr ', quarter(d.ShippedDate))
order by a.CategoryName, 
    b.ProductName, 
    ShippedQuarter;
--Here is the query result. 286 records returned.
--Product Sales for 1997 by City in MySQL Northwind database.
+--------------+-------------+--------------+----------------+
| CategoryName | ProductName | ProductSales | ShippedQuarter |
+--------------+-------------+--------------+----------------+
| Beverages    | Chai        | 705.60       | Qtr 1          |
| Beverages    | Chai        | 878.40       | Qtr 2          |
| Beverages    | Chai        | 1,174.50     | Qtr 3          |
| Beverages    | Chai        | 2,128.50     | Qtr 4          |
| Beverages    | Chang       | 2,720.80     | Qtr 1          |
| Beverages    | Chang       | 228.00       | Qtr 2          |
| Beverages    | Chang       | 2,061.50     | Qtr 3          |
| Beverages    | Chang       | 2,028.25     | Qtr 4          |
+--------------+-------------+--------------+----------------+


--13. Category Sales for 1997
--This query shows sales figures by categories - mainly just aggregation with sub-query. The inner query aggregates to product level, and the outer query further aggregates the result set from inner-query to category level.

select CategoryName, format(sum(ProductSales), 2) as CategorySales
from
(
    select distinct a.CategoryName, 
        b.ProductName, 
        format(sum(c.UnitPrice * c.Quantity * (1 - c.Discount)), 2) as ProductSales,
        concat('Qtr ', quarter(d.ShippedDate)) as ShippedQuarter
    from categories as a
    inner join products as b on a.CategoryID = b.CategoryID
    inner join order_details as c on b.ProductID = c.ProductID
    inner join orders as d on d.OrderID = c.OrderID 
    where d.ShippedDate between date('1997-01-01') and date('1997-12-31')
    group by a.CategoryName, 
        b.ProductName, 
        concat('Qtr ', quarter(d.ShippedDate))
    order by a.CategoryName, 
        b.ProductName, 
        ShippedQuarter
) as x
group by CategoryName
order by CategoryName;
--Here is the query result. 8 records returned.
--Category Sales for 1997 by City in MySQL Northwind database.
+----------------+---------------+
| CategoryName   | CategorySales |
+----------------+---------------+
| Beverages      | 7,654.34      |
| Condiments     | 7,719.90      |
| Confections    | 13,018.22     |
| Dairy Products | 3,610.40      |
| Grains/Cereals | 11,611.15     |
+----------------+---------------+


--14. Quarterly Orders by Product
--This query shows how to convert order dates to the corresponding quarters. It also demonstrates how SUM function is used together with CASE statement to get sales for each quarter, where quarters are converted from OrderDate column.

select a.ProductName, 
    d.CompanyName, 
    year(OrderDate) as OrderYear,
    format(sum(case quarter(c.OrderDate) when '1' 
        then b.UnitPrice*b.Quantity*(1-b.Discount) else 0 end), 0) "Qtr 1",
    format(sum(case quarter(c.OrderDate) when '2' 
        then b.UnitPrice*b.Quantity*(1-b.Discount) else 0 end), 0) "Qtr 2",
    format(sum(case quarter(c.OrderDate) when '3' 
        then b.UnitPrice*b.Quantity*(1-b.Discount) else 0 end), 0) "Qtr 3",
    format(sum(case quarter(c.OrderDate) when '4' 
        then b.UnitPrice*b.Quantity*(1-b.Discount) else 0 end), 0) "Qtr 4" 
from products a 
inner join order_details b on a.ProductID = b.ProductID
inner join orders c on c.OrderID = b.OrderID
inner join customers d on d.CustomerID = c.CustomerID 
where c.OrderDate between date('1997-01-01') and date('1997-12-31')
group by a.ProductName, 
    d.CompanyName, 
    year(OrderDate)
order by a.ProductName, d.CompanyName;
--Here is the query result. 947 records returned.
--Quarterly Orders by Product in MySQL Northwind database.
+--------------+----------------------------+-----------+-------+-------+-------+-------+
| ProductName  | CompanyName                | OrderYear | Qtr 1 | Qtr 2 | Qtr 3 | Qtr 4 |
+--------------+----------------------------+-----------+-------+-------+-------+-------+
| Alice Mutton | Antonio Moreno Taquería    |      1997 | 0     | 702   | 0     | 0     |
| Alice Mutton | Berglunds snabbköp         |      1997 | 312   | 0     | 0     | 0     |
| Alice Mutton | Bólido Comidas preparadas  |      1997 | 0     | 0     | 0     | 1,170 |
| Alice Mutton | Bottom-Dollar Markets      |      1997 | 1,170 | 0     | 0     | 0     |
| Alice Mutton | Ernst Handel               |      1997 | 1,123 | 0     | 0     | 2,607 |
+--------------+----------------------------+-----------+-------+-------+-------+-------+


--15. Invoice
--A simple query to get detailed information for each sale so that invoice can be issued.

select distinct b.ShipName, 
    b.ShipAddress, 
    b.ShipCity, 
    b.ShipRegion, 
    b.ShipPostalCode, 
    b.ShipCountry, 
    b.CustomerID, 
    c.CompanyName, 
    c.Address, 
    c.City, 
    c.Region, 
    c.PostalCode, 
    c.Country, 
    concat(d.FirstName,  ' ', d.LastName) as Salesperson, 
    b.OrderID, 
    b.OrderDate, 
    b.RequiredDate, 
    b.ShippedDate, 
    a.CompanyName, 
    e.ProductID, 
    f.ProductName, 
    e.UnitPrice, 
    e.Quantity, 
    e.Discount,
    e.UnitPrice * e.Quantity * (1 - e.Discount) as ExtendedPrice,
    b.Freight
from shippers a 
inner join orders b on a.ShipperID = b.ShipVia 
inner join customers c on c.CustomerID = b.CustomerID
inner join employees d on d.EmployeeID = b.EmployeeID
inner join order_details e on b.OrderID = e.OrderID
inner join products f on f.ProductID = e.ProductID
order by b.ShipName;
--Here is the query result. 2,155 records returned.
--Invoice in MySQL Northwind database.
+------------------------------------+--------------------------------+--------------+------------+----------------+-------------+------------+------------------------------------+--------------------------------+--------------+--------+------------+---------+------------------+---------+---------------------+---------------------+---------------------+------------------+-----------+------------------------------+-----------+----------+----------+-------------------+---------+
| ShipName                           | ShipAddress                    | ShipCity     | ShipRegion | ShipPostalCode | ShipCountry | CustomerID | CompanyName                        | Address                        | City         | Region | PostalCode | Country | Salesperson      | OrderID | OrderDate           | RequiredDate        | ShippedDate         | CompanyName      | ProductID | ProductName                  | UnitPrice | Quantity | Discount | ExtendedPrice     | Freight |
+------------------------------------+--------------------------------+--------------+------------+----------------+-------------+------------+------------------------------------+--------------------------------+--------------+--------+------------+---------+------------------+---------+---------------------+---------------------+---------------------+------------------+-----------+------------------------------+-----------+----------+----------+-------------------+---------+
| Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |            | 12209          | Germany     | ALFAA      | Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |        | 12209      | Germany | Janet Leverling  |   11011 | 1998-04-09 00:00:00 | 1998-05-07 00:00:00 | 1998-04-13 00:00:00 | Speedy Express   |        58 | Escargots de Bourgogne       |     13.25 |       40 |     0.05 | 503.4999996051192 |    1.21 |
| Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |            | 12209          | Germany     | ALFAA      | Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |        | 12209      | Germany | Nancy Davolio    |   10952 | 1998-03-16 00:00:00 | 1998-04-27 00:00:00 | 1998-03-24 00:00:00 | Speedy Express   |         6 | Grandma`s Boysenberry Spread |        25 |       16 |     0.05 | 379.9999997019768 |   40.42 |
| Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |            | 12209          | Germany     | ALFAA      | Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |        | 12209      | Germany | Janet Leverling  |   11011 | 1998-04-09 00:00:00 | 1998-05-07 00:00:00 | 1998-04-13 00:00:00 | Speedy Express   |        71 | Fløtemysost                  |      21.5 |       20 |        0 |               430 |    1.21 |
| Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |            | 12209          | Germany     | ALFAA      | Alfreds Futterkiste                | Obere Str. 57                  | Berlin       |        | 12209      | Germany | Nancy Davolio    |   10952 | 1998-03-16 00:00:00 | 1998-04-27 00:00:00 | 1998-03-24 00:00:00 | Speedy Express   |        28 | Rössle Sauerkraut            |      45.6 |        2 |        0 |              91.2 |   40.42 |
| Ana Trujillo Emparedados y helados | Avda. de la Constitución 2222  | México D.F.  |            | 05021          | Mexico      | ANATR      | Ana Trujillo Emparedados y helados | Avda. de la Constitución 2222  | México D.F.  |        | 05021      | Mexico  | Margaret Peacock |   10926 | 1998-03-04 00:00:00 | 1998-04-01 00:00:00 | 1998-03-11 00:00:00 | Federal Shipping |        13 | Konbu                        |         6 |       10 |        0 |                60 |   39.92 |
+------------------------------------+--------------------------------+--------------+------------+----------------+-------------+------------+------------------------------------+--------------------------------+--------------+--------+------------+---------+------------------+---------+---------------------+---------------------+---------------------+------------------+-----------+------------------------------+-----------+----------+----------+-------------------+---------+


--16. Number of units in stock by category and supplier continent
--This query shows that case statement is used in GROUP BY clause to list the number of units in stock for each product category and supplier's continent. Note that, if only s.Country (not the case statement) is used in the GROUP BY, duplicated rows will exist for each product category and supplier continent.

select c.CategoryName as "Product Category", 
       case when s.Country in 
                 ('UK','Spain','Sweden','Germany','Norway',
                  'Denmark','Netherlands','Finland','Italy','France')
            then 'Europe'
            when s.Country in ('USA','Canada','Brazil') 
            then 'America'
            else 'Asia-Pacific'
        end as "Supplier Continent", 
        sum(p.UnitsInStock) as UnitsInStock
from suppliers s 
inner join products p on p.SupplierID=s.SupplierID
inner join categories c on c.CategoryID=p.CategoryID 
group by c.CategoryName, 
         case when s.Country in 
                 ('UK','Spain','Sweden','Germany','Norway',
                  'Denmark','Netherlands','Finland','Italy','France')
              then 'Europe'
              when s.Country in ('USA','Canada','Brazil') 
              then 'America'
              else 'Asia-Pacific'
         end;
--Here is the query result. 21 records returned.
--Here comes the end of this article series. I hope you find it useful in your day-to-day job of SQL coding! Don't forget to download the full script which can be found at the beginning of the first two parts of this article series. 
+------------------+--------------------+--------------+
| Product Category | Supplier Continent | UnitsInStock |
+------------------+--------------------+--------------+
| Beverages        | America            |          203 |
| Beverages        | Asia-Pacific       |           32 |
| Beverages        | Europe             |          324 |
| Condiments       | America            |          372 |
| Condiments       | Asia-Pacific       |           90 |
+------------------+--------------------+--------------+

--join
--Customer vs Supplier
select a.CustomersCount, b.SuppliersCount
from
(select count(CustomerID) as CustomersCount from customers) as a
join
(select count(SupplierID) as SuppliersCount from suppliers) as b
;
+----------------+----------------+
| CustomersCount | SuppliersCount |
+----------------+----------------+
|             91 |             29 |
+----------------+----------------+

--Customer_vs_Supplier_Ratio
select concat(round(a.CustomersCount / b.SuppliersCount), ":1") as Customer_vs_Supplier_Ratio
from
(select count(CustomerID) as CustomersCount from customers) as a
join
(select count(SupplierID) as SuppliersCount from suppliers) as b
;
+----------------------------+
| Customer_vs_Supplier_Ratio |
+----------------------------+
| 3:1                        |
+----------------------------+
