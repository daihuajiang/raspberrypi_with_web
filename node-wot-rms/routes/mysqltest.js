// 引用同一目錄下之mysqlfuns.js (提供儲存資料、查詢資料及刪除資料等3個函數)
var mysqlfuns = require('./mysqlfuns.js');

//==== 儲存資料2筆測試  ======================
// 用亂數產生第1筆資料並儲存
var d = new Date();
var temp = (25.0 + Math.random()*2).toFixed(1);  
var humid = (60.0 + Math.random()*5).toFixed(1);
var message = mysqlfuns.savethdata(d, temp, humid, displayresult);

// 用亂數產生第2筆資料並儲存
var d = new Date();
var temp = (25.0 + Math.random()*2).toFixed(1);  
var humid = (60.0 + Math.random()*5).toFixed(1);
message = mysqlfuns.savethdata(d, temp, humid, displayresult);

//==== 查詢最新的3筆資料並顯示 ================
n=3;
var message = mysqlfuns.querythdata(n, displayresult);

//==== 刪除最舊的1筆資料並顯示  ===============
n=1;
var message = mysqlfuns.deletethdata(n,displayresult);

//====== 顯示查詢資料之結果的回呼函數 ======================
function displayresult(message)
{
	// 將執行命令後之狀態列印在終端機中
	console.log("執行狀態: " + message.dbstatus);
	qdata = message.result;
	for(i=0; i<qdata.length; i++)
	{
		console.log("時間： " + qdata[i]['timestamp'].toLocaleString());
		console.log("溫度： " + qdata[i]['temperature']);
		console.log("濕度： " + qdata[i]['humidity']);
	}
		
}