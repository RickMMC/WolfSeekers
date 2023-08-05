// Importar las librerias que vamos a ocupar
import express, { urlencoded } from "express";
import { dirname, join } from "path";
import cors from "cors";
import http from "http";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

// Importar las rutas
import routes from "./routes/routes.js";

// Obtener la ruta del directorio actual
const __dirname = dirname(fileURLToPath(import.meta.url));
// Crear una aplicación de Express
const app = express();
// Estableces el puerto
const port = process.env.PORT || 3000;
// Crear un servidor HTTP usando Express
const server = http.createServer(app);
// Crear una instancia de Socket.io
const io = new Server(server);

// Utilizar dontev para leer las variables de entorno
dotenv.config();

// Iniciar el servidor
http.Server(app).listen(port, () => {
	console.log(`La aplicación está ejecutando en http://localhost:${port}`);
});

// Establecer EJS como motor de vistas
app.set("view engine", "ejs");
// Utilizar cors
app.use(cors());
app.use(urlencoded({ extended: true }));
// Cookies
app.use(cookieParser());
// Configuracion de los cookies
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 }, // 1 DIA en milisegundos
    })
);
// Configurar las rutas de acceso
app.use('/', routes);
// Configurar el directorio de recursos estáticos
app.use('/libs', express.static(join(__dirname, 'src/libs')));
app.use('/js', express.static(join(__dirname, 'src/js')));
app.use('/imgs', express.static(join(__dirname, 'src/imgs')));
app.use('/css', express.static(join(__dirname, 'src/css')));