#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { parseWhatsappMessage } = require("./whatsappParser");

const samplePath = path.resolve(__dirname, "../samples/sample_messages.txt");
const outPath = path.resolve(__dirname, "../samples/sample_parsed.json");

const raw = fs.readFileSync(samplePath, "utf8");
const parsed = parseWhatsappMessage(raw);

fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
console.log("Parsed result written to", outPath);
console.log(JSON.stringify(parsed, null, 2));
