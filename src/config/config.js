process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/educacion';
}
else {
	urlDB = 'mongodb+srv://Jorge:udea90061957528@nodejsjorge-g2uif.mongodb.net/educacion?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB
