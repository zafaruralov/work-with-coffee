const semver = require("semver");

const semantics = ["major", "minor", "patch"];

const currentVersion = process.argv[2];
const comment = process.argv[3];

const semanticVersionType = semantics.reduce((acc, curr) => {
  if (comment.startsWith(`[${curr}]`)) {
    acc = curr;
  }
  return acc;
}, "patch");

const newVersion = semver.inc(currentVersion, semanticVersionType);

console.log(newVersion);
