import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  JWT_SECRET: str(),
  CONN: str(),
  MONGO_URI: str(),
});
