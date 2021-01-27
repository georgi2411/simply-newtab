import TimeService from "./time.service.js";
import BackgroundService from "./background.service.js";

(function (){
    const elements = {
        backgroundImage: document.getElementById("background-image"),
        greet: document.getElementById("greet"),
        time: document.getElementById("time"),
        input: document.getElementById("search"),
        author: document.getElementById("author"),
        source: document.getElementById("source"),
        country: document.getElementById("country"),
    }

    elements.input.addEventListener("keyup", event => {
        if (event.key ===  "Enter") {
            event.preventDefault();
            chrome.search.query({ text: elements.input.value })
        }
    });

    const timeService = new TimeService(elements.time, elements.greet);
    timeService.bootstrap();

    const backgroundService = new BackgroundService(elements, timeService.getCurrentDate);
    backgroundService.bootstrap();

})()




