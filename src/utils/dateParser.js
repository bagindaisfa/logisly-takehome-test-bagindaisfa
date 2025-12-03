/**
 * normalizeDate(str)
 * - Normalize Indonesian date variants to ISO (YYYY-MM-DD).
 * - Handles: weekday optional, month full/abbr/numeric, 2/4-digit year.
 * - Returns null if parse fails.
 */
const MONTH_MAP = {
  jan: 1,
  januari: 1,
  feb: 2,
  februari: 2,
  mar: 3,
  maret: 3,
  apr: 4,
  april: 4,
  mei: 5,
  jun: 6,
  juni: 6,
  jul: 7,
  juli: 7,
  agu: 8,
  agustus: 8,
  sep: 9,
  september: 9,
  okt: 10,
  oktober: 10,
  nov: 11,
  november: 11,
  des: 12,
  desember: 12,
};

function normalizeDate(str) {
  if (!str || typeof str !== "string") return null;

  let s = str.toLowerCase().replace(/[,]/g, " ").trim();

  // remove weekday words if present
  s = s
    .replace(/\b(senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu)\b/gi, "")
    .trim();

  // common patterns:
  // 28 okt 24
  // 28 oktober 2024
  // 08 10 2024
  // 08-10-2024 (try to normalize dashes)
  s = s.replace(/[.-]/g, " ");

  // Try pattern: day month year
  const regex = /(\d{1,2})\s+([a-z]+|\d{1,2})\s+(\d{2,4})/i;
  const m = s.match(regex);
  if (!m) return null;

  let [, dayRaw, monthRaw, yearRaw] = m;
  const day = parseInt(dayRaw, 10);

  let month = parseInt(monthRaw, 10);
  if (isNaN(month)) {
    month =
      MONTH_MAP[monthRaw.substring(0, 3)] ||
      MONTH_MAP[monthRaw] ||
      MONTH_MAP[monthRaw.trim()];
  }

  let year = yearRaw;
  if (year.length === 2) year = "20" + year;
  year = parseInt(year, 10);

  if (!day || !month || !year) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

module.exports = { normalizeDate };
