/*
	A small command line interface to check the responsive website layouts that
	stores a series of snapshots in ./renders/timestamp-url/

	node app.js --help for usage information

	#TODO
	User agent sniffing?
	Well-defined list of resolutions & devices for testing
	Option to generate both cropped and non-cropped
	Pagenated output?
*/

// Process command line arguments
var program = require("commander");
program
	.version("1.0.0")
	.usage("node app.js --url www.google.com")
	.option("-u, --url <path>", "Url to render")
	.option("-c, --crop", "Crop the screenshots to the first page")
	.parse(process.argv);
if (!program.url) {
	console.log("A url is required for this script to run.")
	process.exit(0);
}

// Determine output directory
var slugifyUrl = require("slugify-url");
var sanitizedUrl = slugifyUrl(program.url);
var format = require('date-format');
var timestamp = format('dd.MM.yy-hh.mm.ss', new Date());
var filename = sanitizedUrl + "-" + timestamp;
var outputDirectory = require("path").join(__dirname, "renders", filename);

// Take screenshots of website
var Pageres = require("pageres");
var options = {
	delay: 2,
	crop: program.crop,
	filename: "<%= date %>-<%= size %>-<%= time %>-<%= crop %>",
	scale: 1,
	format: "png"
};
var pageres = new Pageres(options)
	.src(program.url, ["w3counter"])
	.dest(outputDirectory)
	.run()
	.then(function () {
		console.log("All done!")
	})
	.catch(function (e) {
		console.log(e);
	});