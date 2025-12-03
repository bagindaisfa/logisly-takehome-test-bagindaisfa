/**
 * parseCargoLine(rawLine)
 * - Clean formatting markers
 * - Extract notes in parentheses (supports multiple)
 * - Extract PO date (like "PO Tgl 28 Okt 24" or "PO 28 Okt 24")
 * - Extract volume (CBM) and unit count
 * - Extract destinations (split by '+')
 *
 * Returns object { destinations[], volumeCbm, unitCount, poDate|null, notes|null }
 * or null if not enough information.
 */
const { normalizeDate } = require("./dateParser");

function cleanText(line) {
  return String(line || "")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractAllParen(line) {
  const matches = [];
  const regex = /\(([^)]*)\)/g;
  let m;
  while ((m = regex.exec(line)) !== null) {
    matches.push(m[0].trim());
  }
  return matches;
}

function parseCargoLine(rawLine) {
  if (!rawLine || typeof rawLine !== "string") return null;
  let line = cleanText(rawLine);

  // Extract notes - collect all parentheses
  const parens = extractAllParen(line);
  const notes = parens.length ? parens.join(" ") : null;
  if (parens.length) {
    // remove them from line for simpler parsing
    line = line.replace(/\([^)]*\)/g, "").trim();
  }

  // PO date detection: "PO ... 28 Okt 24" or "PO Tgl 28 Okt 24"
  let poDate = null;
  const poRegex = /\bpo\b.*?(\d{1,2}.*\d{2,4})/i;
  const poMatch = line.match(poRegex);
  if (poMatch) {
    poDate = normalizeDate(poMatch[1]);
    line = line.replace(poMatch[0], "").trim();
  }

  // Volume and Unit: e.g., "45 Cbm 1 Unit" (CBM likely present)
  const numRegex = /(\d+)\s*cbm\b.*?(\d+)\s*unit\b/i;
  const numMatch = line.match(numRegex);
  if (!numMatch) {
    // try alternative order: "1 Unit 45 Cbm"
    const altRegex = /(\d+)\s*unit\b.*?(\d+)\s*cbm\b/i;
    const altMatch = line.match(altRegex);
    if (altMatch) {
      const unitCount = parseInt(altMatch[1], 10);
      const volumeCbm = parseInt(altMatch[2], 10);
      line = line.replace(altMatch[0], "").trim();
      const destinations = line
        .split("+")
        .map((s) => s.trim())
        .filter(Boolean);
      return { destinations, volumeCbm, unitCount, poDate, notes };
    }
    return null; // cannot parse numeric fields -> invalid cargo line
  }

  const volumeCbm = parseInt(numMatch[1], 10);
  const unitCount = parseInt(numMatch[2], 10);
  line = line.replace(numMatch[0], "").trim();

  // Destinations split by '+', also remove trailing punctuation
  const destinations = line
    .split("+")
    .map((d) => d.replace(/[.,]$/g, "").trim())
    .filter(Boolean);

  return { destinations, volumeCbm, unitCount, poDate, notes };
}

module.exports = { parseCargoLine };
