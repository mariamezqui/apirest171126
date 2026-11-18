import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";
import { notFound, errorHandler } from "./src/middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Api Restfull Operativa y conectada a Atlas DB",
        endpoints: {
            products: "/api/products",
        },
    });
});

// Espera a que haya conexión con Atlas antes de pasar a las rutas.
// Si falla, el error va al errorHandler (respuesta JSON 500).
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
}

export default app;