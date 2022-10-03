const {
  FacingTypes,
  CommandTypes,
  validatePosition,
  validateFace,
  validatePlace,
  validateAction,
  validate,
  getPosition,
  getMoveStep,
  move,
  rotate,
} = require("./main");

test("validate position", () => {
  expect(validatePosition("4")).toBe(true);
  expect(validatePosition("0")).toBe(true);
  expect(validatePosition("8")).toBe(false);
});

test("validate position face", () => {
  expect(validateFace(FacingTypes.north)).toBe(true);
  expect(validateFace(FacingTypes.south)).toBe(true);
  expect(validateFace(FacingTypes.east)).toBe(true);
  expect(validateFace(FacingTypes.west)).toBe(true);
  expect(validateFace("LEFT")).toBe(false);
});

test("validate position place", () => {
  expect(validatePlace("PLACE 1,2,EAST")).toBe(true);
  expect(validatePlace("PLACE 2,4,SOUTH")).toBe(true);
  expect(validatePlace("PLACE 1,2,LEFT")).toBe(false);
});

test("validate action", () => {
  expect(validateAction(CommandTypes.left)).toBe(true);
  expect(validateAction(CommandTypes.right)).toBe(true);
  expect(validateAction(CommandTypes.move)).toBe(true);
  expect(validateAction(CommandTypes.report)).toBe(true);
  expect(validateAction("PLACE")).toBe(false);
});

test("validate command", () => {
  expect(validate(CommandTypes.left)).toBe(true);
  expect(validate(CommandTypes.left)).toBe(true);
  expect(validate(CommandTypes.move)).toBe(true);
  expect(validate(CommandTypes.report)).toBe(true);
  expect(validate("PLACE 1,2,EAST")).toBe(true);
  expect(validate("PLACE")).toBe(false);
});

test("get position place", () => {
  const position = getPosition("PLACE 2,4,SOUTH");
  expect(position.positionX).toBe(2);
  expect(position.positionY).toBe(4);
  expect(position.face).toBe(FacingTypes.south);
});

test("get move step", () => {
  expect(getMoveStep(FacingTypes.north)).toStrictEqual([0, 1]);
  expect(getMoveStep(FacingTypes.south)).toStrictEqual([0, -1]);
  expect(getMoveStep(FacingTypes.east)).toStrictEqual([1, 0]);
  expect(getMoveStep(FacingTypes.west)).toStrictEqual([-1, 0]);
});

test("move", () => {
  const position1 = move({
    positionX: 0,
    positionY: 0,
    face: "NORTH",
  });
  expect(position1.positionX).toBe(0);
    expect(position1.positionY).toBe(1);
    
    const position2 = move({
      positionX: 0,
      positionY: 0,
      face: "WEST",
    });
    expect(position2.positionX).toBe(0);
    expect(position2.positionY).toBe(0);
});

test('rotate', () => {
    expect(rotate(FacingTypes.north, CommandTypes.right)).toBe(FacingTypes.east);
    expect(rotate(FacingTypes.west, CommandTypes.left)).toBe(
      FacingTypes.south
    );
})
