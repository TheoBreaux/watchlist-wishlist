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
        movieTitleDiv.innerHTML = ` <input id="${element.movieName}" class="checkbox" type="checkbox">
                                    <label class="watchlist-checkbox" for="${element.movieName}">${element.movieName}</label>`;
        //append movieTitleDiv to wishlist
        wishlist.append(movieTitleDiv);

        //grab savedFilms of watchlistData checkboxes
        const savedFilms = document.querySelectorAll(".watchlist-checkbox");
        //keep the checkbox checked 
        const movieCheckboxes = document.getElementsByClassName("checkbox");

        // loop through savedFilms checkboxes to change styling of watched films
        for (let i = 0; i < savedFilms.length; i++) {
            if (watchlistData[i].watched === true) {
                //change styling of movie title after box is checked
                savedFilms[i].style.textDecoration = "line-through black";
                movieCheckboxes[i].checked = true;
            }
        }
    });

    //grab checkboxDivs if they exist which include input and label w/ movie title
    const movieCheckboxes = document.querySelectorAll(".checkbox-container");
    //add click event listener to checkboxes using a loop, add remove film function
    for (let i = 0; i < movieCheckboxes.length; i++) {
        const movieLabel = movieCheckboxes[i].children[1];
        movieCheckboxes[i].addEventListener("click", () => {
            removeFilm(movieLabel);
        });
    }
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
                            <div class="tooltip">
                                <button id="wishlist-btn">Wishlist</button>
                                <span class="tooltiptext">Title is already in wishlist!</span>
                            </div>`;

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
    //disable watchlist button if title is already in watchlistData array
    //styoe cursor to not allowed
    for (let i = 0; i < watchlistData.length; i++) {
        if (movieRequestTitle === watchlistData[i].movieName) {
            const addToWishlistBtn = document.querySelector("#wishlist-btn");
            addToWishlistBtn.disabled = true;
            addToWishlistBtn.style.cursor = "not-allowed";
            const tooltip = document.querySelector(".tooltip");
            tooltip.style.display = "inline-block";
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
    checkboxDiv.innerHTML = `       <input id="${movieRequestTitle}" class="checkbox" type="checkbox">
                                    <label class="watchlist-checkbox" for="${movieRequestTitle}">${movieRequestTitle}</label>`;
    //append checkbox div to wishlist                                  
    wishlistDiv.append(checkboxDiv);

    //grab label child of checkboxDiv
    const movieLabel = checkboxDiv.children[1];
    //add event listener to checkboxDiv
    checkboxDiv.addEventListener("click", () => {
        removeFilm(movieLabel);
    });

    //set JS object values as JSON and store to local storage as watchlistData array
    localStorage.setItem("wishlist", JSON.stringify(watchlistData));
}

function removeFilm(movieLabel) {
    //loop through watchlistData to change watched property to true
    for (let i = 0; i < watchlistData.length; i++) {
        const currObj = watchlistData[i];
        if (currObj.movieName === movieLabel.innerText && currObj.watched === true) {
            //changed watched property value to true
            currObj.watched = false;
            //change styling of movie title after box is checked
            movieLabel.style.textDecoration = "none";
        } else if (currObj.movieName === movieLabel.innerText && currObj.watched === false) {
            currObj.watched = true;
            //change styling of movie title after box is checked
            movieLabel.style.textDecoration = "line-through black";
        }
    }
    //update watchlistData array and set JS object values as JSON and store to local storage
    localStorage.setItem("wishlist", JSON.stringify(watchlistData));
}