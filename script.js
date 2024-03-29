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

//Creates card for each city
//mouseover and mouseleave event added on cardImageDiv/InvisibleBlock
//click event added on pinButton, callback pinCard()
function createCard(cityName, cityCountryName, cityImage, arrayOfCityQOLData) {
   
    let cityCard = document.createElement("div")
    cityCard.className = "citycard"
    cityCard.setAttribute("id", cityName)
    
    let cardImageDiv = document.createElement("div")
    cardImageDiv.className = "cardimage"
    cityCard.appendChild(cardImageDiv)
    
    let cardImage = document.createElement("img")
    cardImage.setAttribute("src", cityImage)
    cardImageDiv.appendChild(cardImage)

    let invisibleBlock = document.createElement("div")
    invisibleBlock.className = "invisibleblock"
    cityCard.appendChild(invisibleBlock)

    for (let i = 0; i<arrayOfCityQOLData.length-1; i+=2) {
        let dataLine = document.createElement("div")
        dataLine.className = "dataline"
        invisibleBlock.appendChild(dataLine)
            
        let leftLine = document.createElement("div")
        leftLine.className = "leftline"
        dataLine.appendChild(leftLine)

        let leftLineParagraph = document.createElement("p")
        leftLineParagraph.setAttribute("id", `${cityName} ${arrayOfCityQOLData[i].name}`)
        leftLineParagraph.textContent = `${arrayOfCityQOLData[i].name}, ${arrayOfCityQOLData[i].score_out_of_10.toFixed(1)}`
        leftLine.appendChild(leftLineParagraph)
        let percentLeft = arrayOfCityQOLData[i].score_out_of_10.toFixed(1)*10
        leftLineParagraph.style.background = `linear-gradient(to right, ${arrayOfCityQOLData[i].color} ${percentLeft}%, grey 1%, grey ${100-percentLeft-1}%)`
        
        let rightLine = document.createElement("div")
        rightLine.className = "rightline"
        dataLine.appendChild(rightLine)

        let rightLineParagraph = document.createElement("p")
        rightLineParagraph.setAttribute("id", `${cityName} ${arrayOfCityQOLData[i+1].name}`)
        rightLineParagraph.textContent = `${arrayOfCityQOLData[i+1].name}, ${arrayOfCityQOLData[i+1].score_out_of_10.toFixed(1)}`
        rightLine.appendChild(rightLineParagraph)
        let percentRight = arrayOfCityQOLData[i+1].score_out_of_10.toFixed(1)*10
        rightLineParagraph.style.background = `linear-gradient(to right, ${arrayOfCityQOLData[i+1].color} ${percentRight}%, grey 1%, grey ${100-percentRight-1}%)`
    }

    let cardHolder = document.createElement("div")
    cardHolder.className = "cardholder"
    cityCard.appendChild(cardHolder)

    let cardText = document.createElement("div")
    cardText.className = "cardtext"
    cardHolder.appendChild(cardText)

    let cardCityName = document.createElement("h2")
    cardCityName.className = "cityname"
    cardCityName.textContent = cityName;
    cardText.appendChild(cardCityName)

    let cardCountryName = document.createElement("h3")
    cardCountryName.className = "countyname"
    cardCountryName.textContent = cityCountryName;
    cardText.appendChild(cardCountryName)

    let cardButton = document.createElement("div")
    cardButton.className = "cardbutton"
    cardHolder.appendChild(cardButton)

    let pinButton = document.createElement("button")
    pinButton.type = "button"
    pinButton.textContent = "Pin";
    pinButton.setAttribute("id", `${cityName} Pin`)
    cardButton.appendChild(pinButton)

    cardImageDiv.addEventListener("mouseover", (e) => {
        e.target.style.display = "none"
        invisibleBlock.style.display = "block"
    })

    invisibleBlock.addEventListener("mouseleave", (e) => {
        e.target.style.display = "none"
        cardImage.style.display = "block"
    })

    pinButton.addEventListener("click", pinCard)

    document.getElementById("citycards").appendChild(cityCard);
}

//When a node is cloned, all of its IDs are also cloned. 
//To avoid two different occasions of the same ID, each ID in the cloned node is changed.
//Click event added to Remove button, removeCard called
//Sets the invisibleblock to display when a card is pinned
function pinCard(e) {
    let pinButtonID = e.target.id.split(" ")
    if (pinButtonID.length > 1) {
        pinButtonID.pop()
    }
    let cityName = pinButtonID.join(" ")
    let cityCard = (document.getElementById(cityName))

    let clonedNode = cityCard.cloneNode(true)
    clonedNode.setAttribute("id", `cloned${cityName}`)

    let clonedNodeButton = clonedNode.querySelector("button")
    clonedNodeButton.setAttribute("id", `cloned${cityName} Pin`)
    clonedNodeButton.textContent = "Remove"
    clonedNodeButton.addEventListener("click", removeCard)
    
    let cardImageDiv = clonedNode.querySelector("div")
    cardImageDiv.style.display = "none"
    
    let invisibleBlock = clonedNode.querySelector("div.invisibleblock")
    invisibleBlock.style.display = "block"
    let dataElements = invisibleBlock.querySelectorAll("p")
    for (let i =0; i<dataElements.length; i++) {
        let clonedDataID = "cloned" + dataElements[i].id
        dataElements[i].setAttribute("id", `${clonedDataID}`)
    }

    document.getElementById("pinneditems").appendChild(clonedNode)
}


//Removes pinned card
function removeCard(e) {
    let clonedPinButtonID = e.target.id.split(" ")
    if (clonedPinButtonID.length > 1) {
        clonedPinButtonID.pop()
    }
    let clonedCityName = clonedPinButtonID.join(" ")
    document.getElementById(clonedCityName).remove()
}

//Adds submit event on form, calls filter Library, and sortPinnedItems
document.querySelector("form").addEventListener("submit" , (e)=> {
    e.preventDefault();
    
    let searchInput = e.target.entercity.value
    filterLibrary(searchInput)

    let scoreCategoryInput = e.target.scorecategory.value
    let sortByInput = e.target.sortby.value
    sortPinnedItems(scoreCategoryInput, sortByInput)
})

//Uses filter method to find cards which match user search input
//Sets all cards to display none
//Sets cards which match user search input to display on DOM as inline-block
function filterLibrary(searchInput) {
    let lowerCaseSearchInput = searchInput.toLowerCase()
    let cardList = Array.from(document.getElementById("citycards").childNodes)
    let searchList = cardList.filter((card) => {
        let index = false;
        let length = lowerCaseSearchInput.length
        let cityNameInLowerCase = card.id.toLowerCase()
        if ((cityNameInLowerCase.substring(0,length)) === (lowerCaseSearchInput.substring(0, length))){
            index = true;
        }
        return index
    })
    
    for (const card in cardList) {
        cardList[card].style.display = "none"
    }

    for (const card in searchList) {
        searchList[card].style.display = "inline-block"
    }
}

//Obtains pinned items and uses sort method to sort based on user input
//Sorted list appended to pinneditems
function sortPinnedItems(scoreCategoryInput, sortByInput) {
    let pinnedList = Array.from(document.getElementById("pinneditems").childNodes)
    pinnedList.shift();

    if (sortByInput === "lowtohigh") {
        pinnedList.sort((a,b)=>{
            let idForDataA = `${a.id} ${scoreCategoryInput}`
            let idForDataB = `${b.id} ${scoreCategoryInput}`
            let dataA = parseFloat(document.getElementById(idForDataA).textContent.split(" ").slice("-1")[0])
            let dataB = parseFloat(document.getElementById(idForDataB).textContent.split(" ").slice("-1")[0])
            
            return dataA-dataB
        })
     
        for (const clonedCard of pinnedList) {
            document.getElementById("pinneditems").appendChild(clonedCard)
        }
    }

    else if (sortByInput === "hightolow") {
        pinnedList.sort((a,b)=>{
            let idForDataA = `${a.id} ${scoreCategoryInput}`
            let idForDataB = `${b.id} ${scoreCategoryInput}`
            let dataA = parseFloat(document.getElementById(idForDataA).textContent.split(" ").slice("-1")[0])
            let dataB = parseFloat(document.getElementById(idForDataB).textContent.split(" ").slice("-1")[0])
            
            return dataB-dataA
        })

        for (const clonedCard of pinnedList) {
            document.getElementById("pinneditems").appendChild(clonedCard)
        }
    }
}