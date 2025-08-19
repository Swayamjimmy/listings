import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products",productRoutes)

app.listen(3000, () => {
    connectDB();
    console.log("Server started at LocalHost:" + PORT);
});


