const kanaToHentaigana = {
  か: "𛀎",
  た: "𛀡",
  つ: "𛀣",
  む: "𛀤",
  り: "𛀥",
  そ: "𛀦",
  ろ: "𛀧",
  の: "𛀨",
  ぼ: "𛀩",
  れ: "𛀪",
  ふ: "𛀫",
  じ: "𛀬",
  や: "𛀭",
  ま: "𛀮",
  // add remaining mappings as needed
};

function convertToHentaigana(text) {
  return text
    .split("")
    .map((c) => kanaToHentaigana[c] || c)
    .join("");
}
