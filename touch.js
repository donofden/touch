/* Random Quotes */
const quotes = [
	{ 
		"quote" : "The only sin is ignorance", 
		"source" : "Christopher Marlowe" 
	},
	{
		"quote" : "A man is his own easiest dupe, for what he wishes to be true he generally believes to be true", 
		"source" : "Demosthenes"
	},
	{
		"quote" : "A lie can travel halfway around the world while the truth is putting on its shoes", 
		"source" : "Mark Twain"
	},
	{
		"quote" : "Great minds discuss ideas; average minds discuss events; small minds discuss people", 
		"source" : "Eleanor Roosevelt"
	},
	{
		"quote" : "If you have a garden and a library, you have everything you need", 
		"source" : "Marcus Tullius Cicero"
	},
	{
		"quote" : "Truth comes out in wine", 
		"source" : "Pliny the Elder"
	},
	{
		"quote" : "Everything in the universe is within you. Ask all from yourself", 
		"source" : "Rumi"
	},
	{
		"quote" : "When I get a little money I buy books; and if any is left I buy food and clothes", 
		"source" : "Desiderius Erasmus"
	}
]

function randomQuote() {
  let random = quotes[Math.floor(Math.random() * quotes.length)];
  quotation.innerText = `“${random.quote}.”`;
  source.innerText = random.source;
}

randomQuote();

//document.querySelector("button").addEventListener('click', randomQuote)
//# sourceURL=pen.js

/* Setting */
$('#toggle').click(function() {
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
		if(chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError);
			return false;
		}
		return true;
    });
}

function storeGet(key) {
	chrome.storage.sync.get(key,function(object){
		console.log(object[key]);
	});
}

/* Bookmarks */
bookmarkArray = {};
var parentID;

function getBookmarks() {
	chrome.bookmarks.getTree(function(itemTree){
		itemTree.forEach(function(item){
			processNode(item);
		});
	})
}

function processNode(node, parent) {
    // recursively process child nodes
    if(node.children) {
        node.children.forEach(function(child) {
			processNode(child);
		});
	}
	if(node.parentId == "1"){
		parentID = node.id;

		if(node.children){
			bookmarkArray[node.id] = {
				title: node.title,
				children: node.children
			};
		}
	}

    // print leaf nodes URLs to console
    if(node.url) {
		//console.log("Title: "+ node.title+" URL:"+ node.url);
	}
}

// Get Bookmarks stored in Chrome
getBookmarks();

// This time out is to overcome "value below was evaluated just now" this error
setTimeout(function() {
	updateMenu();
}, 1000);

function updateMenu(){
	$.each(bookmarkArray, function( key, value ) {
		var childMenu;
		if(value.children){
			// Level ONE
			childMenu = '<li><a href="#">'+value.title+'</a><ul>';
			$.each(value.children, function( ckey, cvalue ) {
				if(cvalue.children){
					// Level TWO
					childMenu += '<li><a href="#">'+cvalue.title+'</a><ul>';
					$.each(cvalue.children, function( sckey, scvalue ) {
						// Level THREE
						if(scvalue.children){
							// This is to overcome the Undefined issue for parent URL
							if (scvalue.url == null){
								childMenu += '<li><a href="#">'+scvalue.title+'</a><ul>';
							} else{
								childMenu += '<li><a href="'+scvalue.url+'">'+scvalue.title+'</a><ul>';
							}
						
							$.each(scvalue.children, function( ssckey, sscvalue ) {
								// Level FOUR
								childMenu += '<li><a href="'+sscvalue.url+'">'+sscvalue.title+'</a><li>';
							});
							childMenu += '</ul>';
						} else {
							// This is to overcome the Undefined issue for parent URL
							if (scvalue.url == null){
								childMenu += '<li><a href="#">'+scvalue.title+'</a></li>';
							} else{
								childMenu += '<li><a href="'+scvalue.url+'">'+scvalue.title+'</a></li>';
							}
						}
						childMenu += '</li>';
					});
					childMenu += '</ul>';
				} else {
					childMenu += '<li><a href="'+cvalue.url+'">'+cvalue.title+'</a>';
				}
				childMenu += '</li>';
			});

			childMenu += '</ul></li>';
			$(".ul-menu").append(childMenu);
		} else {
			$(".ul-menu").append('<li><a href="#">'+value.title+'</a></li>');
		}
	});
}


function showTime(){
    var offset = '+1';
    // create Date object for current location
    d = new Date();

    time = calculateTime(d);
	date = getTodayDate(d);
	weekDay = getWeekDay(d);
    document.getElementById("wi-one-clock").textContent =  weekDay + ' - '+  time;
    document.getElementById("wi-one-date").innerText = date;
    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    date = new Date(utc + (3600000*offset));
	time = calculateTime(date);
	weekDay = getWeekDay(date);
	date = getTodayDate(date);
    document.getElementById("wi-two-clock").textContent =  weekDay + ' - '+  time;
    document.getElementById("wi-two-date").innerText = date;
    
    setTimeout(showTime, 1000);
}

function calculateTime(date){
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    return time;
}

function getWeekDay(d){
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[d.getDay()];
}

function getTodayDate(d){
    var today;
    today = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear(); // + " " + days[d.getDay()]

return today;
}

showTime();

function widgetRemainingWeekDay(){
	var offset = '+1';
	var el;
	var nextdays = 3;
	var dateToManuplate;
    // create Date object for current location
	d = new Date();

	for (i = 1; i <= nextdays; i++) {
		dateToManuplate = new Date(d.getTime()+(i*24*60*60*1000))
		el = "wi-one-day"+i;
		document.getElementById(el).textContent = getWeekDay(dateToManuplate);
	}
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
	date = new Date(utc + (3600000*offset));
	for (i = 1; i <= nextdays; i++) {
		dateToManuplate = new Date(date.getTime()+(i*24*60*60*1000))
		el = "wi-two-day"+i;
		document.getElementById(el).textContent = getWeekDay(dateToManuplate);
	}
}
widgetRemainingWeekDay();