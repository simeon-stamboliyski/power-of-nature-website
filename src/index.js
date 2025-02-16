import express from "express";
import hbs from 'express-handlebars';
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cookieParser from "cookie-parser";

import Router from "./routes.js";
import { auth } from "./middlewares/auth-middleware.js";

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017/powerOfNature';

try {
    await mongoose.connect(uri);
    console.log('Successfully connected to DB!');
} catch (err) {
    console.log('DB connection failed!');
    console.error(err);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hbsInstance = hbs.create({ 
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        eq: (a, b) => a === b
    }
});

app.engine('hbs', hbsInstance.engine);
app.set('view engine', 'hbs');

app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(auth);

app.use(Router);

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}...`);
});