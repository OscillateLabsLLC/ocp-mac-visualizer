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

  deps: [
    "express",
    "socket.io",
    "ws",
    "qs@^6.14.1",
    "body-parser@^1.20.3",
    "path-to-regexp@^0.1.12",
  ],
  devDeps: ["cross-spawn@^7.0.5"],
});
project.gitignore.addPatterns(".DS_Store");
project.gitignore.addPatterns(".pnpm-store/");
project.synth();
