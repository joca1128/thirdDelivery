const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EsquemaUsuario=new Schema({
    identidad:{
        type:Number,
        required:true,
        unique:true,
        min:0
    },
    nombre:{
        type:String,
        required:true,
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
    tipo:{
        type:String,
        default:"aspirante"
    },
    contraseña : {
        type: String,
        required : true	
	}
});

const Usuario = mongoose.model('usuario', EsquemaUsuario);

module.exports = Usuario