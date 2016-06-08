// -- SETTINGS FOR RENDERING ---------------------------------------------------

// Resolution settings, pulled from:
//  https://www.w3counter.com/globalstats.php
//  http://viewportsizes.com/
// These will appear in the filename.
var resolutions = [
    { resolution: "1920x1080", name: "hd-laptop" },
    { resolution: "1366x768", name: "middle-laptop" },
    { resolution: "1280x800", name: "small-laptop" },
    { resolution: "768x1024", name: "ipad" },
    { resolution: "600x960", name: "nexus-7" },
    { resolution: "414x736", name: "iphone-6-plus" },
    { resolution: "375x667", name: "iphone-6" },
    { resolution: "360x640", name: "galaxy-s4" },
    { resolution: "320x480",  name: "iphone-4" },
];

// Base URL for all the pages to be rendered
var baseUrl = "http://codeabodechicago.github.io/CodeAbode-Website/";

// Array of the individual pages to render
var pages = [
    "index.html", 
    "curriculum.html",
    "schedule.html", 
    "apply.html", 
    "about.html"
];

// -- RENDERING ----------------------------------------------------------------

var slugifyUrl = require("slugify-url");
var format = require('date-format');
var Pageres = require("pageres");

// Determine output directory
var timestamp = format('dd.MM.yy-hh.mm.ss', new Date());
var filename = slugifyUrl(baseUrl) + "-" + timestamp;
var outputDirectory = require("path").join(__dirname, "renders", filename);

// Configure default options for pageres
var pageres = new Pageres({
    delay: 1,
    scale: 1,
    format: "png"
});

// Loop through the desired pages and add them to the input stream
for (var i = 0; i < pages.length; i += 1) {
    var url = baseUrl + pages[i];
    var slugifiedPage = slugifyUrl(pages[i]);

    for (var j = 0; j < resolutions.length; j += 1) {
        var resolution = resolutions[j].resolution;
        var name = resolutions[j].name;

        // Full screenshot
        pageres.src(url, [resolution], {
            crop: false,
            filename: slugifiedPage + "_full_<%= size %>_" + name
        });

        // Screenshot cropped to single screen
        pageres.src(url, [resolution], {
            crop: true,
            filename: slugifiedPage + "_cropped_<%= size %>_" + name 
        });
    }
}

// Capture the screenshots
pageres.dest(outputDirectory)
    .run()
    .then(function () {
        console.log("All done!")
    })
    .catch(function (e) {
        console.log(e);
    });

