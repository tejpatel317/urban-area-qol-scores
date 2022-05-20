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