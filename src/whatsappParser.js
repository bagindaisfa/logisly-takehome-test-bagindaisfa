/**
 * parseWhatsappMessage(raw)
 * - Input raw whatsapp text
 * - Returns { date, origin, items[], safetyNote|null }
 *
 * Strategy:
 * - Clean formatting markers from each line
 * - Find first line that looks like a date -> normalize
 * - Find origin line containing "origin"
 * - Any line containing "cbm" is attempted as cargo line
 * - Footer safety note detected by "pastikan driver" phrase
 */

const { normalizeDate } = require("./utils/dateParser");
const { parseCargoLine } = require("./utils/cargoParser");

function cleanLine(line) {
  return String(line || "")
    .replace(/[*_]/g, "")
    .trim();
}

function parseWhatsappMessage(raw) {
  if (!raw || typeof raw !== "string") return null;

  const rawLines = raw.split("\n");
  const lines = rawLines.map((l) => cleanLine(l)).filter((l) => l.length);

  let date = null;
  let origin = null;
  const items = [];
  let safetyNote = null;

  for (const line of lines) {
    // Skip header greetings explicitly (optional)
    const low = line.toLowerCase();
    if (
      /dear team transporter|remind order|order baru|planning loading/i.test(
        low
      )
    ) {
      continue;
    }

    // detect date (first date-like line)
    if (!date) {
      const parsed = normalizeDate(line);
      if (parsed) {
        date = parsed;
        continue;
      }
    }

    // origin line
    if (!origin && /\borigin\b/i.test(line)) {
      origin = line.replace(/origin/i, "").trim();
      continue;
    }

    // safety note detection
    if (/pastikan driver/i.test(low)) {
      safetyNote = line.replace(/_|\*/g, "").trim();
      continue;
    }

    // cargo lines (line contains cbm)
    if (/cbm/i.test(line)) {
      const cargo = parseCargoLine(line);
      if (cargo) items.push(cargo);
      else {
        // For observability: we could log or store unparsable lines
        // but for now we skip silently
      }
      continue;
    }

    // Other lines ignored
  }

  return { date, origin, items, safetyNote };
}

module.exports = { parseWhatsappMessage };
