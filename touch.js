/* Random Quotes */
const quotes = [{
	"quote": "The only sin is ignorance",
	"source": "Christopher Marlowe"
}, {
	"quote": "A man is his own easiest dupe, for what he wishes to be true he generally believes to be true",
	"source": "Demosthenes"
}, {
	"quote": "A lie can travel halfway around the world while the truth is putting on its shoes",
	"source": "Mark Twain"
}, {
	"quote": "Great minds discuss ideas; average minds discuss events; small minds discuss people",
	"source": "Eleanor Roosevelt"
}, {
	"quote": "If you have a garden and a library, you have everything you need",
	"source": "Marcus Tullius Cicero"
}, {
	"quote": "Truth comes out in wine",
	"source": "Pliny the Elder"
}, {
	"quote": "Everything in the universe is within you. Ask all from yourself",
	"source": "Rumi"
}, {
	"quote": "When I get a little money I buy books; and if any is left I buy food and clothes",
	"source": "Desiderius Erasmus"
}, {
	"quote": "Fear is a reaction. Courage is a decision.",
	"source": "Winston S. Churchill"
}, {
	"quote": "Give a Man a Fish, and You Feed Him for a Day. Teach a Man To Fish, and You Feed Him for a Lifetime.",
	"source": "-"
}, {
	"quote": "Every next level of your life will demand a different you.",
	"source": "-"
}, {
	"quote": "Be not afraid of growing slowly, be afraid only of standing still.",
	"source": "Chinese Proverb"
}, {
	"quote": "Its going to be heard, but hard dosent not mean impossible.",
	"source": "-"
}, {
	"quote": "Rise above the Strom and you will find the sunshine.",
	"source": "-"
}]

function randomQuote() {
	let random = quotes[Math.floor(Math.random() * quotes.length)];
	quotation.innerText = `“${random.quote}.”`;
	source.innerText = random.source;
}
/* Setting */
$('#toggle').click(function () {
	$(this).toggleClass('active');
	$('#overlay').toggleClass('open');
});
/* Chrome Storage */
function storeSet(key) {
	var testPrefs = JSON.stringify({
		'val': 10
	});
	var jsonfile = {};
	jsonfile[key] = testPrefs;
	chrome.storage.sync.set(jsonfile, function () {
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError);
			return false;
		}
		return true;
	});
}

function storeGet(key) {
	chrome.storage.sync.get(key, function (object) {
		console.log(object[key]);
	});
}
/* Bookmarks */
bookmarkArray = {};
var parentID;

function getBookmarks() {
	chrome.bookmarks.getTree(function (itemTree) {
		itemTree.forEach(function (item) {
			processNode(item);
		});
	})
}

function processNode(node, parent) {
	// recursively process child nodes
	if (node.children) {
		node.children.forEach(function (child) {
			processNode(child);
		});
	}
	if (node.parentId == "1") {
		parentID = node.id;
		if (node.children) {
			bookmarkArray[node.id] = {
				title: node.title,
				children: node.children
			};
		}
	}
	// print leaf nodes URLs to console
	if (node.url) {
		//console.log("Title: "+ node.title+" URL:"+ node.url);
	}
}
/* BookMark Menu */
function updateMenu() {
	$.each(bookmarkArray, function (key, value) {
		var childMenu;
		if (value.children) {
			// Level ONE
			childMenu = '<li><a href="#">' + value.title + '</a><ul>';
			$.each(value.children, function (ckey, cvalue) {
				if (cvalue.children) {
					// Level TWO
					childMenu += '<li><a href="#">' + cvalue.title + '</a><ul>';
					$.each(cvalue.children, function (sckey, scvalue) {
						// Level THREE
						if (scvalue.children) {
							// This is to overcome the Undefined issue for parent URL
							if (scvalue.url == null) {
								childMenu += '<li><a href="#">' + scvalue.title + '</a><ul>';
							} else {
								childMenu += '<li><a href="' + scvalue.url + '">' + scvalue.title + '</a><ul>';
							}
							$.each(scvalue.children, function (ssckey, sscvalue) {
								// Level FOUR
								childMenu += '<li><a href="' + sscvalue.url + '">' + sscvalue.title + '</a><li>';
							});
							childMenu += '</ul>';
						} else {
							// This is to overcome the Undefined issue for parent URL
							if (scvalue.url == null) {
								childMenu += '<li><a href="#">' + scvalue.title + '</a></li>';
							} else {
								childMenu += '<li><a href="' + scvalue.url + '">' + scvalue.title + '</a></li>';
							}
						}
						childMenu += '</li>';
					});
					childMenu += '</ul>';
				} else {
					childMenu += '<li><a href="' + cvalue.url + '">' + cvalue.title + '</a>';
				}
				childMenu += '</li>';
			});
			childMenu += '</ul></li>';
			$(".ul-menu").append(childMenu);
		} else {
			$(".ul-menu").append('<li><a href="#">' + value.title + '</a></li>');
		}
	});
}

function showTime() {
	var offset = '+1';
	// create Date object for current location
	d = new Date();
	time = calculateTime(d);
	date = getTodayDate(d);
	weekDay = getWeekDay(d);
	document.getElementById("wi-1-clock").textContent = weekDay + ' - ' + time;
	document.getElementById("wi-1-date").innerText = date;
	// convert to msec
	// add local time zone offset 
	// get UTC time in msec
	utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	// create new Date object for different city
	// using supplied offset
	date = new Date(utc + (3600000 * offset));
	time = calculateTime(date);
	weekDay = getWeekDay(date);
	date = getTodayDate(date);
	document.getElementById("wi-2-clock").textContent = weekDay + ' - ' + time;
	document.getElementById("wi-2-date").innerText = date;
	document.getElementById("wi-3-clock").textContent = weekDay + ' - ' + time;
	document.getElementById("wi-3-date").innerText = date;
	setTimeout(showTime, 1000);
}

function calculateTime(date) {
	var h = date.getHours(); // 0 - 23
	var m = date.getMinutes(); // 0 - 59
	var s = date.getSeconds(); // 0 - 59
	var session = "AM";
	if (h == 0) {
		h = 12;
	}
	if (h > 12) {
		h = h - 12;
		session = "PM";
	}
	h = (h < 10) ? "0" + h : h;
	m = (m < 10) ? "0" + m : m;
	s = (s < 10) ? "0" + s : s;
	var time = h + ":" + m + ":" + s + " " + session;
	return time;
}

function getWeekDay(d) {
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[d.getDay()];
}

function getTodayDate(d) {
	var today;
	today = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear(); // + " " + days[d.getDay()]
	return today;
}

function widgetRemainingWeekDay(widgetCity) {
	widgetCity.forEach(function (city) {
		var offset = city.offset;
		var el;
		var nextdays = 3;
		var dateToManuplate;
		// create Date object for current location
		d = new Date();
		if(offset != "0"){
			// convert to msec
			// add local time zone offset
			// get UTC time in msec
			utc = d.getTime() + (d.getTimezoneOffset() * 60000);
			// create new Date object for different city
			// using supplied offset
			d = new Date(utc + (3600000 * offset));
		}
		for (i = 1; i <= nextdays; i++) {
			dateToManuplate = new Date(d.getTime() + (i * 24 * 60 * 60 * 1000))
			el = "wi-"+city.id+"-day" + i;
			document.getElementById(el).textContent = getWeekDay(dateToManuplate);
		}
	});
}

/* Weather Wedget */
function getIconBasedOnTime(city, offset){
	// Find Day/Night for icon
	var d = new Date();
	if((city == "Sheffield")||(city == "London")){
		utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		// create new Date object for different city
		// using supplied offset
		d = new Date(utc + (3600000 * offset));
	}
	var hour = d.getHours();
	if (hour > 6 && hour < 20) {
		//Day time
		return "day"
	} else {
		//Night time
		return "night"
	}
}

/* Weather Wedget */
function getWeatherDetails(widgetCity){
	widgetCity.forEach(function (city) {
		var temperature, weather, wind;
		var url = "https://api.openweathermap.org/data/2.5/weather?q="+city.city+','+city.country+"&appid=a32cb81a7b917d2081ba0f8f11a6c48f&units=metric";
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": url,
			"method": "GET",
			"headers": {
				"cache-control": "no-cache",
				"Postman-Token": "298462b4-5efe-4f48-943a-8df91488ffdb"
			}
		}
		$.ajax(settings).done(function (response) {
			$.each(response, function (ckey, cvalue) {
				if(ckey == "main"){
					temperature = cvalue.temp;
				}
				if(ckey == "weather"){
					weather = cvalue[0].id;
				}
				if(ckey == "wind"){
					// Meter/Sec to KM/Hour - multiply the speed value by 3.6
					wind = cvalue.speed*3.6;
				}
			});
			icon = getIconBasedOnTime(city.city, city.offset);
			$("#wi-"+city.id+"-weather-icon").removeClass();
			$("#wi-"+city.id+"-weather-icon").addClass("wi wi-owm-"+icon+"-"+weather+" wi-widget-big");
			document.getElementById("wi-"+city.id+"-weather-city").innerHTML = '<span>City:</span>'+ city.city;
			document.getElementById("wi-"+city.id+"-weather-temperature").textContent = Math.round(temperature);
			document.getElementById("wi-"+city.id+"-weather-wind").textContent = Math.round(wind);
		});
	});
}

/* Random Quotes */
randomQuote();
//document.querySelector("button").addEventListener('click', randomQuote)
//# sourceURL=pen.js
// Get Bookmarks stored in Chrome
getBookmarks();
// This time out is to overcome "value below was evaluated just now" this error
setTimeout(function () {
	updateMenu();
}, 1000);
/* Show time in Widget */
showTime();

var widgetCity = [
    { id: '1', city: 'Chennai', country:'IN', offset: "0" },
	{ id: '2', city: 'London', country:'UK', offset: "+1" },
	{ id: '3', city: 'Sheffield', country:'UK', offset: "+1" },
];

/* Update upcoming days in widget */
widgetRemainingWeekDay(widgetCity);

/* Weather Wedget */
getWeatherDetails(widgetCity);

var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://api.openweathermap.org/data/2.5/forecast?q=chennai,in&appid=a32cb81a7b917d2081ba0f8f11a6c48f&units=metric&cnt=24",
	"method": "GET",
	"headers": {
		"cache-control": "no-cache",
		"Postman-Token": "a991d841-e759-42af-8d9e-b2b5d5728a77"
	}
}
var weatherArray = [];
var d = new Date();
today = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
$.ajax(settings).done(function (response) {
	console.log(response.list);
	response.list.forEach(function (days) {
		date = days.dt_txt.substring(0,10);
		console.log(today,date);
		if(today != date){
			weatherArray[date] = days.weather[0].id;
		}
		//weatherArray.push([date,days.weather[0].id]);
	});
	console.log(weatherArray);
});