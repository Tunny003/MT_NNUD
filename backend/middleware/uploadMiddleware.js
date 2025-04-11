const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})


const fileFilter = (req, file, cb) => {
  const fileTypes = /jpg|jpeg|png/
  const ext = path.extname(file.originalname).toLowerCase()
  if (fileTypes.test(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Images only!'), false)
  }
}

const upload = multer({ storage, fileFilter })

module.exports = upload
