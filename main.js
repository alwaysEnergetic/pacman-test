const fs = require("fs");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);

const FacingTypes = {
  north: "NORTH",
  south: "SOUTH",
  east: "EAST",
  west: "WEST",
};

const CommandTypes = {
  place: "PLACE ",
  move: "MOVE",
  left: "LEFT",
  right: "RIGHT",
  report: "REPORT",
};

function validatePosition(param) {
  return /^[0-4]+$/.test(param.toString().trim());
}

function validateFace(param) {
  return Object.values(FacingTypes).indexOf(param.trim()) >= 0;
}

function validatePlace(param) {
  if (param.includes(CommandTypes.place)) {
    const placeParams = param.replace(CommandTypes.place, "").split(",");
    return (
      placeParams.length === 3 &&
      validatePosition(placeParams[0]) &&
      validatePosition(placeParams[1]) &&
      validateFace(placeParams[2])
    );
  }
  return false;
}

function validateAction(param) {
  if (
    Object.values(CommandTypes).indexOf(param) >= 0 &&
    param !== CommandTypes.place
  ) {
    return true;
  }
  return false;
}

function validate(param) {
  if (validateAction(param)) {
    return true;
  }
  return validatePlace(param);
}

function getPosition(param) {
  const placeParams = param.replace(CommandTypes.place, "").split(",");
  const positionX = Number(placeParams[0].trim());
  const positionY = Number(placeParams[1].trim());
  const face = placeParams[2].trim();
  return {
    positionX,
    positionY,
    face,
  };
}

function getMoveStep(face) {
  switch (face) {
    case FacingTypes.north:
      return [0, 1];
    case FacingTypes.south:
      return [0, -1];
    case FacingTypes.east:
      return [1, 0];
    case FacingTypes.west:
      return [-1, 0];
    default:
      return [0, 0];
  }
}

function move(position) {
  const step = getMoveStep(position.face);
  return {
    positionX: validatePosition(position.positionX + step[0])
      ? position.positionX + step[0]
      : position.positionX,
    positionY: validatePosition(position.positionY + step[1])
      ? position.positionY + step[1]
      : position.positionY,
    face: position.face,
  };
}

function rotate(face, direction) {
  const faces = [
    FacingTypes.north,
    FacingTypes.west,
    FacingTypes.south,
    FacingTypes.east,
  ];
  const directionStep =
    direction === CommandTypes.left
      ? 1
      : direction === CommandTypes.right
      ? -1
      : 0;
  const currentDirectionIndex = faces.indexOf(face);
  return faces[(currentDirectionIndex + directionStep + 4) % 4];
}

async function loadScript() {
  const data = await readFileAsync("script.txt", "binary");
  return data
    .toString()
    .split("\r\n")
    .filter((t) => validate(t.trim().toUpperCase()));
}

async function saveScript(positionX, positionY, face) {
  await writeFileAsync(
    "result.txt",
    positionX + ", " + positionY + ", " + face + "\n",
    function (err) {
      if (err) throw err;
    }
  );
}

loadScript().then((res) => {
  let positionX = 0;
  let positionY = 0;
  let face = FacingTypes.east;
  res.forEach(async (command) => {
    if (command.includes(CommandTypes.place)) {
      const position = getPosition(command);
      positionX = position.positionX;
      positionY = position.positionY;
      face = position.face;
    }
    if (command.includes(CommandTypes.move)) {
      const position = move({ positionX, positionY, face });
      positionX = position.positionX;
      positionY = position.positionY;
    }
    if (
      command.includes(CommandTypes.left) ||
      command.includes(CommandTypes.right)
    ) {
      const positionFace = rotate(face, command);
      face = positionFace;
    }
    if (command.includes(CommandTypes.report)) {
      await saveScript(positionX, positionY, face);
    }
  });
});

module.exports = {
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
};
