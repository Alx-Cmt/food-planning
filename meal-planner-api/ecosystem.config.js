module.exports = {
  apps: [
    {
      name: "strapi",
      script: "./node_modules/@strapi/strapi/bin/strapi.js",
      args: "start",
      cwd: "C:\\Users\\cimit\\Desktop\\Food_planing\\meal-planner-api",
      interpreter: "node",
      autorestart: true
    }
  ]
};