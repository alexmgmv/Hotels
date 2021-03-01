// calendar input validation
const calendar = document.querySelector("#checkIn");
function refreshPage(e) {
    location.reload();
}
calendar.addEventListener("input", refreshPage);
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
today = yyyy + '-' + mm + '-' + dd;
document.getElementById("checkIn").setAttribute("min", today);
let date = document.getElementById("checkIn").value;
document.getElementById("checkOut").setAttribute("min", date);

// price slider
const priceInput = document.querySelector(".slider");
const priceLabel = document.querySelector("#current_price");

priceInput.addEventListener("input", (e) => {
    priceLabel.innerText = "$" + e.currentTarget.value;
});

// get data from JSON file
fetch("data.json")
    .then(response => response.json())
    .then(data => {

        // display city suggestions in search bar 
        const city = document.getElementById("city");
        let city_output = "";
        let cities = [];
        for (let i = 0; i < data[1].entries.length; i++) {
            let temp = data[1].entries[i].city;
            if (!cities.includes(temp)) {
                cities[i] = temp;
                city_output += `<option value="${data[1].entries[i].city}"></option>\n`;
            }
        }
        city.innerHTML = city_output;

        // display available room types in dropdown menu 
        const room = document.getElementById("roomType");
        let room_output = `<option value="" disabled selected>Select Room Type</option>\n`;
        for (let i = 0; i < data[0].roomtypes.length; i++) {
            room_output += `<option value="${data[0].roomtypes[i].name}">${data[0].roomtypes[i].name}</option>\n`;
        }
        room.innerHTML = room_output;

        // display hotels
        const hotels = data[1].entries;
        function renderHotels(hotelObj) {
            const template = `
                <div class="row m-3" id="hotel">
                    <div class="col">
                        <img class="img-fluid" src="${hotelObj.thumbnail}">
                    </div>
                    <div class="col">
                        <br>
                        <h3>${hotelObj.hotelName}</h3> <br>
                        ${hotelObj.rating}&#9733; Hotel <br><br>
                        ${hotelObj.city} <br><br>
                        ${hotelObj.ratings.no} ${hotelObj.ratings.text}
                    </div>
                    <div class="col">
                    <br><br><br>
                        $ ${hotelObj.price} per night
                        <br><br><br><br>
                        <button type="button" class="btn btn-lg  btn-success">View Deal</button>
                    </div>
                </div> `;
            return (template);
        }

        // display hotels filtered by city searched
        let output = "";
        for (let i = 0; i < hotels.length; i++) {
            if (hotels[i].city === input) {
                output += renderHotels(hotels[i]);
            }
        }
        document.querySelector("#results").innerHTML = output;

        // display hotels filtered by city searched AND price input
        let priceFilter = 6090;
        let priceValue = document.getElementById("priceSlider");
        priceValue.onmouseup = function (event) {
            output = "";
            priceFilter = priceValue.value;
            for (let i = 0; i < hotels.length; i++) {
                if (hotels[i].city === input && hotels[i].price <= priceFilter) {
                    output += renderHotels(hotels[i]);
                }
            }
            document.querySelector("#results").innerHTML = output;
        }

        // display available sorting options in dropdown menu
        let allFilters = [];
        let sortingOutput = "`<option disabled selected>Our recommendations</option>`";
        for (let i = 0; i < hotels.length; i++) {
            let hotelFilters = hotels[i].filters;
            for (let i = 0; i < hotelFilters.length; i++)
                if (!allFilters.includes(hotelFilters[i].name)) {
                    allFilters.push(hotelFilters[i].name);
                    sortingOutput += `<option value="${hotelFilters[i].name}">${hotelFilters[i].name}</option>\n`;
                }
        }
        document.querySelector("#sortingOptions").innerHTML = sortingOutput;
    })

// get user's city input
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const input = urlParams.get('city');

