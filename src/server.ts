import app from "./app.js";
import config from "./configs/dotenv-config.js";
import "./configs/init-config.js";




app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
