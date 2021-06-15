#!node
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const storage_config = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/uploads')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		let ext = file.mimetype.split('/')[1];
		console.log(ext);
		cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
	}
})

const upload = multer({ storage: storage_config });

const app = express()

//This is CORS-enabled for all origins!
// app.use(cors());
app.get('/single_route', cors(), function (req, res, next) {
	res.json({ msg: 'This is CORS-enabled for a Single Route' })
});

app.post('/profile', upload.single('avatar'), function (req, res, next) {
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any
	console.log(req.files);
	res.json({ msg: 'Upload Success.....' });
	// res.json({ msg: req.files });
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
	// req.files is array of `photos` files
	// req.body will contain the text fields, if there were any
})

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
	// req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
	//
	// e.g.
	//  req.files['avatar'][0] -> File
	//  req.files['gallery'] -> Array
	//
	// req.body will contain the text fields, if there were any
});

app.get('/', function (req, res, next) {
	// res.json({ msg: 'This is CORS-enabled for all origins!' });
	res.sendFile(__dirname + '/index.html')
});

app.listen(5000, function () {
	console.log('CORS-enabled web server listening on port 5000')
});