// Importar modulos necesarios
import express from "express";
const routes = express.Router();
import User from "../models/userModel.js";

// !Rutas get
// Puedes acceder a ellas con la url
// !Rutas post
// Puedes acceder a ellas con el formulario

// Ruta para la página principal
routes.get("/", (req, res) => {
	// Validamos que el usuario este logueado
	if (!req.session.user) {
		return res.redirect("/signin");
	}
	res.render("index", { user: req.session.user });
});

// Ruta para cerrar sesion
routes.get("/logout", (req, res) => {
	// Destruimos la sesion
	req.session.destroy(() => {
		res.redirect("/signin");
	});
});

// Ruta para la página Acerca de Nosotros (about.ejs)
routes.get("/about", (req, res) => {
	// Validamos que el usuario este logueado
	if (!req.session.user) {
		return res.redirect("/signin");
	}
	res.render("about", {});
});

// Ruta para la página de Contacto (contact.ejs)
routes.get("/contact", (req, res) => {
	// Validamos que el usuario este logueado
	if (!req.session.user) {
		return res.redirect("/signin");
	}
	res.render("contact", {});
});

// Ruta para la página de Iniciar sesión (signin.ejs)
routes.get("/signin", (req, res) => {
	res.render("signin", {});
});

// Ruta para la página de Registrarse (signup.ejs)
routes.get("/signup", (req, res) => {
	res.render("signup", {});
});

// *** FUNCIONES ASINCRONAS
/*
    QUE SON LAS FUNCIONES ASINCRONAS
    son funciones que esperan a que se ejecute una tarea para continuar con la ejecucion del codigo
    se utilizan para tareas que tardan mucho tiempo en ejecutarse
    ! se utilizan para ta reas que dependen de otras tareas
    se utilizan para tareas que se ejecutan en segundo plano
*/
// Ruta para el registro de usuarios
routes.post("/signup", async (req, res) => {
	try {
		// Intentar crear un usuario
		// Obtener los datos del formulario
		// Destructurar objeto req.body
		const { name, lastname, email, password } = req.body;
		// Crear el usuario
		const newUser = await User.create({
			name,
			lastname,
			email,
			password,
			status: true,
		})
			.then((user) => {
				console.log("Usuario creado", user);
				res.redirect("/signin");
			})
			.catch((error) => {
				console.error(error);
				res.redirect("/signup");
			});
	} catch (error) {
		console.error(error);
		res.redirect("/signup");
	}
});

// Ruta para el inicio de sesión
routes.post("/signin", async (req, res) => {
	try {
		// Obtener los datos del formulario
		// Destructurar objeto req.body
		const { email, password } = req.body;
		// Buscar el usuario en la base de datos
		const user = await User.findOne({
			where: {
				email,
			},
		});
		// Si el usuario existe
		if (user) {
			// Verificar la contraseña
			if (user.password === password) {
				// Crear sesion de usuario
				req.session.user = user;
				res.redirect("/");
			} else {
				// Contraseña incorrecta
				console.log("Contraseña incorrecta");
				res.redirect("/signin");
			}
		} else {
			// El usuario no existe
			console.log("El usuario no existe");
			res.redirect("/signin");
		}
	} catch (error) {
		console.error(error);
		res.redirect("/signin");
	}
});

export default routes;
