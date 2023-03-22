import express, { type Express, type Request, type Response } from "express";
const port = 3000;

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TS!!!!!");
});

app.get("/hi", (req: Request, res: Response) => {
  res.send("Hello!!!");
});

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
