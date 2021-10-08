function eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var red_count = 0;
var green_count = 0;

// accessing webpage
var page = document.querySelector('div.UI-Card.itemFlex.fxWrap');

// button
var button = document.createElement('button');
button.setAttribute('type', "button");
button.setAttribute('id', "magic_button");
button.innerText = "Magic";
page.appendChild(button);

var magic_button = document.getElementById("magic_button");
magic_button.addEventListener("click",function(e){
    demo();
},false);



async function demo() {
    // get items already in store
    var url = chrome.runtime.getURL("merge_from_ofoct.csv");
    var items;
    fetch(url)
    .then((response) => response.text()) //assuming file contains json
    .then((text) => 
    Papa.parse(text, {
        complete: function(results) {
            items = results.data;
        }
    }));

    profit_threshold = 10;
    competitor_threshold = 10;
    await sleep(2000);
    //var button = document.getElementById('button');
    var table = document.getElementById("datatable-responsive");
    for (var i = 0, row; row = table.rows[i]; i++) {
        var amazon_price = row.cells[7].innerText;
        var asin = row.cells[4].innerText;
        var item_in_store = false;
        //check items
        for (var j = 0; j < items.length; j++){
            if(items[j][0].includes(asin)){
                item_in_store = true;
                break;
            }
        }
        amazon_price = parseFloat(amazon_price.match(/[0-9.]+/g,''));
        amazon_price = amazon_price + 1

        var ebay_price = row.cells[8].innerText;
        ebay_price = parseFloat(ebay_price.match(/[0-9.]+/g,''));
        ebay_price = ebay_price * .8

        var profits = ((ebay_price / (amazon_price)) - 1) * 100;
        // console.log("ebay: " + String(ebay_price));
        // console.log("amazon: " + String(amazon_price)); 
        // console.log(row.cells[5].innerText + " profit: " + String(profits));
        var competitors = row.cells[11].innerText;
        competitors = parseInt(competitors.match(/[0-9]+/g,''));

        if (i !== 0){
            if (profits >= profit_threshold && competitors < competitor_threshold && !item_in_store){
                row.cells[0].style.background = "green";
                green_count += 1;
            } else {
                row.cells[0].style.background = "red";
                red_count += 1;
                checkbox = row.cells[0].children[0].children[0];
                eventFire(checkbox, 'click');
                if (profits < profit_threshold){
                    row.cells[9].style.background = "red";
                } 
                if (competitors > competitor_threshold) {
                    row.cells[11].style.background = "red";
                }
                if(item_in_store){
                    row.cells[4].style.background = "red";
                }
            }
        }
    }

    button.innerText = "Magic\n\n" + String(green_count) +" Green\n" + String(red_count) + " Red";
    green_count = 0;
    red_count = 0;
}






//demo();
