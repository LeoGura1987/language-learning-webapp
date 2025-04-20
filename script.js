let index = 0; // 記錄目前顯示的詞彙索引
let words = []; // 存放從 JSON 檔載入的詞彙陣列

// 當網頁載入時呼叫：讀取 JSON 中的詞彙資料
async function loadWords() {
  const res = await fetch('data/words.json'); // 使用 fetch 讀取 JSON 檔案
  words = await res.json(); // 解析 JSON 為 JavaScript 陣列
  showWord(); // 顯示第一組詞彙
}

// 顯示目前 index 的詞彙卡片內容
function showWord() {
  const word = words[index]; // 取得目前的詞彙物件
  document.getElementById('card').innerHTML = `  
    <p>中文：${word.zh} <button onclick="speak('${word.zh}', 'zh-TW')">發音</button></p>
    <p>English：${word.en} <button onclick="speak('${word.en}', 'en-US')">發音</button></p>
    <p>日本語：${word.ja} <button onclick="speak('${word.ja}', 'ja-JP')">発音</button></p>
    <p>한국어：${word.ko} <button onclick="speak('${word.ko}', 'ko-KR')">발음</button></p>
  `;
}

// 切換到下一組詞彙（按下「下一個」按鈕時呼叫）
function nextWord() {
  index = (index + 1) % words.length; // index 遞增，超過長度則從頭開始
  showWord(); // 顯示新的詞彙
}

// 使用瀏覽器語音 API 發音指定語言
function speak(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text); // 建立語音物件
  utterance.lang = lang; // 設定語言，例如 zh-TW, en-US 等
  window.speechSynthesis.speak(utterance); // 呼叫語音合成器發音
}

// 頁面載入時立即執行：載入詞彙並顯示
loadWords();
