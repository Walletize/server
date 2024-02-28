import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import secureRoute from './routes/secure_routes';
import 'dotenv/config'
require('./auth/auth');
import cors from "cors";
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import {JwtToken} from "./helpers/types";

export const prisma = new PrismaClient()

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api', routes);
app.use('/api', passport.authenticate('jwt', { session: false }), secureRoute);

app.listen(process.env.PORT, () => {
    console.log('Server started at ' + process.env.PORT)
});
