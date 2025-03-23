// const multer = require('multer');
// const path  = require('path');

// //set storage engine
// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,'uploads/');
//     },
//     filename: (req,file,cb)=>{
//         cb(null, `${Date.now()}-${file.originalname}`);
//         },
// });

// //file type validation
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg','image/png','application/pdf'];
//     if(allowedTypes.includes(file.mimetype)){
//         cb(null, true);
//         }
//         else{
//             cb(new Error('Only JPEG, PNG, or PDF files are allowed'), false);
//         }
//       };
// //initializing multer
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//     fileFilter,
//   });
  
//   module.exports = upload;

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, or PDF files are allowed'), false);
    }
};

// Initializing multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter,
});

module.exports = upload;