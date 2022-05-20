//Grab urban city list data object from API. Object lists multiple cities
fetch("https://api.teleport.org/api/urban_areas/")
.then((resp) => resp.json())
.then((data => iterateThroughCitiesArray(data)))

//Iterate through the list of cities and store each city as an element in the for loop
//Access href in each city, and send fetch request for data of one city (for each city)
function iterateThroughCitiesArray(data) {
    for(const element of data['_links']['ua:item']){
        fetch(element.href)
        .then((resp) => resp.json())
        .then((data => iterateThroughCitiesData(data)))
    }
}

//Store city name, country name, and city data
//Access image href, and send fetch request for image data of city
function iterateThroughCitiesData(data) {
    let urbanCityMainData = data;
    let cityName = data.name;
    let cityCountryName = data['_links']['ua:countries'][0].name;
    fetch(data['_links']['ua:images'].href)
    .then((resp) => resp.json())
    .then((data => obtainCityImage(data, cityName, cityCountryName, urbanCityMainData)))
}

//Store city image link
//From city data passed as a parameter, access href for scores data, and send a fetch request for scores data
function obtainCityImage(data, cityName, cityCountryName, urbanCityMainData){
    let cityImage = data.photos[0].image.web
    fetch(urbanCityMainData['_links']['ua:scores'].href)
    .then((resp) => resp.json())
    .then((data => obtainCityScores(data, cityName, cityCountryName, cityImage)))
}

//Store city scores object and call createCard function
function obtainCityScores(data, cityName, cityCountryName, cityImage) {
    let arrayOfCityQOLData = data.categories
    createCard(cityName, cityCountryName, cityImage, arrayOfCityQOLData)
}
