import multer from 'multer';

// Configure Multer to store files in memory as buffers
const storage = multer.memoryStorage();

// Set up Multer with the storage engine and file filter
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // A simple filter to accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});

export default upload;