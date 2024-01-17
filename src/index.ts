import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});