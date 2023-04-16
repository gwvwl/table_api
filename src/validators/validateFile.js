const validateFile = (req, res, next) => {
  const file = req.files.photo;

  const array_of_allowed_file_types = ["image/jpeg", "image/jpg"];

  if (!array_of_allowed_file_types.includes(file.mimetype)) {
    res.status(400).send({
      status: "error",
      message: "format image must be image/jpg, image/jpeg",
    });
    return;
  }

  next();
};

module.exports = validateFile;
