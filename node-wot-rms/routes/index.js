// 載入express模組 
var express = require('express');
// 使用express.Router類別建構子來建立路由物件
var router = express.Router();

// 取得並列出Server端的ip，需在專案中安裝underscore模組: npm install underscore --save
var serverip = require('underscore').chain(require('os').networkInterfaces()).values()
    .flatten().find({family: 'IPv4', internal: false}).value().address;
console.log('Server IP=' + serverip);

// 引用request模組，用於呼叫Web API
var request = require('request');

// 引用multer模組，用於接收與儲存前端傳來的檔案
var multer = require('multer');
//設定multer之儲存檔案格式
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/photos');
    },
    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
		//cb(null, Date.now() + '.' + str[1]);
		sourceimagefilename = 'sourceimage' + '.' + str[1];
		cb(null, sourceimagefilename);
    }
});
var upload = multer({ storage: storage });

// 全域變數
var sourceimagefilename;

// 建立Web Video Streaming的狀態儲存檔wvs_status.txt(初始值為off)
var fs = require('fs'); 
fs.writeFileSync('./wvs-status.txt', 'off');
console.log('The wvs-status.txt is created!');

// 建立Web Video Streaming的pid儲存檔wvs_pid.txt(初始值為0)
fs.writeFileSync('./wvs-pid.txt', '0');
console.log('The wvs-pid.txt is created!');

// 引用mysql模組
var mysql = require('mysql');
// 建立資料庫之連接物件
// 執行此程式之前，請務必在MySQL伺服器中建立mydb1資料庫
// 操作步驟參考授課講義
var connection = mysql.createConnection({
		host : '127.0.0.1',
		port : 3306,
		user : 'root',
		password : '123456',
		database : 'mydb1'
});

// 用來建立thdatatable資料表之SQL命令(若thdatatable資料表不存在，則建立之)
var sqlcommand = "CREATE TABLE IF NOT EXISTS `mydb1`.`thdatatable` (" + 
	"`id` INT NOT NULL AUTO_INCREMENT," +
	"`timestamp` DATETIME NOT NULL," +
	"`temperature` FLOAT NOT NULL," +
	"`humidity` FLOAT NOT NULL," +
	"PRIMARY KEY (`id`)) ENGINE = InnoDB";

// 執行建立thdatatable資料表之SQL命令(若thdatatable資料表不存在，則建立之)
connection.query(sqlcommand, function(err, result){
	if(err) 
		message = {'dbstatus': '執行建立thdatatable資料表之SQL命令(若thdatatable資料表不存在，則建立之)時發生錯誤!', 'result': err};
	else
		message = {'dbstatus': '已成功執行建立thdatatable資料表之SQL命令(若thdatatable資料表不存在，則建立之)!', 'result': result};
	// 結束資料庫的連線
	connection.end();
	// 將執行結果列印在終端機中
	console.log("dbstatus: " + message.dbstatus);
});

//=================== 回傳網頁段落 ========================================//
//========= 根據Client端利用GET送來之不同路由，回傳相對應的網頁 =============//
//=======================================================================//
// 回傳給Client端首頁及該網頁之標題
router.get('/', function(req, res) {
	res.render('index.ejs', {title:"專案首頁"});
});

// 顯示Web遠程監控操作網頁
router.get('/webremotecontrol', function(req, res) {
    // 讓遠端監控網頁載入時，就顯示影像串流
	// 讀取Web Video Streaming的狀態
	fs=require('fs');
	wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
	
	// 若影像串流關閉著，則啟動影像串流
	if(wvs_status=='off')
	{
		exec = require('child_process').exec;
		web_vs = exec('python3 ./web-vs-server.py', shell=false);
		wvs_pid = web_vs.pid+1;
		console.log("The current wvs_pid is " + wvs_pid);
		
		// 將pid of Web Video Streaming存入檔案中
		fs = require('fs');
		fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
		console.log('The pid of web video streaming is saved!');
		
		// 將on存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'on'); 
		console.log('The status of web video streaming is saved!');
	}
	console.log("render page");
	// 傳送示遠程監控操作網頁到前端
	res.render('webremotecontrol.ejs', {title:"Web遠程監控操作網頁", serverip: serverip});
});

// 傳送查詢天氣操作網頁到前端
router.get('/queryweather', function(req, res) {
	res.render('queryweather.ejs', {title:"查詢天氣操作網頁"});
});

// 傳送查詢與儲存感測溫濕度操作網頁到前端
router.get('/query-store-dhtsensordata', function(req, res) {
	res.render('query-store-dhtsensordata.ejs', {title:"查詢與儲存感測溫溼度操作網頁"});
});

// 回傳給Client務操作網影像辨識頁及該網頁之標題
router.get('/imgrecognition', function(req, res) {
	res.render('imgrecognition.ejs', {title:"影像辨識操作網頁"});
});

// 回傳給Client拍照與辨識影像操作網頁及該網頁之標題
router.get('/photo-recognizephoto', function(req, res) {
	// 讓遠端監控網頁載入時，就顯示影像串流
	// 讀取Web Video Streaming的狀態
	wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
	
	// 若影像串流關閉著，則啟動影像串流
	if(wvs_status=='off')
	{
		exec = require('child_process').exec;
		web_vs = exec('python3 ./web-vs-server.py', shell=false);
		wvs_pid = web_vs.pid+1;
		console.log('The current wvs_pid: ' + wvs_pid);
		
		// 將pid of Web Video Streaming存入檔案中
		fs = require('fs');
		fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
		
		// 將on存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'on'); 
		console.log('The pid and status of web video streaming is saved!');
	}
	// 將拍照與辨識照片操作網頁與其標題及伺服器端IP傳送到前端
	res.render('photo-recognizephoto.ejs', {title:"拍照與辨識照片操作網頁", serverip: serverip})
});

//=================== 以下為REST網路服務段落 ==================================//
//==++== 根據Client端利用GET或POST送來之不同路由，執行相對應之服務方法 ===++=====//
//===================================================================+++====//

//******************** 啟動與關閉即時網頁視訊串流之服務方法 *****************************
//***** 客戶端提出 POST /web_video_streaming/:cmd 請求時，執行此服務方法(匿名式函數) *****
router.post('/web_video_streaming/:cmd', function(req, res){
	cmd=req.params.cmd;
	if(cmd=='on')
	{
		// 讀取Web Video Streaming的狀態
		fs=require('fs');
		wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
		
		//
		if(wvs_status=='off')
		{
			exec = require('child_process').exec;
			web_vs = exec('python3 ./web-vs-server.py', shell=false);
			wvs_pid = web_vs.pid+1;
			console.log('The current wvs_pid: '+ wvs_pid);
			
			// 將pid of Web Video Streaming存入檔案中
			fs = require('fs');
			fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
			
			// 將on存入Web Video Streaming的狀態檔中
			fs = require('fs');
			fs.writeFileSync('./wvs-status.txt', 'on'); 
			console.log('The pid and status of web video streaming is saved!');
		}
		// 回傳訊息給網頁端
		message={'message':'網頁即時影像串流已經開啟!'};
		res.set({
			'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
		});
		res.send(message);
	}

	if(cmd=='off') 
	{
		// 讀取Web Video Streaming的狀態
		fs=require('fs');
		wvs_status=fs.readFileSync('./wvs-status.txt','utf8');
		
		//
		if(wvs_status=='on')
		{
			// 讀取pid of Web Video Streaming
			fs=require('fs');
			wvs_pid=fs.readFileSync('./wvs-pid.txt','utf8');
			
			// 透過pid關閉(殺掉)Web Video Streaming
			exec = require('child_process').exec;
			exec('sudo kill ' + wvs_pid);
			console.log('The wvs process of ' + wvs_pid + ' is killed!');
			
			// 將off存入Web Video Streaming的狀態檔中
			fs = require('fs');
			fs.writeFileSync('./wvs-status.txt', 'off');
		}
			
		// 回傳訊息給網頁端
		message={'message':'網頁即時影像串流已經關閉!'};
		res.set({
			'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
		});
		res.send(message);
	}
});

//********************** 儲存Email清單之服務方法 *********************************
//***** 客戶端提出  POST /store_email/:email 請求時，執行此服務方法(匿名式函數) *****
router.post('/store_email/:email', function(req, res){
	email=req.params.email;
	// 建立接收告警email清單(每個email用逗號隔開)，第1個預設為老師的Gmail帳號，請改為你自己的
	emails="xxx@gmail.com" + ", " + email; 
	// 將emails清單字串存alert_emails.txt中
	fs = require('fs');
	fs.writeFileSync('./alert-emails.txt', emails);
	//	
	message = {"message": emails};
	console.log("The email accounts to receive alerts: " + message.message);
	res.send(message);
});

//********************** 拍攝照片之服務方法 *********************************
//***** 客戶端提出  POST /take_picture 請求時，執行此服務方法(匿名式函數) *****
router.post('/take_picture', function(req, res){

	// 讀取Web Video Streaming的狀態
	fs=require('fs');
	wvs_status=fs.readFileSync('./wvs-status.txt','utf8');
	
	// 若影像串流開著，先把它關掉
	if(wvs_status=='on')
	{
		// 讀取pid of Web Video Streaming
		fs=require('fs');
		wvs_pid=fs.readFileSync('./wvs-pid.txt','utf8');
		
		// 透過pid關閉(殺掉)Web Video Streaming
		exec = require('child_process').exec;
		exec('sudo kill ' + wvs_pid);
		console.log('The wvs process of ' + wvs_pid + ' is killed!');
		// 將off存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'off');
	}
	
	// 建立日期時間字串
	var dateformat=require('dateformat'); //匯入dateformat模組
	datestring = dateformat(Date().toString(), "yyyy-mm-dd_HH:MM:ss"); //產生格式如2016-12-04_21:17:58之日期字串
	//以時間戳記當作檔名的一部分，使檔名具有唯一性
	picture_name = 'img' + datestring + '.jpg'; 
	// 開始拍照 (用同步方式進行，以確保在傳送Email之前就有照片了)
	execSync = require('child_process').execSync;
	// 命令解讀： 攝像頭先預覽100ms才拍照; 照片大小：640x480; 將照片存入專案目錄下public資料夾之photos子目錄
	command = 'sudo raspistill -t 100 -w 640 -h 480 -o ' + "./public/photos/" + picture_name;
	execSync(command);
	console.log('像片' + picture_name + '已經拍攝!');
	
	//================== 以下為使用nodemailer傳送告警email(含拍攝的照片)之程式碼 =========================
	// 載入nodemailer模組
	nodemailer = require("nodemailer");
	// 傳送者資訊 ***(請改為你的姓名與email帳號)***
	emailsender = "xxx <xxx@gmail.com>";
	// 讀取警訊接收者email清單
	fs=require('fs');
	emailreceivers=fs.readFileSync('./alert-emails.txt','utf8');
	console.log("emailreceivers: " + emailreceivers);
	// 設定附件照片檔名與路徑
	attachedimage = picture_name;
	attachedimagepath = "./public/photos/" + picture_name;
	// 郵件主旨
	subjectstring = "入侵警示!ddddd";
	// 郵件內容
	emailcontent = "警告：有人入侵(時間：" + datestring + ")，請看照片!";
	// 建立transporter物件(預設使用SMTP通訊協定)
	transporter = nodemailer.createTransport({
		host: "smtp.gmail.com", // Gmail之SMTP伺服器
		port: 587,              // Gmail使用TLS時之連接埠號碼
		secure: false,          // true代表使用連接埠465 (使用SSL); false代表使用其他連接埠，例如，587 (使用TLS)
		auth: {
			user: "xxx@gmail.com",    // 傳送郵件帳號之使用者 (這是老師教學示範用的gmail帳號，請改為你自己的)
			pass: "123456!!" // 傳送郵件帳號之密碼 (這是老師教學示範用gmail帳號之密碼，請改為你自己的)
		}
	});

	// 利用上面建立之transporter物件之sendMail方法傳送告警email
	// sendMail方法利用JSON格式參數進行告警email之設定
	transporter.sendMail({
		from: emailsender,          // 設定傳送者之資訊 
		to: emailreceivers,         // 設定接收告警之email清單
		subject: subjectstring,     // 設定告警email之主旨
		text: emailcontent,         // 設定告警email之內容
		attachments: [{   // 設定告警email之附件(take_picture服務所拍的照片)
			filename: attachedimage,
			path: attachedimagepath,
			cid: 'A'
	　	}]
	});
	console.log("已經發送告警Email!");
	//===================================================================================================
	
	// 再次打開影像串流
	exec = require('child_process').exec;
	web_vs = exec('python3 ./web-vs-server.py', shell=false);
	wvs_pid = web_vs.pid+1;
	console.log('The current wvs_pid: ' + wvs_pid);
	// 將pid of Web Video Streaming存入檔案中
	fs = require('fs');
	fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
	
	// 將on存入Web Video Streaming的狀態檔中
	fs = require('fs');
	fs.writeFileSync('./wvs-status.txt', 'on'); 
	console.log('The pid and status of web video streaming is saved!');
	
	// 回傳訊息給網頁端
	message={'message':'已經拍照並傳送警訊電郵!'};
	res.set({
		'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	});
	res.send(message);

});

//******************************* 控制LED燈之服務方法 ***************************************
// 宣告全域變數：
// cmdflag用以紀錄命令是否有效 (本範例只有4個有效命令 "1"，"2"，"3"，"4")，初始設為1，代表有效命令
// lock用以紀錄目前操控按鈕是否已被鎖住，初始設為0，代表沒有鎖住
var cmdflag=1, lock=0;  
// 載入python-shell模組
var ps = require('python-shell'); 
//********* 客戶端提出 POST /control8leds/:cmd 請求時，執行此服務方法(匿名式函數) *************
router.post('/control8leds/:cmd', function(req, res){
	cmd=req.params.cmd;
	console.log("cmd= " + cmd);

	cmdflag = 1;  // 初始設為1，代表有效命令 
	if(cmd=="1" && lock==0) 
		message = {"message":"奇數LED燈正在閃爍!"};
	else if (cmd=="2"  && lock==0) 
		message = {"message":"偶數LED燈正在閃爍!"};
	else if(cmd=="3"  && lock==0) 
		message = {"message":"正用PWM驅動LED燈!"};
	else if (cmd=="4"  && lock==0)
		message = {"message":"LED正在執行跑馬燈!"}; 
	else if (lock==0)
	{
		cmdflag = 0;
		message = {"message":"無效的命令!"};
	}
	else {}

	res.set({
	'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	});
	res.send(message);    // 將JSON格式訊息回傳給前端網頁
	
	if(cmdflag == 1 && lock==0)
	{
		lock = 1; // 鎖住控制按鈕 
		var options = {
					pythonOptions: ['-u'], // get print results in real-time
					mode: 'text',
					args: [cmd]
				};
			
		ps.PythonShell.run('./control-leds.py', options, function(err, results){
				if (err) 
					console.log( "Python回傳錯誤訊息" + err);
				else
				{
					// 將JSON格式字串轉換成JSON物件
					results = JSON.parse(results);
					// 列印出Python程式control-leds.py回傳的訊息
					console.log(results.message);
				}
				lock = 0; // 解鎖控制按鈕 
		});
	}
});

//********************************* 讀取DHT22之服務方法 **************************************
//************* 客戶端提出 POST /readDHT22 請求時，執行此服務方法(匿名式函數) ******************
router.post('/readDHT22', function(req, res){
	// 載入引用node-dht-sensor套件
	var dhtsensor = require('node-dht-sensor');
	//初始化dhtsensor物件，22 代表 DHT22, 12 代表 GPIO12 
	dhtsensor.initialize(22, 12);  
	// 讀取DHT22感測值  
	var readout = dhtsensor.read();  
	// 讀取溫度值，取到小數點1位
	temperature = readout.temperature.toFixed(1); 
	console.log("temperature= " + temperature);
	// 讀取濕度值，取到小數點1位
	humidity = readout.humidity.toFixed(1);
	console.log("humidity= " + humidity);
	// 將溫、溼度值打包成JSON物件
	result = {"temperature":temperature, "humidity":humidity};

	// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	res.set({
	'charset': 'utf-8'  
	});
	// 將JSON物件回傳給前端網頁
	res.send(result);    
});

//*********************** 使用中央氣象局開放天氣Web API查詢天氣狀況之服務方法******************
// 載入request及querystring模組
var request = require('request');
var querystring = require('querystring');
//******* 客戶端提出 POST /cwbweather/:selectedcity 請求時，執行此服務方法(匿名式函數) ********
router.post('/queryweather/:selectedcity', function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*'); //  允許其他網站的網頁存取此服務
	var selectedcity=req.params.selectedcity;  // 從路由參數中取出城市名稱
	console.log(selectedcity);

	// create the url for querying cwb weather API
	var baseurl = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?";
	var AuthCode = ""; // 請抽換成你的中央氣象局授權碼
	// querystring.escape(str) method performs URL percent-encoding on the given str
	var citystring =  "locationName=" + querystring.escape(selectedcity); // 將URL之中文字進行%編碼
	var qstring = citystring + "&elementName=T,RH,WeatherDescription,MaxT,MinT&format=JSON";
	var cwbweatherurl = baseurl + qstring;
	console.log("URL: " + cwbweatherurl);

	//
	request(
		{
			url: cwbweatherurl,
			headers:{
				Authorization: AuthCode 
			},
			method: 'GET'
		},
		function (err, response, body){
			if (err) 
			{
				console.log("讀取天氣資料時發生錯誤，原因如下: " + err);
				city_data = {};
			}
			else 
			{
				try
				{
					console.log("city: " +selectedcity);
					// 將回傳的JSON字串轉成javascript的JSON物件
					sdata = JSON.parse(body);
					// 取得最新一筆平均溫度(攝氏度)
					temperature = sdata.records.locations[0].location[0].weatherElement[0].time[0].elementValue[0].value;
					console.log("temperature: " + temperature);
					// 取得最新一筆平均相對溼度
					humidity =  sdata.records.locations[0].location[0].weatherElement[1].time[0].elementValue[0].value;
					console.log("humidity: " + humidity);
					// 取得最新一筆平均相對溼度
					// 取的最新一筆天氣預報綜合描述
					condition = sdata.records.locations[0].location[0].weatherElement[3].time[0].elementValue[0].value;
					console.log("condition: " + condition);
					// 取得天氣資訊建立時間
					time  =  sdata.records.locations[0].location[0].weatherElement[0].time[0].startTime;
					//
					var hightemps=[];
					var lowtemps=[];
					// 取得未來一週最高溫度及最低溫度預報值(攝氏，間隔12小時)
					for(i=0; i<=13; i++)
					{
						hightemp = sdata.records.locations[0].location[0].weatherElement[4].time[i].elementValue[0].value;
						hightemps.push(hightemp);
						lowtemp = sdata.records.locations[0].location[0].weatherElement[2].time[i].elementValue[0].value;
						lowtemps.push(lowtemp);		
					}
					// 建立城市簡單天氣資訊之JSON物件
					city_data = {'city':selectedcity, 'temperature':temperature, 'humidity':humidity, 'condition':condition, 'time':time, 'hightemps':hightemps, 'lowtemps':lowtemps};
				}
				catch(ex)
				{
					console.log("解析天氣資料時發生例外，原因如下: " + ex);
					city_data = {};
				}
			}
			res.send(city_data);	// 將城市之天氣資料回傳給Client端	
		}
	);
});

//*** 查詢感測器(DTH22)即時感測之溫溼度值(thdata: temperature and humidity data)並存入MySQL資料庫， ***
//*** 然後取出與回傳資料庫最近10筆溫溼度紀錄之服務方法                            ***
//***** 客戶端提出 POST /query-store-thdata 請求時，執行此服務方法(匿名式函數) ******
// 引用同一目錄下之mysqlfuns.js (提供儲存資料、查詢資料及刪除資料等3個函數)
var mysqlfuns = require('./mysqlfuns.js');
router.post('/query-store-dhtsensordata', function(req, res){
	
	//======== 儲存資料1筆溫、溼度值紀錄  ===============
	// 產生目前的時間戳記
	var d = new Date();
	console.log("時間: " + d);
	// 載入引用node-dht-sensor套件
	var dhtsensor = require('node-dht-sensor');
	//初始化dhtsensor物件，22 代表 DHT22, 12 代表 GPIO12 
	dhtsensor.initialize(22, 12);  
	// 讀取DHT22感測值  
	var readout = dhtsensor.read();  
	// 讀取溫度值，取到小數點1位
	temp = readout.temperature.toFixed(1); 
	console.log("溫度: " + temp);
	// 讀取濕度值，取到小數點1位
	humid = readout.humidity.toFixed(1);
	console.log("濕度: " + humid);

	// 將產生之溫、濕度及日期存入資料庫中
	mysqlfuns.savethdata(d, temp, humid, showstatus);
	
	// 從資料取出最新之10筆資料，並回傳給前端介面
	mysqlfuns.querythdata(10, getresult);

	// 顯示執行狀態訊息之回調函數(callback function)
	function showstatus(message)
	{
		// 顯示執行狀態訊息
		console.log(message.dbstatus);
	}

	// 顯示執行狀態訊息及將查詢結果傳送到前端之回調函數
	function getresult(message)
	{   
		// 顯示執行狀態訊息
		console.log(message.dbstatus);
		// 取出查詢結果
		qdata = message.result;
		// 將查詢結果傳送到前端
		res.send(qdata);
	}		
});

// 上傳與分析照片服務
router.post("/upload-analyze-photo", upload.single("file"), function (req, res) {
	// 讀取來源照片檔成為位元組流(陣列)(octet stream);
	var imgoctet = fs.readFileSync('./public/photos/' + sourceimagefilename);

	// 分析照片API之選項設定
	var apioptions_analyze = {
		url: 'https://southeastasia.api.cognitive.microsoft.com/vision/v3.1/analyze',
		qs: {
			visualFeatures: 'Categories,Description,Color,Objects,Faces',
			details: '',
			language: 'zh'
		},
		headers: {
			'Content-Type' : 'application/octet-stream', 
			'Ocp-Apim-Subscription-Key': '7610d3bb437b45eb853ce07a85754600'
		},
		body: imgoctet,
		method: 'POST'
	};

	request(apioptions_analyze, function(error, response, body){
		if (error){
			console.log(error);
			return;
		}
		// 將回傳的結果JSON字串轉換成JSON物件
		resultobj = JSON.parse(body);
		// 在終端機中以階層格式印出結果JSON物件
		console.log("分析結果：");
		console.dir(resultobj);
		// 將分析結果訊息打包成JSON物件
		message = {"status": 0, "result": resultobj};
		// 將JSON格式之結果訊息回傳到前端網頁
		res.json(message);
	});

	
});

// 上傳與分析照片服務
router.post("/upload-detect-photo", upload.single("file"), function (req, res) {
	// 讀取來源照片檔成為位元組流(陣列)(octet stream);
	var imgoctet = fs.readFileSync('./public/photos/' + sourceimagefilename);

	// 辨識物件API之選項設定
	var apioptions_detect = {
		url: 'https://southeastasia.api.cognitive.microsoft.com/vision/v3.1/detect',
		headers: {
			'Content-Type' : 'application/octet-stream', 
			'Ocp-Apim-Subscription-Key': '7610d3bb437b45eb853ce07a85754600'
		},
		body: imgoctet,
		method: 'POST'
	};
	
	request(apioptions_detect, function(error, response, body){
		if (error){
			console.log(error);
			return;
		}
		// 將回傳的結果JSON字串轉換成JSON物件
		resultobj = JSON.parse(body);
		// 在終端機中以階層格式印出結果JSON物件
		console.log("檢測結果：");
		console.dir(resultobj);
		// 將檢測結果訊息打包成JSON物件
		message = {"status": 0,  "result": resultobj};
		// 將JSON格式之結果訊息回傳到前端網頁
		res.json(message);
	});    
});

//******************** 拍照與辨識照片(呼叫ACV-API)之服務方法 *****************************
//***** 客戶端提出 POST /photo-recognizephoto 請求時，執行此服務方法(匿名式函數) *****
router.post("/photo-recognizephoto", function (req, res) {
	// 讀取Web Video Streaming的狀態
	fs=require('fs');
	wvs_status=fs.readFileSync('./wvs-status.txt','utf8');
	
	// 若網路視訊串流開著，先把它關掉
	if(wvs_status=='on')
	{
		// 讀取pid of Web Video Streaming
		fs=require('fs');
		wvs_pid=fs.readFileSync('./wvs-pid.txt','utf8');
		
		// 透過pid關閉(殺掉)Web Video Streaming
		exec = require('child_process').exec;
		exec('sudo kill ' + wvs_pid);
		console.log('The wvs process of ' + wvs_pid + ' is killed!');
		// 將off存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'off');
	}
	
	// 設定拍照取得的照片名稱
	photofilename = 'sourcephoto.jpg'; 
	// 開始拍照 (使用同步方式執行，以確保在辨識照片之前就有照片了)
	execSync = require('child_process').execSync;
	// 命令解讀： 攝像頭先預覽300ms才拍照; 照片大小：640x480; 將照片存入專案目錄下public資料夾之photos子目錄
	command = 'sudo raspistill -t 300 -w 640 -h 480 -o ' + "./public/photos/" + photofilename;
	execSync(command);
	console.log('照片' + photofilename + '已經拍攝!');

	// 再次打開網路視訊串流
	exec = require('child_process').exec;
	web_vs = exec('python3 ./web-vs-server.py', shell=false);
	wvs_pid = web_vs.pid+1;
	console.log('The current wvs_pid: ' + wvs_pid);
	// 將pid of Web Video Streaming存入檔案中
	fs = require('fs');
	fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
	
	// 將on存入Web Video Streaming的狀態檔中
	fs = require('fs');
	fs.writeFileSync('./wvs-status.txt', 'on'); 
	console.log('The pid and status of web video streaming is saved!');
	
	// 讀取來源照片檔成為位元組流(陣列)(octet stream);
	var imgoctet = fs.readFileSync('./public/photos/' +  photofilename);

	// 分析照片API之選項設定
	var apioptions_analyze = {
		url: 'https://southeastasia.api.cognitive.microsoft.com/vision/v3.1/analyze',
		qs: {
			visualFeatures: 'Categories,Description,Objects,Faces',
			details: '',
			language: 'zh'
		},
		headers: {
			'Content-Type' : 'application/octet-stream', 
			'Ocp-Apim-Subscription-Key': '7610d3bb437b45eb853ce07a85754600'
		},
		body: imgoctet,
		method: 'POST'
	};

	request(apioptions_analyze, function(error, response, body){
		if (error){
			console.log(error);
			// 將分析結果訊息打包成JSON物件
			message = {"status": 1, 'result': error, 'photourl': '/photos/' +  photofilename};
			// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
			res.set({
				'charset': 'utf-8'  
			});
			// 以JSON格式回傳訊息與照片之URL給前端網頁
			res.json(message);
		}
		else {
			// 將回傳的結果JSON字串轉換成JSON物件
			resultobj = JSON.parse(body);
			// 在終端機中以階層格式印出結果JSON物件
			console.log("分析結果：");
			console.dir(resultobj);
			// 將分析結果訊息打包成JSON物件
			message = {"status": 0, 'result': resultobj, 'photourl': '/photos/' +  photofilename};
			// 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
			res.set({
				'charset': 'utf-8'  
			});
			// 以JSON格式回傳訊息與照片之URL給前端網頁
			res.json(message);
		}
	});
});

module.exports = router;
