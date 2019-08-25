function showTime(){
    var offset = '+1';
    // create Date object for current location
    d = new Date();

    time = calculateTime(d);
    date = getTodayDate(d);
    document.getElementById("MyClockDisplay1").textContent = time;
    document.getElementById("date1").innerText = date;
    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    date = new Date(utc + (3600000*offset));
    time = calculateTime(date);
    date = getTodayDate(date);
    document.getElementById("MyClockDisplay2").textContent = time;
    document.getElementById("date2").innerText = date;
    
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

function getTodayDate(d){
    var today;
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    today = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + " " + days[d.getDay()];

return today;
}

function todayQuote(){
    response = httpGet('http://quotes.rest/qod.json');

    console.log(JSON.parse(response));
    quote = JSON.parse(response);
    document.getElementById("quote").innerHTML = quote.contents.quotes[0].quote +" - "+ quote.contents.quotes[0].author;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    //xmlHttp.responseType = 'json';
    xmlHttp.onload = function() {
      var status = xmlHttp.status;
      if (status === 200) {
        console.log(xmlHttp.response);
      } else {
        console.log(xmlHttp.response);
      }
    };
    xmlHttp.send();
    return xmlHttp.response;
}

todayQuote();
showTime();