const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EsquemaCurso = new Schema({
	nombre : {
		type : String,
		trim:true,
		required : true	
	},
	id :{
		type : Number,
		unique:true,
		required : true
	},
	descripcion : {
        type: String,
        required : true	
	},
	valor : {
		type: Number,
        min: 0,	
        required : true		
	},
	modalidad : {
		type: String,					
    },
    intensidad :{
        type: Number,
        min: 0
    },
    estado:{
        type: String,
        default:"disponible"
    }
});


const Curso = mongoose.model('curso', EsquemaCurso);

module.exports = Curso