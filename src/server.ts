import app from "./app.js";
import { connectToDB } from "./config/db.js";
import http from "http";

async function StartServer() {
  await connectToDB();
  const server = http.createServer(app);
  app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT} `);
  });
}
StartServer().catch((err) => {
  console.error("Error starting the server", err);
  process.exit(1);
});
