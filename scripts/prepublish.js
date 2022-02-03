var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_eslint = __toModule(require("eslint"));
var import_chalk = __toModule(require("chalk"));
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
const __dirname = (0, import_path.resolve)();
const lintFile = async () => {
  const eslint = new import_eslint.ESLint();
  const results = await eslint.lintFiles([
    "src/**/*.ts",
    "src/main.ts",
    "src/**/*.vue"
  ]);
  let tw = 0, te = 0;
  let hasw = false;
  for (let i = 0; i in results; i++) {
    if (results[i].messages.length != 0) {
      console.log(import_chalk.default.underline(results[i].filePath));
      hasw = true;
    }
    for (let j = 0; j in results[i].messages; j++) {
      if (results[i].messages[j].severity == 1) {
        console.log("  " + import_chalk.default.dim(`${results[i].messages[j].line}:${results[i].messages[j].column}`) + "  " + import_chalk.default.yellow("warning") + "  " + results[i].messages[j].message + "  " + import_chalk.default.dim(results[i].messages[j].ruleId));
      } else if (results[i].messages[j].severity == 2) {
        console.log("  " + import_chalk.default.dim(`${results[i].messages[j].line}:${results[i].messages[j].column}`) + "  " + import_chalk.default.red("error") + "  " + results[i].messages[j].message + "  " + import_chalk.default.dim(results[i].messages[j].ruleId));
      }
    }
    if (results[i].messages.length != 0) {
      console.log();
    }
    tw += results[i].warningCount;
    te += results[i].errorCount;
  }
  if (hasw) {
    console.log(import_chalk.default.bold.yellow(`\u2716 ${tw + te} problems (${te} errors, ${tw} warnings)`));
  }
  if (te > 0) {
    console.log(import_chalk.default.dim.red("Builder is waiting for no error."));
  }
};
lintFile().then(() => {
  let packageFile = JSON.parse((0, import_fs.readFileSync)((0, import_path.resolve)(__dirname, "./package.json")).toString());
  packageFile.main = "dist/main.min.js";
  let versions = packageFile.version.split(".");
  versions[2] += 1;
  packageFile.verson = versions.join(".");
  (0, import_fs.writeFileSync)((0, import_path.resolve)(__dirname, "./package.json"), JSON.stringify(packageFile, "", 4));
});
