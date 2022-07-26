const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    "baseUrl": "https://localhost.leafiny/",
    "viewportWidth": 1280,
    "viewportHeight": 1080,
    "supportFile": false
  },
});
