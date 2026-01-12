const { javascript } = require("projen");
const { NodePackageManager } = require("projen/lib/javascript");
const project = new javascript.NodeProject({
  defaultReleaseBranch: "main",
  name: "ocp-mac-visualizer",
  license: "Apache-2.0",
  authorName: "Mike Gray",
  authorEmail: "mike@oscillatelabs.net",
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: "9",

  deps: ["express", "socket.io", "ws", "qs@^6.14.1"],
});
project.gitignore.addPatterns(".DS_Store");
project.gitignore.addPatterns(".pnpm-store/");
project.synth();
