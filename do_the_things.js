function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_dem_stonks() {
    // Maybe a better way to do this but ultimately we just need the page to fully load before running the script
    await sleep(3000);

    var rows = document.querySelectorAll('a.row__StyledGridTableRow-ncfewc-0.duTlLi');
    var stonks = []

    // get and store dem stonks into an array
    rows.forEach(function (item, index) {
        var stock = item.children[0].children[0].children[1].children[0].children[0].children[0].textContent;
        var amount = item.children[1].children[0].textContent
        var price = item.children[2].children[0].textContent
        price = price.substring(1);
        stonks.push([stock, amount, price])
    });

    // *** Start the CSV stuffs ***

    // define the heading for each row of the data  
    var csv = 'ticker,shares,avg_price\n';

    // merge the data with CSV  
    stonks.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });

    // accessing webpage
    var page = document.querySelector('div.sc-bdnylx.bSnEsS');

    // add download button to the page
    var button = document.createElement('button');
    button.setAttribute('type', "button");
    button.setAttribute('id', "magic_button");
    button.innerText = "Download CSV";
    page.appendChild(button);

    // add listener
    var magic_button = document.getElementById("magic_button");
    magic_button.addEventListener("click", function (e) {
        download_csv(csv);
    }, false);

}

function download_csv(csv) {
    // ** Kinda hacky, but it works **
    // stuff needed to download csv
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';

    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'M1_Stonks.csv';
    hiddenElement.click();
}

get_dem_stonks();