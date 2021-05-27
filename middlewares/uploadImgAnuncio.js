const multer = require('multer');

module.exports = (multer({
    storage: multer.diskStorage({ //onde a imagem será armazenada
        destination: (req, file, cb) => {
            cb(null, './public/upload/anuncios')
        },
        filename: (req, file, cb) => { //nome da imagem
            cb(null, Date.now().toString() + '_' + file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => { //filtrando formatos de img permitidos
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);
        if(extensaoImg) {
            return cb(null, true);
        }
        return cb(null, false) //extensao da imagem nao é valida
    }
}))