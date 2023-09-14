// 匯出本模組所定義的3個方法
module.exports = {savethdata, querythdata, deletethdata}

//==================== 儲存1筆溫度、濕度資料之函數 =============================================
// 此函數之參數說明如下：date：日期時間，temp：溫度值，humid：濕度值，cb: 此方法之回調函數callback
function savethdata(date, temp, humid, cb)  
{
	// 引用mysql模組
	var mysql = require('mysql');
	// 建立資料庫之連接物件
	var connection= mysql.createConnection({
		host : '127.0.0.1',
		port : 3306,
		user : 'root',
		password : '123456',
		database : 'mydb1'
	});;
	
	// 建立擬儲存資料之JSON物件
	var data = {timestamp: date, temperature: temp, humidity: humid};
	// 執行資料儲存
	connection.query('INSERT INTO thdatatable SET ?', data, function(err, result){
		if(err) 
			message = {'dbstatus': '儲存資料時發生錯誤!', 'result': err};
		else
			message = {'dbstatus': '已成功新增1筆紀錄!', 'result': result};
		// 結束資料庫的連線
		connection.end();
		// 將執行結果傳給回調函數
		cb(message);
	});
}

//======== 查詢最新的n筆溫度、濕度紀錄之函數 =====================================================
// 此函數之參數說明如下：n：擬查詢之紀錄筆數，cb: 此方法之回調函數callback
function querythdata(n, cb)
{
	// 引用mysql模組
	var mysql = require('mysql');
	// 建立資料庫之連接物件
	var connection= mysql.createConnection({
		host : '127.0.0.1',
		port : 3306,
		user : 'root',
		password : '123456',
		database : 'mydb1'
	});;

	// 執行資料查詢
	connection.query('SELECT * FROM thdatatable order by id desc limit ?', [n], function(err, result){
		if(err) 
			message = {'dbstatus': '查詢資料時發生錯誤!', 'result': err};
		else
			message = {'dbstatus': '已成功取出最新的' + n + '筆紀錄!', 'result': result};
		// 結束資料庫的連線
		connection.end();
		// 將執行結果傳給回調函數
		cb(message);
	});
}

//======== 刪除最舊的n筆溫度、濕度資料之函數 =======================================================
// 此函數之參數說明如下：n：擬刪除之紀錄筆數，cb: 此方法之回調函數callback
function deletethdata(n, cb)
{
	// 引用mysql模組
	var mysql = require('mysql');
	// 建立資料庫之連接物件
	var connection= mysql.createConnection({
		host : '127.0.0.1',
		port : 3306,
		user : 'root',
		password : '123456',
		database : 'mydb1'
	});;
		
	// 執行資料刪除
	connection.query('DELETE FROM thdatatable order by id asc limit ?', [n], function(err, result){
		if(err) 
			message = {'dbstatus': '刪除資料時發生錯誤!', 'result': err};
		else
			message = {'dbstatus': '已經成功刪除最舊的' + n + '筆紀錄!', 'result': result};
		// 結束資料庫的連線
		connection.end();
		// 將執行結果傳給回調函數
		cb(message);
	});
}
