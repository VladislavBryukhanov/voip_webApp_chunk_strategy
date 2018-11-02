const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/stream', upload.any(), (request, response) => {
    console.log(request.body);
    console.log(request.data);
    console.log(request.files);
    response.send(request.files[0]);
});

module.exports = router;
