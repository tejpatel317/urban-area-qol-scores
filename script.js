//Grab urban city data object from API. Object lists multiple cities
fetch("https://api.teleport.org/api/urban_areas/")
.then((resp) => resp.json())
.then((data => iterateThroughCitiesArray(data)))
