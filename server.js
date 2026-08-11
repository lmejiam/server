import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { dbConnect } from './config/db.config.js';
import router from './routes/fish.routes.js';
import router_fish from './routes/fish.routes.js';
import router_upload from './routes/upload.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'

const app = express();

//app.use(cookieParser());
app.use(express.json(), cors({credentials: true,origin: 'http://localhost:5173' }));

//app.use(parser)
//app.use(encoded)
//app.use(bodyParser.text({limit: '200mb'}))

dotenv.config();

app.use("/api", router, router_fish, router_upload)

const PORT = process.env.PORT;
dbConnect();
app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);