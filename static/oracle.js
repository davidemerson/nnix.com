// King Wen hexagram mapping, using binary read TOP→BOTTOM
// Our internal bitstrings are BOTTOM→TOP; we reverse before lookup.
const HEXAGRAMS = {
  "111111": { num: 1,  english: "Initiating",           chinese: "乾",   pinyin: "qián",      symbol: "䷀" },
  "000000": { num: 2,  english: "Responding",           chinese: "坤",   pinyin: "kūn",       symbol: "䷁" },
  "010001": { num: 3,  english: "Beginning",            chinese: "屯",   pinyin: "zhūn",      symbol: "䷂" },
  "100010": { num: 4,  english: "Childhood",            chinese: "蒙",   pinyin: "mêng",      symbol: "䷃" },
  "010111": { num: 5,  english: "Needing",              chinese: "需",   pinyin: "xū",        symbol: "䷄" },
  "111010": { num: 6,  english: "Contention",           chinese: "訟",   pinyin: "sòng",      symbol: "䷅" },
  "000010": { num: 7,  english: "Multitude",            chinese: "師",   pinyin: "shī",       symbol: "䷆" },
  "010000": { num: 8,  english: "Union",                chinese: "比",   pinyin: "bǐ",        symbol: "䷇" },
  "110111": { num: 9,  english: "Little Accumulation",  chinese: "小畜", pinyin: "xiǎo chù",  symbol: "䷈" },
  "111011": { num: 10, english: "Fulfillment",          chinese: "履",   pinyin: "lǚ",        symbol: "䷉" },
  "000111": { num: 11, english: "Advance",              chinese: "泰",   pinyin: "tài",       symbol: "䷊" },
  "111000": { num: 12, english: "Hindrance",            chinese: "否",   pinyin: "pǐ",        symbol: "䷋" },
  "111101": { num: 13, english: "Seeking Harmony",      chinese: "同人", pinyin: "tóng rén",  symbol: "䷌" },
  "101111": { num: 14, english: "Great Harvest",        chinese: "大有", pinyin: "dà yǒu",    symbol: "䷍" },
  "000100": { num: 15, english: "Humbleness",           chinese: "謙",   pinyin: "qiān",      symbol: "䷎" },
  "001000": { num: 16, english: "Delight",              chinese: "豫",   pinyin: "yù",        symbol: "䷏" },
  "011001": { num: 17, english: "Following",            chinese: "隨",   pinyin: "suí",       symbol: "䷐" },
  "100110": { num: 18, english: "Remedying",            chinese: "蠱",   pinyin: "gǔ",        symbol: "䷑" },
  "000011": { num: 19, english: "Approaching",          chinese: "臨",   pinyin: "lín",       symbol: "䷒" },
  "110000": { num: 20, english: "Watching",             chinese: "觀",   pinyin: "guān",      symbol: "䷓" },
  "101001": { num: 21, english: "Eradicating",          chinese: "噬嗑", pinyin: "shì kè",    symbol: "䷔" },
  "100101": { num: 22, english: "Adorning",             chinese: "賁",   pinyin: "bì",        symbol: "䷕" },
  "100000": { num: 23, english: "Falling Away",         chinese: "剝",   pinyin: "bō",        symbol: "䷖" },
  "000001": { num: 24, english: "Turning Back",         chinese: "復",   pinyin: "fù",        symbol: "䷗" },
  "111001": { num: 25, english: "Without Falsehood",    chinese: "無妄", pinyin: "wú wàng",   symbol: "䷘" },
  "100111": { num: 26, english: "Great Accumulation",   chinese: "大畜", pinyin: "dà chù",    symbol: "䷙" },
  "100001": { num: 27, english: "Nourishing",           chinese: "頤",   pinyin: "yí",        symbol: "䷚" },
  "011110": { num: 28, english: "Great Exceeding",      chinese: "大過", pinyin: "dà guò",    symbol: "䷛" },
  "010010": { num: 29, english: "Darkness",             chinese: "坎",   pinyin: "kǎn",       symbol: "䷜" },
  "101101": { num: 30, english: "Brightness",           chinese: "離",   pinyin: "lí",        symbol: "䷝" },
  "011100": { num: 31, english: "Mutual Influence",     chinese: "咸",   pinyin: "xián",      symbol: "䷞" },
  "001110": { num: 32, english: "Long Lasting",         chinese: "恆",   pinyin: "héng",      symbol: "䷟" },
  "111100": { num: 33, english: "Retreat",              chinese: "遯",   pinyin: "dùn",       symbol: "䷠" },
  "001111": { num: 34, english: "Great Strength",       chinese: "大壯", pinyin: "dà zhuàng", symbol: "䷡" },
  "101000": { num: 35, english: "Proceeding Forward",   chinese: "晉",   pinyin: "jìn",       symbol: "䷢" },
  "000101": { num: 36, english: "Brilliance Injured",   chinese: "明夷", pinyin: "míng yí",   symbol: "䷣" },
  "110101": { num: 37, english: "Household",            chinese: "家人", pinyin: "jiā rén",   symbol: "䷤" },
  "101011": { num: 38, english: "Diversity",            chinese: "睽",   pinyin: "kuí",       symbol: "䷥" },
  "010100": { num: 39, english: "Hardship",             chinese: "蹇",   pinyin: "jiǎn",      symbol: "䷦" },
  "001010": { num: 40, english: "Relief",               chinese: "解",   pinyin: "xiè",       symbol: "䷧" },
  "100011": { num: 41, english: "Decreasing",           chinese: "損",   pinyin: "sǔn",       symbol: "䷨" },
  "110001": { num: 42, english: "Increasing",           chinese: "益",   pinyin: "yì",        symbol: "䷩" },
  "011111": { num: 43, english: "Eliminating",          chinese: "夬",   pinyin: "guài",      symbol: "䷪" },
  "111110": { num: 44, english: "Encountering",         chinese: "姤",   pinyin: "gòu",       symbol: "䷫" },
  "011000": { num: 45, english: "Bringing Together",    chinese: "萃",   pinyin: "cuì",       symbol: "䷬" },
  "000110": { num: 46, english: "Growing Upward",       chinese: "升",   pinyin: "shēng",     symbol: "䷭" },
  "011010": { num: 47, english: "Exhausting",           chinese: "困",   pinyin: "kùn",       symbol: "䷮" },
  "010110": { num: 48, english: "Replenishing",         chinese: "井",   pinyin: "jǐng",      symbol: "䷯" },
  "011101": { num: 49, english: "Abolishing The Old",   chinese: "革",   pinyin: "gé",        symbol: "䷰" },
  "101110": { num: 50, english: "Establishing The New", chinese: "鼎",   pinyin: "dǐng",      symbol: "䷱" },
  "001001": { num: 51, english: "Taking Action",        chinese: "震",   pinyin: "zhèn",      symbol: "䷲" },
  "100100": { num: 52, english: "Keeping Still",        chinese: "艮",   pinyin: "gèn",       symbol: "䷳" },
  "110100": { num: 53, english: "Developing Gradually", chinese: "漸",   pinyin: "jiàn",      symbol: "䷴" },
  "001011": { num: 54, english: "Marrying Maiden",      chinese: "歸妹", pinyin: "guī mèi",   symbol: "䷵" },
  "001101": { num: 55, english: "Abundance",            chinese: "豐",   pinyin: "fēng",      symbol: "䷶" },
  "101100": { num: 56, english: "Travelling",           chinese: "旅",   pinyin: "lǚ",        symbol: "䷷" },
  "110110": { num: 57, english: "Proceeding Humbly",    chinese: "巽",   pinyin: "xùn",       symbol: "䷸" },
  "011011": { num: 58, english: "Joyful",               chinese: "兌",   pinyin: "duì",       symbol: "䷹" },
  "110010": { num: 59, english: "Dispersing",           chinese: "渙",   pinyin: "huàn",      symbol: "䷺" },
  "010011": { num: 60, english: "Restricting",          chinese: "節",   pinyin: "jié",       symbol: "䷻" },
  "110011": { num: 61, english: "Innermost Sincerity",  chinese: "中孚", pinyin: "zhōng fú",  symbol: "䷼" },
  "001100": { num: 62, english: "Little Exceeding",     chinese: "小過", pinyin: "xiǎo guò",  symbol: "䷽" },
  "010101": { num: 63, english: "Already Fulfilled",    chinese: "既濟", pinyin: "jì jì",     symbol: "䷾" },
  "101010": { num: 64, english: "Not Yet Fulfilled",    chinese: "未濟", pinyin: "wèi jì",    symbol: "䷿" }
};

function randomInt(maxExclusive) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % maxExclusive;
}

// Four-coin line casting, mapped to classical 6/7/8/9
function castLine() {
  let sum = 0;
  for (let i = 0; i < 4; i++) {
    sum += randomInt(2) === 0 ? 2 : 3; // tails=2, heads=3
  }
  switch (sum) {
    case 8:  return 6; // old yin, changing
    case 9:  return 7; // young yang
    case 10: return 8; // young yin
    case 11: return 9; // old yang, changing
    default:
      // Should never happen with four 2/3 coins, but fail-safe to 7
      return 7;
  }
}

function castHexagram() {
  const primaryLines = [];
  const relatingLines = [];

  for (let i = 0; i < 6; i++) {
    const lineVal = castLine();
    let primary, relating;

    if (lineVal === 6) {
      primary = "yin";
      relating = "yang";
    } else if (lineVal === 7) {
      primary = "yang";
      relating = "yang";
    } else if (lineVal === 8) {
      primary = "yin";
      relating = "yin";
    } else { // 9
      primary = "yang";
      relating = "yin";
    }

    primaryLines.push(primary);
    relatingLines.push(relating);
  }

  return { primaryLines, relatingLines };
}

// lines[0] bottom → lines[5] top
function linesToBinaryBottomToTop(lines) {
  return lines.map(l => (l === "yang" ? "1" : "0")).join("");
}

// Our bits are bottom→top; King Wen mapping expects top→bottom
function lookupHexagramInfo(bottomToTopBits) {
  const topToBottom = bottomToTopBits.split("").reverse().join("");
  return HEXAGRAMS[topToBottom] || null;
}

function describeHexagram(info, bitsBottomToTop) {
  if (!info) return `unknown pattern (${bitsBottomToTop})`;
  return `hexagram ${info.num} – ${info.english} ${info.chinese} (${info.pinyin})`;
}

function renderHexagram() {
  const { primaryLines, relatingLines } = castHexagram();

  const primaryContainer  = document.getElementById("primaryLines");
  const relatingContainer = document.getElementById("relatingLines");
  if (!primaryContainer || !relatingContainer) {
    console.warn("oracle: containers not found");
    return;
  }

  primaryContainer.innerHTML  = "";
  relatingContainer.innerHTML = "";

  const primaryBits  = linesToBinaryBottomToTop(primaryLines);
  const relatingBits = linesToBinaryBottomToTop(relatingLines);

  const primaryInfo  = lookupHexagramInfo(primaryBits);
  const relatingInfo = lookupHexagramInfo(relatingBits);

  const primaryBinaryEl  = document.getElementById("primaryBinary");
  const relatingBinaryEl = document.getElementById("relatingBinary");
  if (primaryBinaryEl)  primaryBinaryEl.textContent  = primaryBits;
  if (relatingBinaryEl) relatingBinaryEl.textContent = relatingBits;

  const primaryLabelEl  = document.getElementById("primaryLabel");
  const relatingLabelEl = document.getElementById("relatingLabel");
  if (primaryLabelEl) {
    primaryLabelEl.textContent = describeHexagram(primaryInfo, primaryBits);
  }
  if (relatingLabelEl) {
    relatingLabelEl.textContent = describeHexagram(relatingInfo, relatingBits);
  }

  const primarySymbolEl  = document.getElementById("primarySymbol");
  const relatingSymbolEl = document.getElementById("relatingSymbol");
  if (primarySymbolEl)  primarySymbolEl.textContent  = primaryInfo  ? primaryInfo.symbol  : "–";
  if (relatingSymbolEl) relatingSymbolEl.textContent = relatingInfo ? relatingInfo.symbol : "–";

  const changingLineNumbers = [];

  // Build visual lines (CSS uses column-reverse to show line 6 at top)
  for (let i = 0; i < 6; i++) {
    const primary  = primaryLines[i];
    const relating = relatingLines[i];
    const isChanging = primary !== relating;

    if (isChanging) {
      // line numbers are counted from bottom
      changingLineNumbers.push(i + 1);
    }

    const glyph = primary === "yang" ? "──────" : "──  ──";
    const kind  = primary === "yang"
      ? (isChanging ? "old yang (9)" : "yang (7)")
      : (isChanging ? "old yin (6)"  : "yin (8)");

    const primaryLineEl = document.createElement("div");
    primaryLineEl.className = "line" + (isChanging ? " changing" : "");
    primaryLineEl.innerHTML =
      `<div class="line-num">${i + 1}</div>` +
      `<div class="line-glyph">${glyph}</div>` +
      `<div class="line-kind">${kind}</div>`;

    const relatingGlyph = relating === "yang" ? "──────" : "──  ──";
    const relatingLineEl = document.createElement("div");
    relatingLineEl.className = "line";
    relatingLineEl.innerHTML =
      `<div class="line-num">${i + 1}</div>` +
      `<div class="line-glyph">${relatingGlyph}</div>` +
      `<div class="line-kind">${relating === "yang" ? "yang" : "yin"}</div>`;

    primaryContainer.appendChild(primaryLineEl);
    relatingContainer.appendChild(relatingLineEl);
  }

  const changingLinesLabel = document.getElementById("changingLines");
  if (changingLinesLabel) {
    if (changingLineNumbers.length === 0) {
      changingLinesLabel.textContent = "none – primary hexagram stands as is.";
      if (relatingLabelEl) {
        relatingLabelEl.textContent =
          describeHexagram(relatingInfo, relatingBits) + " (same as primary)";
      }
    } else {
      changingLinesLabel.textContent =
        changingLineNumbers.join(", ") + " (counting from the bottom)";
    }
  }

  const statusEl = document.getElementById("castStatus");
  if (statusEl) {
    statusEl.textContent = "cast complete – write down your question with the result.";
  }
}

// Hook up the button once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("castBtn");
  if (!btn) {
    console.warn("oracle: castBtn not found");
    return;
  }

  btn.addEventListener("click", () => {
    const statusEl = document.getElementById("castStatus");
    btn.disabled = true;
    if (statusEl) statusEl.textContent = "casting…";

    // Let the UI update before computation
    setTimeout(() => {
      renderHexagram();
      btn.disabled = false;
    }, 20);
  });
});
