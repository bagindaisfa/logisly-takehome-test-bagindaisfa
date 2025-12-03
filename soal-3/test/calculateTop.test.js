const { calculateTopResult } = require("../src/calculateTop");

test("Test Case 1", () => {
  expect(calculateTopResult(7, 5, 3)).toBe(15);
});
test("Test Case 2", () => {
  expect(calculateTopResult(10, 35, 25)).toBe(45);
});
test("Test Case 3", () => {
  expect(calculateTopResult(20, 30, 30)).toBe(45);
});
test("Test Case 4", () => {
  expect(calculateTopResult(14, 0, 0)).toBe(14);
});
test("Test Case 5", () => {
  expect(calculateTopResult(5, -2, 0)).toBe(5);
});
test("Test Case 6", () => {
  expect(calculateTopResult(15, 20, 15)).toBe(45);
});
test("Test Case 7", () => {
  expect(calculateTopResult(10, 30, 0)).toBe(40);
});
test("Test Case 8", () => {
  expect(calculateTopResult(45, 0, 0)).toBe(45);
});
