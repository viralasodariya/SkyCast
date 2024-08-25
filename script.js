let usertab = document.querySelector('[data-userweather]')
let searchtab = document.querySelector('[data-searchweather]')

let usercontainer=document.querySelector(".weather-container")
let grantaccesscontainer=document.querySelector(".grant-location-container")

let searchform = document.querySelector("[data-searchform]")
let loadingscreen=document.querySelector(".loading-container")

let userinfocontainer = document.querySelector(".user-info-container")
 

// initial variable
let currentTab = usertab;
const api_key = "d1845658f92b31c64bd94f06f7188c9c"
currentTab.classList.add("current-tab");
// currentTab.classList.add("active")
grantaccesscontainer.classList.add("active")


function switchtab(clicktab) {
    
    //checked tab is qual to current tab
    if (clicktab != currentTab) {
        currentTab.classList.remove("current-tab")
        currentTab = clicktab
        currentTab.classList.add("current-tab")

        if (!searchform.classList.contains("active")) {
            userinfocontainer.classList.remove("active")
            grantaccesscontainer.classList.remove("active")
            searchform.classList.add("active")

        }
        else {
            // main pahele search tab pe tha ab your weather tab visible karna h
            searchform.classList.remove("active")
            userinfocontainer.classList.remove("active")
            // grantaccesscontainer.classList.add("active")
            // ab main your weather mai aa gaya hu to your weather visble karna pade ga
            getfromSessionStorage();
        }
    }
   
}


usertab.addEventListener("click", () => {
    switchtab(usertab)
})

searchtab.addEventListener("click", () => {
    switchtab(searchtab)
})


function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    // agar location coordinates nahi mile 
    if (!localCoordinates) {
        grantaccesscontainer.classList.add("active")
    }
    else {
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates) {
    let { lat , lon } = coordinates;
    // make grantaccesscontainer invisible
    grantaccesscontainer.classList.remove("active")
    // make loader visible 
    loadingscreen.classList.add("active")

    //api call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        )
        const data = await response.json()
        console.log(data)
        loadingscreen.classList.remove("active")
        userinfocontainer.classList.add("active")
        renderWeatherInfo(data)
        
    }
    catch (e) {
        loadingscreen.classList.remove("active")
        console.log(e)
    }
}

function renderWeatherInfo(data) {
    // first we have fetch element
    const cityname=document.querySelector("[data-cityname]")
    const cityicon = document.querySelector("[data-countryicon]")
    const weatherdes = document.querySelector("[data-weatherdesc]")
    const weathericon = document.querySelector("[data-weathericon]")
    const tempreture = document.querySelector("[data-temprature]")
    const windspeed=document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const clouds = document.querySelector("[data-clouds]")
    
    cityname.innerText = data?.name;
    cityicon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    weatherdes.innerText = data?.weather?.[0]?.description;
    weathericon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    tempreture.innerText = `${data?.main?.temp}°C`;
    windspeed.innerText = `${ data?.wind?.speed } m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    clouds.innerText=`${data?.clouds?.all}%`
}

const grantaccessbutton = document.querySelector("[data-grantaccess]")
grantaccessbutton.addEventListener("click", getlocation)

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition)
    }
    else {
        alert("no geolocation available")
    }
}


function showposition(postion) {
    const userCoordinate = {
        lat: postion.coords.latitude,
        lon:postion.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinate));
    console.log("add geolocation success");
    // session strore ho gaya ab kya kre to
    //ab hum fetchUserWeatherInfo ko call kre ge
    fetchUserWeatherInfo(userCoordinate)
}



// search country name and api call
const searchinput = document.querySelector("[data-searchinput]")

searchform.addEventListener("submit", (e) => {
    e.preventDefault()
    let cityname = searchinput.value
    if (cityname == "") return
    else
        fetchsearchWeatherInfo(cityname)
})

async function fetchsearchWeatherInfo(cityname) {
    loadingscreen.classList.add("active")
    userinfocontainer.classList.remove("active")
    grantaccesscontainer.classList.remove("active")
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${api_key}`
        )
        const citydata = await response.json()
        loadingscreen.classList.remove("active")
        userinfocontainer.classList.add("active")
        renderWeatherInfo(citydata)

    }
    catch(e) {
        console.log(e)
    }
}