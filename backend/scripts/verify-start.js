process.env.PORT = process.env.PORT || "5050";
process.env.SKIP_DB = "true";

await import("../src/server.js");

setTimeout(() => {
  process.exit(0);
}, 2000);
