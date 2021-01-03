const multer = require('multer');
const path = require('path');

//This allows us to pick which kind of file types will be allowed.
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFIlter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
            cb(new Error ('Image file type is not supported must jpg, jpeg or png'),false);
                return;
        }
        cb(null,true)

    },
});