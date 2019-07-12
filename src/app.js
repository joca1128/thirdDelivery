//requires
require('./config/config');
require('../src/helpers/helper')
const express=require("express");
const app=express();
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const bodyparser= require("body-parser");
const Curso= require("../src/models/curso");
const Estudiante= require("../src/models/estudiante");
const Usuario =require("../src/models/usuario");
const bcrypt = require('bcrypt');
const session =require("express-session");
var MemoryStore = require('memorystore')(session)


//caminos
const caminoDeVistas = path.join(__dirname,"../template/views");
const caminoDeParciales = path.join(__dirname,"../template/partials");
const directoriopublico = path.join(__dirname,"../public");

//definir que se usará un motor hbs, y definir las vistas y registrar los parciales
app.use(express.static(directoriopublico));
app.set("view engine","hbs");
app.set("views",caminoDeVistas);
hbs.registerPartials(caminoDeParciales);
app.use(bodyparser.urlencoded({extended:false}))
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
app.use((req,res,next)=>{
    if(req.session.usuario){
        res.locals.session = true;
        res.locals.nombres=req.session.usuario.nombre;
        if(req.session.usuario.tipo==="coordinador"){
            res.locals.coordinador=true;
        }
        if(req.session.usuario.tipo==="aspirante"){
            res.locals.aspirante=true;
        }
    }
    next();
});

//desplegar vistas a partir de los request

app.get("/",(req,res)=>{
    res.render("inicio",{
        saludo:"BIENVENIDO",
        titulo:"Página de inicio",
        color:"dark"
    });
});

app.post("/",(req,res)=>{
    let usuario=new Usuario({
        nombre:req.body.nombre,
        identidad:req.body.identidad,
        correo:req.body.correo,
        telefono:req.body.telefono,
        contraseña:bcrypt.hashSync(req.body.identidad, 7)
    });
    usuario.save((err,resultado)=>{
        if(err){
            res.render("inicio",{
                error:err,
                saludo:"No se pudo crear el usuario",
                titulo:"Página de inicio",
                color:"dark"
            });
        }
        else{
            res.render("inicio",{
                saludo:"USUARIO CREADO",
                titulo:"Página de usuario creado",
                color:"dark",
                nombre:resultado.nombre,
                identidad:resultado.identidad,
                correo:resultado.correo,
                telefono:resultado.telefono,
                tipo:resultado.tipo,
                contraseña:resultado.contraseña
            });
        }
    });
});

app.get("/crear",(req,res)=>{
    res.render("crear",{
        saludo:"CREACIÓN DE CURSOS",
        titulo:"Página creación de cursos",
        color:"dark"
    });
});

app.post("/crear",(req,res)=>{
    let curso = new Curso ({
        nombre:req.body.nombre,
        id:req.body.id,
        descripcion:req.body.descripcion,
        valor:req.body.valor,
        modalidad:req.body.modalidad,
        intensidad:req.body.intensidad
    });
    curso.save((err,resultado)=>{
        if(err){
            res.render("crear",{
                err:err,
                saludo:"NO SE PUDO CREAR EL CURSO",
                titulo:"Página de curso creado",
                color:"dark"
            });
        }
        else{
            res.render("crear",{
                saludo:"CURSO CREADO",
                titulo:"Página de curso creado",
                color:"dark",
                nombre:resultado.nombre,
                id:resultado.id,
                descripcion:resultado.descripcion,
                valor:resultado.valor,
                modalidad:resultado.modalidad,
                intensidad:resultado.intensidad
            });
        }
    })  
});

app.get("/cursos",(req,res)=>{
    Curso.find({estado:"disponible"}).exec((err,respuesta)=>{
		if(err){
			
			return console.log(err);
		}
		else{
            res.render("cursos",{
                saludo:"VISTA DE CURSOS",
                titulo: "Visión de los cursos",
                color:"dark",
                listado:respuesta
            });
		}
	})
});

app.get("/inscribir",(req,res)=>{  
    Curso.find({estado:"disponible"}).exec((err,respuesta)=>{
		if(err){
			alert("Esta vaina tiró un error");
			return console.log(err);
        } 
        else{
                    res.render("inscribir",{
                        color:"dark",
                        saludo:"INSCRIPCIÓN DE CURSOS",
                        titulo:"inscripción",
                        listado:respuesta,
                        });
                }
            }); 
        });

app.post("/inscribir",(req,res)=>{
    Estudiante.find({documento:req.body.documento}).exec((err,respuesta)=>{
        if(err){
            console.log(err);
            return alert(err);
        }
        if(respuesta.length==0){
            let estudiante = new Estudiante({
                nombre: req.body.nombre,
                documento:req.body.documento,
                correo:req.body.correo,
                telefono:req.body.telefono,
                cursos:req.body.curso
            });
            estudiante.save((error,resultado)=>{
                if(error){
                    res.render("inscribir",{
                        err:error,
                        color:"dark",
                        saludo:"NO SE PUDO INSCRIBIR EL ESTUDIANTE EN EL CURSO DESEADO",
                        titulo:"Inscripción no creada"
                    });
                }
                else{
                    res.render("inscribir",{
                        color:"dark",
                        saludo:"ESTUDIANTE INSCRITO",
                        titulo:"Página de estudiante inscrito",
                        nombre: resultado.nombre,
                        documento:resultado.documento,
                        correo:resultado.correo,
                        telefono:resultado.telefono,
                        curso:resultado.cursos
                    });
                }
            }) 
        }
        else{
            Estudiante.find({documento:req.body.documento,cursos:req.body.curso}).exec((err,respues)=>{
                if(err){
                    console.log(err);
                    return alert(err);
                }
                if(respues.length==0){
                    Estudiante.findOneAndUpdate({documento:req.body.documento},{$push:{cursos:req.body.curso}}, {new : true, runValidators: true, context: 'query' },(erra,respu)=>{
                        console.log(respu);
                        if (erra){
                            return console.log(erra)
                        }
                        else{
                            res.render("inscribir",{
                                saludo:"ESTUDIANTE INSCRITO",
                                titulo:"Página de estudiante inscrito",
                                color:"dark",
                                nombre: respu.nombre,
                                documento:respu.documento,
                                correo:respu.correo,
                                telefono:respu.telefono,
                                curso:respu.cursos
                            });
                        }
                    });
                }
                else{
                    res.render("inscribir",{
                        color:"dark",
                        err:"Estudiante con esta identificacción ya esta inscrito en este curso",
                        saludo:"NO SE PUDO INSCRIBIR EL ESTUDIANTE EN EL CURSO DESEADO",
                        titulo:"Inscripción no creada"
                    });
                }
            })
        }
    });
});

app.get("/verCursos",(req,res)=>{
    Curso.find({estado:"disponible"}).exec((err,cursos)=>{
        if(err){
            return console.log(err);
        }
        else{
            Estudiante.find({}).exec((erra,estudiantes)=>{ 
                if(erra){
                    return console.log(erra);
                }
                else{
                    res.render("verCursos",{
                        color:"dark",
                        saludo:"VISUALIZACIÓN DE CURSOS",
                        titulo:"Página de visualización de cursos",
                        estudiantes:estudiantes,
                        cursos:cursos
                    });
                }
            });
        }
    });
});

app.post("/verCursos",(req,res)=>{
    Curso.findOneAndUpdate({id:req.body.id},{$set:{estado:"Cancelado"}}, {new : true, runValidators: true, context: 'query' },(erro,resultan)=>{
        if(erro){
            return console.log(erro);
        }
        if(!resultan){
            Curso.find({estado:"disponible"}).exec((err,cursos)=>{
                if(err){
                    return console.log(err);
                }
                else{
                    Estudiante.find({}).exec((erra,estudiantes)=>{ 
                        if(erra){
                            return console.log(erra);
                        }
                        else{
                            res.render("verCursos",{
                                color:"dark",
                                saludo:"VISUALIZACIÓN DE CURSOS NO SE ELIMINÓ NADA",
                                titulo:"Página de visualización de cursos",
                                estudiantes:estudiantes,
                                cursos:cursos
                            });
                        }
                    });
                }
            });
        }
        else{
            Curso.find({estado:"disponible"}).exec((err,cursos)=>{
                if(err){
                    return console.log(err);
                }
                else{
                    Estudiante.find({}).exec((erra,estudiantes)=>{ 
                        if(erra){
                            return console.log(erra);
                        }
                        else{
                            res.render("verCursos",{
                                color:"dark",
                                saludo:"VISUALIZACIÓN DE CURSOS ELEMENTO ELIMINADO",
                                titulo:"Página de visualización de cursos",
                                estudiantes:estudiantes,
                                cursos:cursos
                            });
                        }
                    });
                }
            });
        }
    });
    
});

app.get("/eliminar",(req,res)=>{
    Curso.find({estado:"disponible"}).exec((err,cursos)=>{
        if(err){
            return console.log(err);
        }
        else{
            Estudiante.find({}).exec((erra,estudiantes)=>{ 
                if(erra){
                    return console.log(erra);
                }
                else{
                    res.render("eliminar",{
                        color:"dark",
                        saludo:"ELIMINAR ESTUDIANTE",
                        titulo:"Página de eliminación de estudiantes",
                        estudiantes:estudiantes,
                        cursos:cursos
                    });
                }
            });
        }
    });
});

app.post("/eliminar",(req,res)=>{
    Estudiante.findOneAndUpdate({documento:req.body.documento},{$pull:{cursos:req.body.curso}},{new : true, runValidators: true, context: 'query' },(erro,resultan)=>{
        if(erro){
            return console.log(erro);
        }
        else{
            Curso.find({estado:"disponible"}).exec((err,cursos)=>{
                if(err){
                    return console.log(err);
                }
                else{
                    Estudiante.find({}).exec((erra,estudiantes)=>{ 
                        if(erra){
                            return console.log(erra);
                        }
                        else{
                            res.render("eliminar",{
                                color:"dark",
                                saludo:"ELIMINAR ESTUDIANTE",
                                titulo:"Página de eliminación de estudiantes",
                                estudiantes:estudiantes,
                                cursos:cursos
                            });
                        }
                    });
                }
            });
        }
    })
});

app.post("/autenticacion",(req,res)=>{
    Usuario.findOne({nombre:req.body.Nombre},(err,re)=>{
        if(err){
            return res.render("autenticacion",{
                mensaje:"Esa vaina hizo un error",
                error:err
            });
        }
        console.log(re);
        if(!re){
            return res.render("autenticacion",{
                mensaje:"Usuario o contraseña incorrecta"
            });
        }
        if(bcrypt.compareSync(req.body.Contraseña,re.contraseña)){
            req.session.usuario=re;
            return res.redirect("/");
        }
        else{
            return res.render("autenticacion",{
                mensaje:"Usuario o contraseña incorrecta ",
            });
        }
    });
});

app.get("/salir",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return console.log(err);
        }
    });
    res.redirect("/");
});
mongoose.connect(process.env.URLDB, {useNewUrlParser: true,useFindAndModify: false,useCreateIndex: true},(err,result)=>{
	if(err){
		return console.log(err);
	}
	console.log("conectado");
});

app.listen(process.env.PORT,()=>{
    console.log("Escuchando por el puerto "+ process.env.PORT);
});