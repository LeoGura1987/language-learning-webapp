let index = 0;               // 目前詞彙索引
let words = [];              // 詞彙資料陣列
let mode = 'card';           // 模式："card" 或 "quiz"
let correctCount = 0;        // 答對的題數

// 載入 JSON 詞彙資料
async function loadWords() {
  const res = await fetch('data/words.json');
  words = await res.json();
  showWord();
}

// 顯示詞彙內容：依據模式決定顯示方式
function showWord() {
  const word = words[index];
  if (mode === 'card') {
    document.getElementById('card').innerHTML = `
      <p>中文：${word.zh} <button onclick="speak('${word.zh}', 'zh-TW')">發音</button></p>
      <p>English：${word.en} <button onclick="speak('${word.en}', 'en-US')">發音</button></p>
      <p>日本語：${word.ja} <button onclick="speak('${word.ja}', 'ja-JP')">発音</button></p>
      <p>한국어：${word.ko} <button onclick="speak('${word.ko}', 'ko-KR')">발음</button></p>
    `;
  } else if (mode === 'quiz') {
    showQuiz();
  }
}

// 顯示選擇題（從英文翻成中文）
function showQuiz() {
  const word = words[index];
  const correct = word.zh;

  // 產生隨機選項
  let options = [correct];
  while (options.length < 4) {
    const r = words[Math.floor(Math.random() * words.length)].zh;
    if (!options.includes(r)) options.push(r);
  }

  // 洗牌選項
  options = options.sort(() => Math.random() - 0.5);

  // 顯示題目
  document.getElementById('card').innerHTML = `
    <p>英文：${word.en}</p>
    ${options.map(opt =>
      `<button onclick="checkAnswer('${opt}', '${correct}')">${opt}</button>`
    ).join('<br>')}
  `;
}

// 使用者選擇答案後檢查正確性
function checkAnswer(selected, correct) {
  if (selected === correct) {
    alert('答對了！');
    correctCount++;
    updateScore();
    nextWord();
  } else {
    alert('錯了，再試一次！');
  }
}

// 下一題
function nextWord() {
  index = (index + 1) % words.length;
  showWord();
}

// 切換學習模式
function switchMode() {
  mode = (mode === 'card') ? 'quiz' : 'card';
  document.getElementById('modeName').innerText = (mode === 'card') ? '卡片' : '測驗';
  showWord();
}

// 發音功能
function speak(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

// 更新成績顯示
function updateScore() {
  document.getElementById('scoreBoard').innerText = `答對：${correctCount} 題`;
}

loadWords(); // 頁面載入時自動開始

// 載入進度資料（從 localStorage 讀取）
let progress = JSON.parse(localStorage.getItem(‘progress’)) || {};
// 如果沒有資料，預設為空物件

// 函式：紀錄某個單字已經學過（答對一次）
function markAsLearned(word) {
// 如果該單字尚未有記錄，初始化為 0
if (!progress[word]) progress[word] = 0;
// 將答對次數 +1
progress[word]++;
// 將更新後的進度存回 localStorage
localStorage.setItem(‘progress’, JSON.stringify(progress));
}

// 函式：更新畫面上顯示的進度資訊
function updateProgressDisplay(words) {
// 取得目前已經學過的單字數量（物件 key 數）
const learnedCount = Object.keys(progress).length;
// 總單字數 = 傳入的 words 陣列長度
const total = words.length;
// 將資訊寫入頁面上的進度區塊
document.getElementById(‘progress-display’).textContent =
學習進度：${learnedCount} / ${total};
}

// 範例：在選擇題答對時呼叫
function checkAnswer(selected, correctAnswer, correctWord, words) {
if (selected === correctAnswer) {
// 答對時，紀錄進度
markAsLearned(correctWord.zh);
// 更新畫面進度資訊
updateProgressDisplay(words);
// 換下一題（假設你有這個函式）
showNextQuestion();
} else {
alert(“答錯了，請再試一次！”);
}
}

// 初始化畫面時，載入詞庫並設定初始進度
function loadWords() {
fetch(‘data/words.json’)
.then(res => res.json())             // 讀取 JSON 檔案
.then(words => {
setupQuiz(words);                  // 建立題目邏輯
updateProgressDisplay(words);     // 更新畫面進度
});
}
