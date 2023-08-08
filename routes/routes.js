// Importar modulos necesarios
import express from "express";
const routes = express.Router();
import User from "../models/userModel.js";
import Post from "../models/postsModel.js";

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
	res.render("index", {
		user: req.session.user,
		messages: req.session.login,
	});
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
	res.render("about", {
		user: req.session.user,
		messages: req.session.about,
	});
});

// Ruta para la página de Contacto (contact.ejs)
routes.get("/contact", (req, res) => {
	// Validamos que el usuario este logueado
	if (!req.session.user) {
		return res.redirect("/signin");
	}
	res.render("contact", {
		user: req.session.user,
		messages: req.session.contact,
	});
});

// Ruta para la página de Iniciar sesión (signin.ejs)
routes.get("/signin", (req, res) => {
	res.render("signin", {
		messages: req.session.sigin,
	});
});

// Ruta para la página de Registrarse (signup.ejs)
routes.get("/signup", (req, res) => {
	res.render("signup", {
		messages: req.session.singup,
	});
});

// Ruta para crear nuevo post
routes.get("/newpost", (req, res) => {
	// Validamos que el usuario este logueado
	// signo de admiracion==undefined
	if (!req.session.user) {
		return res.redirect("/signin");
	}
	res.render("newpost", {
		user: req.session.user,
		messages: req.session.newpost,
	});
});

// Ruta para ver los posts
routes.get("/posts", async (req, res) => {
	try {
		// Validamos que el usuario este logueado
		if (!req.session.user) {
			return res.redirect("/signin");
		}
		// Obtenemos los posts
		const posts = await Post.findAll();

		res.render("posts", {
			user: req.session.user,
			messages: req.session.posts,
			posts,
		});
	} catch (error) {
		console.error(error);
		res.redirect("/");
	}
});

// Ruta para obtener todos los posts creados por el usuario
routes.get("/editposts", async (req, res) => {
	try {
		// Validamos que el usuario este logueado
		if (!req.session.user) {
			return res.redirect("/signin");
		}
		// Obtenemos los posts del usuario
		const posts = await Post.findAll({
			where: {
				id_user: req.session.user.id,
			},
		});
		// Validamos que el usuario tenga posts
		if (posts.length === 0) {
			return res.redirect("/newpost");
		}
		// Renderizamos la vista
		res.render("editposts", {
			// pasar usuario como parametro
			user: req.session.user,
			messages: req.session.editposts,
			posts,
		});
	} catch (error) {
		console.error(error);
		res.redirect("/");
	}
});

// Ruta para obtener el post por el id y mostrarlo al usuario para que pueda editarlo
routes.get("/editpost/:id", async (req, res) => {
	// Validamos que el usuario este logueado
	if (!req.session.user) {
		return res.redirect("/signin");
	}
	// Obtenemos el id de la url
	const { id } = req.params;
	// Obtenemos el post
	const post = await Post.findOne({
		where: {
			id,
		},
	});

	res.render("editpost", {
		user: req.session.user,
		messages: req.session.editpost,
		post,
	});
});

// Ruta para eliminar un post
routes.get("/deletepost/:id", async (req, res) => {
	try {
		// Obtener los datos del url
		const { id } = req.params;
		// Eliminar el post
		const deletePost = await Post.destroy({
			where: {
				id,
			},
		})
			.then((post) => {
				console.log("Post eliminado", post);
				res.redirect("/");
			})
			.catch((error) => {
				console.error(error);
				res.redirect("/");
			});
	} catch (error) {
		console.error(error);
		res.redirect("/");
	}
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
				// ! Crear sesion de usuario
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

// Ruta para crear nuevos post
routes.post("/newpost", async (req, res) => {
	try {
		// Obtener los datos del formulario
		// Destructurar objeto req.body
		const { company, id_user, email, title, content } = req.body;
		// Crear el post
		const newPost = await Post.create({
			company,
			id_user,
			email,
			title,
			content,
		})
			.then((post) => {
				console.log("Post creado", post);
				res.redirect("/posts");
			})
			.catch((error) => {
				console.error(error);
				res.redirect("/");
			});
	} catch (error) {
		console.error(error);
		res.redirect("/");
	}
});

// Ruta para editar el post que se envió desde el formulario
routes.post("/editpost", async (req, res) => {
	try {
		// Obtener los datos del formulario
		// Destructurar objeto req.body
		const { id, company, id_user, email, title, content } = req.body;
		// Editar el post
		const editPost = await Post.update(
			{
				company,
				title,
				content,
			},
			{
				where: {
					id,
				},
			}
		)
			.then((post) => {
				console.log("Post editado", post);
				res.redirect("/posts");
			})
			.catch((error) => {
				console.error(error);
				res.redirect("/");
			});
	} catch (error) {
		console.error(error);
		res.redirect("/");
	}
});

export default routes;
