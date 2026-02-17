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

project.package.addField("pnpm", {
  overrides: {
    "micromatch@<4.0.8": ">=4.0.8",
    "body-parser@<1.20.3": ">=1.20.3",
    "serve-static@<1.16.0": ">=1.16.0",
    "express@<4.20.0": ">=4.20.0",
    "path-to-regexp@<0.1.10": ">=0.1.10",
    "cookie@<0.7.0": ">=0.7.0",
    "@babel/helpers@<7.26.10": ">=7.26.10",
    "path-to-regexp@<0.1.12": ">=0.1.12",
    "brace-expansion@>=1.0.0 <=1.1.11": ">=1.1.12",
    "send@<0.19.0": ">=0.19.0",
    "js-yaml@<3.14.2": ">=3.14.2",
    "qs@<6.14.1": ">=6.14.1",
    "qs@>=6.7.0 <=6.14.1": ">=6.14.2",
  },
});

project.synth();
