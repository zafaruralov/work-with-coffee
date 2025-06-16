import { readFileSync, writeFileSync } from "fs";

const newVersion = process.argv[2];

const packageJsonPath = "./package.json";
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

console.log(`package.json version updated to ${newVersion}`);
