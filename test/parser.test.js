const fs = require("fs");
const path = require("path");
const { parseWhatsappMessage } = require("../src/whatsappParser");

test("parses sample message", () => {
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../samples/sample_messages.txt"),
    "utf8"
  );
  const out = parseWhatsappMessage(raw);
  expect(out).toHaveProperty("date", "2024-10-23");
  expect(out).toHaveProperty("origin", "KCS Karawang");
  expect(Array.isArray(out.items)).toBe(true);
  expect(out.items.length).toBeGreaterThanOrEqual(1);
  // example assertion for first item
  expect(out.items[0]).toHaveProperty("volumeCbm");
  expect(out.safetyNote).toMatch(/Pastikan Driver/i);
});
