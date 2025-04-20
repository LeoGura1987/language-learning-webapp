let index = 0;                   // 當前詞彙索引
let words = [];                  // 詞彙資料陣列
let mode = 'card';               // 當前模式："card" 或 "quiz"
let correctCount = 0;            // 答對的題數
let progress = JSON.parse(localStorage.getItem('progress')) || {}; // 讀取學習進度

// 初始載入
loadWords();

// 載入 JSON 詞彙資料並初始化
async function loadWords() {
  const res = await fetch('data/words.json');
  words = await res.json();
  showWord();
  updateProgressDisplay();
  renderWordList();
}

// 顯示單字內容（依模式決定卡片或測驗）
function showWord() {
  const word = words[index];
  if (mode === 'card') {
    document.getElementById('card').innerHTML = `
      <p>中文：${word.zh} <button onclick="speak('${word.zh}', 'zh-TW')">發音</button></p>
      <p>English：${word.en} <button onclick="speak('${word.en}', 'en-US')">發音</button></p>
      <p>日本語：${word.ja} <button onclick="speak('${word.ja}', 'ja-JP')">発音</button></p>
      <p>한국어：${word.ko} <button onclick="speak('${word.ko}', 'ko-KR')">발음</button></p>
    `;
  } else {
    showQuiz();
  }
}

// 顯示選擇題（從英文翻中文）
function showQuiz() {
  const word = words[index];
  const correct = word.zh;

  let options = [correct];
  while (options.length < 4) {
    const r = words[Math.floor(Math.random() * words.length)].zh;
    if (!options.includes(r)) options.push(r);
  }
  options = options.sort(() => Math.random() - 0.5);

  document.getElementById('card').innerHTML = `
    <p>英文：${word.en}</p>
    ${options.map(opt =>
      `<button onclick="checkAnswer('${opt}', '${correct}', ${JSON.stringify(word)})">${opt}</button>`
    ).join('<br>')}
  `;
}

// 檢查使用者選擇是否正確
function checkAnswer(selected, correct, word) {
  if (selected === correct) {
    alert('答對了！');
    correctCount++;
    updateScore();
    handleCorrectAnswer(word);
    nextWord();
  } else {
    alert('錯了，再試一次！');
  }
}

// 處理答對後的進度更新與顯示
function handleCorrectAnswer(word) {
  if (!progress[word.zh]) progress[word.zh] = 0;
  progress[word.zh]++;
  localStorage.setItem('progress', JSON.stringify(progress));
  updateProgressDisplay();
  renderWordList();
}

// 顯示下一個單字
function nextWord() {
  index = (index + 1) % words.length;
  showWord();
}

// 切換卡片／測驗模式
function switchMode() {
  mode = (mode === 'card') ? 'quiz' : 'card';
  document.getElementById('modeName').innerText = (mode === 'card') ? '卡片' : '測驗';
  showWord();
}

// 使用語音合成讀出文字
function speak(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

// 更新答對題數統計
function updateScore() {
  document.getElementById('scoreBoard').innerText = `答對：${correctCount} 題`;
}

// 更新進度顯示與進度條
function updateProgressDisplay() {
  const learnedCount = Object.keys(progress).length;
  const total = words.length;
  const percent = Math.round((learnedCount / total) * 100);

  document.getElementById('progress-display').textContent =
    `學習進度：${learnedCount} / ${total}（${percent}%）`;
  document.getElementById('progress-bar').style.width = `${percent}%`;
}

// 顯示所有單字並加上學過打勾符號
function renderWordList() {
  const container = document.getElementById('word-list');
  container.innerHTML = '';

  words.forEach(word => {
    const isLearned = progress[word.zh];
    const div = document.createElement('div');
    div.style.margin = '10px 0';
    div.style.padding = '10px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '5px';
    div.style.background = isLearned ? '#eaffea' : '#fff';

    div.innerHTML = `
      <strong>${word.zh}</strong> / ${word.en} / ${word.ja} / ${word.ko}
      ${isLearned ? ' ✅' : ''}
    `;
    container.appendChild(div);
  });
}
