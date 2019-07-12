const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EsquemaEstudiante = new Schema({
	nombre : {
		type : String,
		required : true	
	},
	documento :{
        type : Number,
        unique:true,
        min:0,
		required : true
	},
	correo : {
        type: String,
        required : true	
	},
	telefono : {
		type: Number,
        min: 0,	
        required : true		
	},
	cursos : [Number] 
});


const Estudiante = mongoose.model('estudiante', EsquemaEstudiante);

module.exports = Estudiante