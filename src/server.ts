import app from "./app.js";
import config from "./configs/dotenv-config.js";
import "./configs/init-config.js";

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
