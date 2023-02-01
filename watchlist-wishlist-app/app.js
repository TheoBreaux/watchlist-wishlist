//grab movie search form
const movieForm = document.querySelector("#movie-search-form");
//grab movie title input
const movieTitle = document.querySelector("#movie-title");
//grab movie search button
const movieTitleSearchBtn = document.querySelector("#movie-title-search-btn");

//pulling existing wishlist data from local storage
function getList() {
    const filmsStored = localStorage.getItem("wishlist");
    if (filmsStored === null) {
        return [];
    }
    //get list of movies from local storage
    return JSON.parse(filmsStored);
}

//assign resulting array from getList invocation to variable
let watchlistData = getList();

//grab wishlist div
const wishlist = document.getElementById("wishlist");
//turn off display none, set to block
if (watchlistData.length > 0) {
    wishlist.style.display = "block";
    //loop through list and for each item create new div containing title and checkbox input
    watchlistData.forEach(element => {
        //create new div to hold film title and inpuit checkbox
        const movieTitleDiv = document.createElement("div");
        //assign classname to movieTitleDiv
        movieTitleDiv.className = "checkbox-container";
        //update innerHTML of div to reflect films already on wishlist
        movieTitleDiv.innerHTML = ` <input id="movie-checkbox" type="checkbox" name="${element.movieName}">
                                    <label class="watchlist-checkbox" for="${element.movieName}">${element.movieName}</label>`;
        //append movieTitleDiv to wishlist
        wishlist.append(movieTitleDiv);
    });
}

//add submit eventlistener to form
movieForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    //store movie title input value
    const movieTitleInput = movieTitle.value;
    //grab data from API and store return value
    const movieRequest = await fetch(`http://www.omdbapi.com/?t=${movieTitleInput}&apikey=1e8fd010`);

    movieRequest.json().then((data) => {
        //store needed return values in variables from returned object     
        const movieRequestTitle = data.Title;
        const movieRequestYear = data.Year;
        const movieRequestPoster = data.Poster;

        //declare new variable with new html elements to append to body
        //poster image, title, release year and button to add to watchlist
        const html = `<img class="movie-poster" src=${movieRequestPoster}>
                            <p class="title">${movieRequestTitle}</p>
                            <p class="release-year">${movieRequestYear}</p>
                            <button id="wishlist-btn">Wishlist</button>`;

        //grab returned film div on page
        const returnedFilmDiv = document.querySelector(".returned-film");
        //update innerHTML of returned film div to include all movie info(html)
        returnedFilmDiv.innerHTML = html;

        //grab newly created wishlist button
        const addToWishlistBtn = document.querySelector("#wishlist-btn");

        //if new wishListBtn is clicked, run runWishlist function, which calls addToWishlist function 
        addToWishlistBtn.addEventListener("click", runWishlist);

        //create function to run addToWishList function passing in parameter
        function runWishlist() {
            addToWishlist(movieRequestTitle);
        }
        //Reset input
        movieTitle.value = "";
    })
})

//define function to create and add items to wishlist
//create a function that will append a list item to an ul and save the names of the films
const addToWishlist = (movieRequestTitle) => {
    for (let i = 0; i < watchlistData.length; i++) {
        const currMovieObj = watchlistData[i];
        if (movieRequestTitle === currMovieObj.movieName) {
            alert(`"${movieRequestTitle}" is already on your watchlist. Please search for another title.`);
            return;
        }
    }
    watchlistData.push({ movieName: movieRequestTitle, watched: false });
    //grab wishlist Div
    const wishlistDiv = document.querySelector(".wishlist-div");
    //change Div from display none to block so it now appears 
    wishlistDiv.style.display = "block";


    //create new div to hold input checkboxes
    const checkboxDiv = document.createElement("div");
    //give new div a classname 
    checkboxDiv.className = "checkbox-container";
    //update innerHTML of div to reflect new film added to wishlist
    checkboxDiv.innerHTML = `       <input id="movie-checkbox" type="checkbox" name="${movieRequestTitle}">
                                    <label class="watchlist-checkbox" for="${movieRequestTitle}">${movieRequestTitle}</label>`;
    //append checkbox div to wishlist                                  
    wishlistDiv.append(checkboxDiv)
    //set JS object values as JSON and store to local storage as watchlistData array
    localStorage.setItem("wishlist", JSON.stringify(watchlistData));
}

//grab checkboxDivs which include input and label w/ movie title
const movieCheckboxes = document.querySelectorAll(".checkbox-container");
//add click event listener to checkboxes using a loop, add remove film function
for (let i = 0; i < movieCheckboxes.length; i++) {
    const currChild = movieCheckboxes[i].children;
    movieCheckboxes[i].addEventListener("click", () => {
        removeFilm(currChild);
    });
}

function removeFilm(currChild) {
    //capture dom node for label tag
    const movieLabel = currChild[1];
    //change styling of movie title after box is checked
    movieLabel.style.textDecoration = "line-through black";

    //loop through watchlistData to change watched property to true
    for (let i = 0; i < watchlistData.length; i++) {
        const currObj = watchlistData[i];
        if (currObj.movieName === movieLabel.innerText) {
            //changed watched property value to true
            currObj.watched = true;
            //declare variable to grab index of selection in array
            const removeIndex = watchlistData.indexOf(currObj);
            //remove film title from watchlistData array
            watchlistData.splice(removeIndex, 1);
            //update watchlistData array and set JS object values as JSON and store to local storage
            localStorage.setItem("wishlist", JSON.stringify(watchlistData));
        }
    }
}

// DONE - instead of using local storage to add films, addtowishlist function should take parameter to add to the wishlist. lines 50, 67, 69
//DONE - LINE 67-84 - how to prevent in the wishlist there being the same title more than once conditional if statement solved this
//DONE - checkboxes and strikethrough

