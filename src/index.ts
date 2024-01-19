import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(passport.initialize());

const users = [
    { id: 1, username: 'user', password: 'password' }
];

passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })
);
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to your profile');
    } else {
        res.redirect('/login');
    }
});
app.get('/login', (req, res) => {
    res.send('Login page');
});

function ensureAuthenticated(req: Request, res: Response, next: Function) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
app.get('/protected', ensureAuthenticated, (req, res) => {
    res.send('This is a protected route');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});