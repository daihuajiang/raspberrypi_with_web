# 樹梅派上建置資料庫與呼叫雲端API之Web物聯網應用
綜合第Python控制LED燈、即時網路視訊串流、Web遠程監控LED、讀取DHT22溫濕度、拍照、發送告警email等、MySQL資料庫程式應用、呼叫中央氣象局天氣API以及呼叫微軟電腦視覺API辨識圖片與照片這些功能，在樹梅派上設計與實作一個使用到資料庫與雲端API之Web物聯網應用系統。

### 網站首頁
網站的首頁有五個按鈕及導覽列的五個選項可進入到五個不同的功能頁面，分別為web監控、查詢天氣、查詢溫溼度、上傳與分析圖片及拍攝與辨識照片。

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic1.png)

### web拍攝畫面傳送到email
下圖為監控頁面，畫面中間可看到攝像頭拍攝到的畫面，最上面的欄位輸入email按下儲存可儲存到清單中，按下拍照告警後，攝像頭拍攝到的畫面就會傳送到清單中的email，顯示清單的欄位下方的兩個按鈕可開啟及關閉視訊串流，視訊串流下方的兩顆按鈕可以控制led燈的閃爍。

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic2.png)

### 感測器傳輸溫溼度
下圖也是在監控頁面，在控制led的按鈕下方的偵測溫溼度按鈕按下後，感測器會傳輸檢測到的溫溼度數值到最下方的兩個溫溼度欄位。

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic3.png)

### 中央氣象局api回傳溫溼度
下圖為查詢天氣頁面，選擇要查詢的縣市，按下查詢天氣按鈕後欄位中就會顯示從中央氣象局的api回傳的平均溫度、相對溫度的數值以及時間，並且在下方控排處繪製出接下來7天的溫溼度折線圖。

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic4.png)

### Azure圖片辨識api回傳
下圖為上傳與辨識圖片頁面，按下選擇檔案按鈕選擇要上傳的圖片後按下分析圖片按鈕或檢測圖片按鈕，api辨識圖片後會回傳結果到下方空白處。

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic5.png)

回傳結果:

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic6.png)

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic7.png)

下圖為拍照及辨識照片頁面，頁面中可看到攝像頭的畫面，最上方3個按鈕為開啟及關閉視訊串流的按鈕以及回首頁的按鈕，紅色的拍攝及辨識照片按鈕按下後，視訊串流右方會顯示拍攝到的照片，api辨識後回傳結果並顯示在下方空白處>

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic8.png)

回傳結果:

![](https://github.com/daihuajiang/raspberrypi_with_web/blob/main/img/pic9.png)
