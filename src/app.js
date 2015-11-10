var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var pages = [ {
  name: "Speed Over Water (kts)",
  keys: ["navigation", "speedThroughWater"],
  conversion: 1.94384
}, {
  name: "Course Over Ground",
  keys: ["navigation", "courseOverGroundMagnetic"]
}, {
  name: "Speed Over Ground (kts)",
  keys: ["navigation", "speedOverGround"],
}, {
  name: "Heading (True)",
  keys: ["navigation", "headingTrue"]
}, {
  name: "Heading (Magnetic)",
  keys: ["navigation", "headingMagnetic"]
}, {
  name: "Apparent Wind Speed (kts)",
  keys: ["environment", "wind", "speedApparent"],
  conversion: 1.94384
}, {
  name: "Apparent Wind Angle",
  keys: ["environment", "wind", "angleApparent"]
}, {
  name: "Depth (feet)",
  keys: ["environment", "depth", "belowTransducer"],
  conversion: 3.28084
} ];
var current_page = 0;

var display = new UI.Window();

// Our display elements
var value = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text: 'Loading...',
  font: 'GOTHIC_28_BOLD',
  color: 'white',
  textOverflow: 'wrap',
  textAlign: 'center',
	backgroundColor: 'blue'
});

// Add to splashWindow and show
display.add(value);
display.show();

// Wire things up so we can change pages and refresh
display.on('click', function(e) {
  switch(e.button) {
    case "up":
      current_page -= 1;
      console.log("New Page: " + current_page);
      break;
    case "down":
      current_page += 1;
      console.log("New Page: " + current_page);
      break;
  }
});

function parseData(data, page_num) {
  console.log("Parsing for page #" + page_num);
  var page = pages[page_num];
  
  // Dig down to our key
  for(var i = 0; i < page.keys.length; i++) {
    data = data[page.keys[i]];
  }
  console.log("Value for " + page.name + ": " + data.value);
  
  var conversion = ("conversion" in page ? page.conversion : 1.0);
  return {
    name: page.name,
    value: Math.round(data.value * conversion * 100) / 100
  };
}

function refresh() {
  // Make request to openweathermap.org
  ajax({
      url:'http://demo.signalk.org/signalk/api/v1/vessels/self',
      type:'json'
    }, function(data) {
      console.log("Details: " + JSON.stringify(data));
      var details = parseData(data, current_page % pages.length);
      value.text(details.value); 
    }, function(error) {
      console.log("Download failed: " + error);
    }
  );
}

setInterval(refresh(), 1000);