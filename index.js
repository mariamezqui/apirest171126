// Cargar el .env al importar este modulo, antes de leer MONGODB URI

import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";
import { notFound, errorHandler } from "./src/middlewares/errorMiddleware.js";

//Crear la aplicacion de express; en este archivo se conecta sus piezas principales

const app = express();

//Inicio la conexion a la base de datos usando la configuracion del entorno

connectDB();

//lOS mIDDLEWARES PROCESAN CADA PETICION ANTES Q LLEGUE A UNA RUTA
//CORS permite solicitudes desde otros origenes y express.json interpreta cuerpos json
app.use(cors())
app.use(express.json());

//EndPoint de Comprobación: informa que el servidor is alive.

app.get("/", (req, res)=>{
    res.status(200).json({
        success: true,
        message:"Api Restfull Operativa y conectada a Atlas DB",
        endpoints: {
            products: "/api/products",
        },
    });
});

//Todas rutas de productos quedan agrupadas bajo el prefijo api/poroducts
app.use("/api/product", productRoutes);

//Esto se cololca despues de las rutas: primero detectamos endpoints q no existen
// luego se centraliza el tratamiento de los errores con next(error)

app.use(notFound);
app.use(errorHandler);

// En local o desarrollo si inician un servidor HTTP usamos el local con puerto o importamos los datos de vercel
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, ()=> {
        console.log(`Servidor ejecutandose en localhost`);
    });
}

export default app;