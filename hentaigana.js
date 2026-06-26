function convertToHentaigana(text) {
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

    return text
        .split("")
        .map((c) => kanaToHentaigana[c] || c)
        .join("");
}

async function loadFont(url) {
    const buffer = await fetch(url).then((res) => res.arrayBuffer());
    return opentype.parse(buffer);
}

async function renderHentaigana(text, font) {
    const lines = text.split("\n");
    const svg = document.querySelector("svg");
    svg.innerHTML = "";

    const fontSize = 32; // glyph size
    const lineGap = 50; // horizontal gap between lines
    const charGap = 40; // vertical gap between characters

    let xOffset = 0;
    let pathIndex = 0;

    for (const line of lines) {
        let yOffset = 0;

        for (const char of convertToHentaigana(line)) {
            const glyph = font.charToGlyph(char);
            const path = glyph.getPath(xOffset, yOffset + fontSize, fontSize);
            const pathData = path.toPathData(2);

            const pathEl = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path",
            );
            pathEl.setAttribute("d", pathData);
            pathEl.setAttribute("stroke", "black");
            pathEl.setAttribute("fill", "none");
            pathEl.setAttribute("stroke-width", "2");
            pathEl.setAttribute("stroke-dasharray", "1000");
            pathEl.setAttribute("stroke-dashoffset", "1000");

            // animate stroke drawing
            pathEl.style.animation = `draw 3s linear ${pathIndex * 0.5}s forwards`;

            svg.appendChild(pathEl);

            yOffset += charGap;
            pathIndex++;
        }

        xOffset += lineGap;
    }

    svg.setAttribute("viewBox", `0 0 ${xOffset} 300`);
    svg.setAttribute("preserveAspectRatio", "xMinYMin meet");

    return pathIndex;
}

// O snail,
// Climb Mount Fuji,
// But slowly, slowly
//
// katatsumuri
// sorosoro nobore
// fuji no yama
const modernText = `かたつむり
そろそろのぼれ
ふじのやま`;

// http://wakufactory.jp/densho/font/hentai/
const fontUrl = "UniHentaiKana-Regular.woff";
// https://github.com/VistuBin/hentaigana-sans
// const fontUrl = "hentaigana-sans-Light.ttf";
const font = await loadFont(fontUrl);

async function loop() {
    const totalChars = await renderHentaigana(modernText, font);
    const cycleDuration = (totalChars - 1) * 500 + 3000; // ms
    setTimeout(loop, cycleDuration);
}

loop();
