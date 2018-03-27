# northwind-mongodb

取自https://github.com/raynaldmo/northwind-mongodb.git
練習取向不同，刪掉絕大多數的script。

### 預先準備 (Pre-installed)

```bash
# 安裝mongo-tools，才能使用mongoimport
$ sudo yum install mongo-tools

# 使用docker建置mongodb練習環境
$ docker run -d -p 0.0.0.0:27017:27017 --name northwind-mongo  mongo 
```

### 下載資料來源 (download data source)
```bash
$ git clone https://github.com/LImoritakeU/northwind-mongodb.git
$ cd northwind-mongodb
$ npm install

# 導入資料(linux):
$ cd ./collections/json)
$ sh ../../scripts/mongo-import-json.sh
```


### 使用mongo shell 測試是否有匯入 (import testing)
```js
> use Northwind
> db.product.findOne()

// 出現則代表成功匯入
{
	"_id" : ObjectId("5ab9ff48c0d1daae367e7b20"),
	"ProductID" : "4",
	"ProductName" : "Chef Anton's Cajun Seasoning",
	"SupplierID" : "2",
	"CategoryID" : "2",
	"QuantityPerUnit" : "48 - 6 oz jars",
	"UnitPrice" : "22.00",
	"UnitsInStock" : "53",
	"UnitsOnOrder" : "0",
	"ReorderLevel" : "0",
	"Discontinued" : "0"
}
```

**接下來步驟建議手動練習，參照BT BIGDATA SOLUTION IN PRACTICE**


### 4.前處理:字串轉數字(preprocess :parseInt())
```bash
$ cd northwind-mongodb
$ mongo Northwind scripts/N0.northwind_preProcess.js
```


### 5.產生 Northwind order collection [aggregate data model] 

(generate Northwind)
```bash
$ mongo Northwind N1.northwind_producting.js
$ mongo Northwind N2.northwind_orders.js
```

### 6.查詢:內含1x組聚合腳本,請任選一組並執行

(run the script in NQ.northwind_query.js)
`mongod> `//複製貼上至 mongo shell 測試 (paste code in mongo shell for testing)

