import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { dbConnect } from './config/db.config.js';
import router from './routes/fish.routes.js';
import router_fish from './routes/fish.routes.js';
import router_upload from './routes/upload.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'
import router_status from './routes/status.routes.js';
import { checkDailyExport } from './controllers/fish.controller.js';
import router_images from './routes/images.routes.js';
import { IMAGES_DIR } from './controllers/images.controller.js';

const app = express();

//app.use(cookieParser());
app.use(express.json(), cors({credentials: true,origin: 'http://localhost:5173' }));

//app.use(parser)
//app.use(encoded)
//app.use(bodyParser.text({limit: '200mb'}))

dotenv.config();

app.use('/images', express.static(IMAGES_DIR));
app.use("/api", router, router_fish, router_upload, router_status, router_images)

const PORT = process.env.PORT;
dbConnect();
setInterval(checkDailyExport, 60000)
app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);