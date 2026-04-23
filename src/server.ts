import app from "./app.js";
import config from "./configs/dotenv-config.js";
import "./configs/init-config.js";
import cors from "cors";

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
