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
