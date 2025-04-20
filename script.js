let index = 0;
let words = [];

async function loadWords() {
  const res = await fetch('data/words.json');
  words = await res.json();
  showWord();
}

function showWord() {
  const word = words[index];
  document.getElementById('card').innerHTML = `
    <p>中文：${word.zh} <button onclick="speak('${word.zh}', 'zh-TW')">發音</button></p>
    <p>English：${word.en} <button onclick="speak('${word.en}', 'en-US')">發音</button></p>
    <p>日本語：${word.ja} <button onclick="speak('${word.ja}', 'ja-JP')">発音</button></p>
    <p>한국어：${word.ko} <button onclick="speak('${word.ko}', 'ko-KR')">발음</button></p>
  `;
}

function nextWord() {
  index = (index + 1) % words.length;
  showWord();
}

function speak(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

loadWords();
