const { javascript } = require("projen");
const { NodePackageManager } = require("projen/lib/javascript");
const project = new javascript.NodeProject({
  defaultReleaseBranch: "main",
  name: "ocp-mac-visualizer",
  license: "Apache-2.0",
  authorName: "Mike Gray",
  authorEmail: "mike@oscillatelabs.net",
  packageManager: NodePackageManager.PNPM,

  deps: ["express", "socket.io", "ws"],
});
project.synth();
