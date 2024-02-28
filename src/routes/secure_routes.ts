import express from "express";
import transactions from "./transactions";
import assets from "./assets";
import users from "./users";

const router = express.Router()

router.use('/transactions', transactions);
router.use('/assets', assets);
router.use('/users', users);

export default router;
