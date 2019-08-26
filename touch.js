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

$('#toggle').click(function() {
   $(this).toggleClass('active');
   $('#overlay').toggleClass('open');
  });

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

bookmarkArray = {};
arraykey = []

data = { "programs": [ { "name":"zonealarm", "price":"500" }, { "name":"kaspersky", "price":"200" } ], "programs1": [ { "name":"zonealarm", "price":"500" }, { "name":"kaspersky", "price":"200" } ]  };
var parentID;

function getBookmarks() {
	//var bookmarkArray = {};
	chrome.bookmarks.getTree(function(itemTree){
		//console.log(itemTree);
		itemTree.forEach(function(item){
			//console.log(item);
			processNode(item);
		});
	})
	//console.log(bookmarkArray);
	//updateMenu()
}

function processNode(node, parent) {
    // recursively process child nodes
    if(node.children) {
		
		//console.log(node.title);
		//console.log(node.children);
		//console.log(node.children.length);
		
        node.children.forEach(function(child) {
			processNode(child);
		});
	}
	if(node.parentId == "1"){
		parentID = node.id;
		//bookmarkArray[node.id] = node.title;
		//console.log(node);
		if(node.children){
			bookmarkArray[node.id] = {
				title: node.title,
				children: node.children
			};
			//bookmarkArray[node.id]["title"] = node.title;
			//bookmarkArray[node.id]['value'] = node.children;
			//console.log(node);
		}
	}

    // print leaf nodes URLs to console
    if(node.url) {
		//console.log("Title: "+ node.title+" URL:"+ node.url);
	}
}

getBookmarks();
// This time out is to overcome "value below was evaluated just now" this error
setTimeout(function() {
	updateMenu();
}, 1000);

function updateMenu(){
	$.each(bookmarkArray, function( key, value ) {
		var childMenu;

		if(value.children){
			// Level One
			childMenu = '<li><a href="#">'+value.title+'</a><ul>';
			$.each(value.children, function( ckey, cvalue ) {
				if(cvalue.children){// Level Two
					childMenu += '<li><a href="#">'+cvalue.title+'</a><ul>';

					$.each(cvalue.children, function( sckey, scvalue ) {
						// Level Three
						childMenu += '<li><a href="'+scvalue.url+'">'+scvalue.title+'</a></li>';
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