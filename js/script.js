const display_poem = document.getElementById('display-poem');

// popular_themes was taken from the ./js/themes_and_poems.js
// popular_themes only contains themes with more than 5 poems associated with them.
const THEMES_AND_POEMS = poems;
const THEMES = themes;

const INACTIVE = "#DDE6ED"; // colours for buttons when active and inactive. make these into a style and add a class to it.
const ACTIVE = "#526D82";

const DURATION_RESET = 10000; // 10s Duration for the reset button
const DURATION_TITLE = 70; //  7s Duration for the title card
const DURATION_SUBMIT = 4000; // 4s Duration for the submit button to be ready.


/* ----- Functions ----- */
function populateKeyWords() {
  /**
   * We populate the keywords with the themes in ./js/themes_and_poems.js folder
   */

  // We first get all instances of buttons in a list.
  var btns = document.getElementsByClassName("keywords-btn");

  // Goes ahead and reset all active buttons
  for (i = 0; i < btns.length; i++) {
    btns[i].dataset.active = "false";
    btns[i].style.fontWeight = "400";

    if (i % 2 == 0) {
      btns[i].classList.add("shake1");
    } else {
      btns[i].classList.add("shake2");
    }
  }

  // Keep track of duplicates so that no two keywords will have the same keyword.
  dup = []
  for (i = 0; i < btns.length; i++) {
    var rand = Math.floor(Math.random() * THEMES.length);
    var chosen_theme = THEMES[rand];

    if (dup.includes(chosen_theme)) {
      i--;
      continue;
    }

    btns[i].textContent = chosen_theme;
    btns[i].dataset.value = chosen_theme;
    btns[i].dataset.index = rand;
    dup.push(chosen_theme);
  }
}

function canActivateSubmitBtn(keywordsBtns) {
  /**
   * Determine if the submit button can be activated i.e., there is at least 1 keyword that is selected. Returns true if can be activated, and false otherwise.
   */
  // get the submit button
  var submitBtn = document.getElementById("submit-btn");
  // checks if at least one of the buttons is active
  for (i = 0; i < keywordsBtns.length; i++) {
    if (keywordsBtns[i].dataset.active == "true") {
      submitBtn.classList.add("shake1");
      return true;
    }
  }
  submitBtn.classList.remove("shake1");
  return false;
}

function displayPoem(clickedBtns) {
  /**
   * displays a poem from the given clicked btns. Returns the title and author
   */
  // choose a random theme
  var randTheme = Math.floor(Math.random() * clickedBtns.length);
  var theme = clickedBtns[randTheme].dataset.value; // get the theme from the btn from the data-value.
  var index = clickedBtns[randTheme].dataset.index; // get the index of the theme from the btn data-index.

  // picks a random poem from the given theme.
  var randPoemIndex = Math.floor(Math.random() * THEMES_AND_POEMS[theme].length); // get random poem index
  var poem = THEMES_AND_POEMS[theme][randPoemIndex]['lines']; // Choose a random poem from the given themes.

  // formats the poem
  text = '';
  for (i = 0; i < poem.length; i++) {
    text = text + poem[i] + '\n\n';
  }
  display_poem.textContent = text;

  return [THEMES_AND_POEMS[theme][randPoemIndex]['title'], THEMES_AND_POEMS[theme][randPoemIndex]['author']]
}

/* ----- When document is ready ----- */
$('document').ready(function () {
  for (i = 0; i < THEMES_AND_POEMS.length; i++) {
    console.log(THEMES_AND_POEMS[i]);
  }

  var shaker = document.getElementsByClassName("shake")[0];
  var body = document.getElementsByTagName("BODY")[0];
  var html = document.getElementsByTagName("HTML")[0];

  /* ----- title card ----- */
  var titleCard = document.getElementById("title-card");

  /* ----- keywords variables ----- */
  var keywordsBtns = document.querySelectorAll(".keywords-btn");
  var keywordsContainer = document.getElementById("keywords-container");
  var submitBtn = document.getElementById("submit-btn");

  /* ----- display poem variables ----- */
  var displayPoemContainer = document.getElementById("display-poem-container");
  var downloadBtn = document.getElementById("download-btn");
  var title = document.getElementById("title");
  var author = document.getElementById("author");
  var resetBtn = document.getElementById("inner-btn-reset");
  var title_author_container = document.getElementById("title-author-container");

  /* ----- Set timeout for title page ----------------------------------- */
  setTimeout(() => {
    titleCard.style.display = "none";
    keywordsContainer.style.display = "flex";

    // make submitBtn deactivated until after the duration.
    setTimeout(() => {
      submitBtn.disabled = false;
      canActivateSubmitBtn(keywordsBtns);
    }, DURATION_SUBMIT);

  }, DURATION_TITLE);

  /* ----- Populates the keywords with a random theme -------------------- */
  populateKeyWords();

  // get a click event for each keywords button.
  keywordsBtns.forEach(button => {
    button.addEventListener('click', () => {
      // Set if button is active or not
      if (button.dataset.active == "false") {
        button.dataset.active = "true";
        button.style.fontWeight = "900";
      } else {
        button.dataset.active = "false";
        button.style.fontWeight = "400";
      }

      if (submitBtn.disabled == false) {
        // Adds shake1 or removes it depending on how many keywords are selected.
        canActivateSubmitBtn(keywordsBtns);
      }
    })
  });

  // get a click event for the submit theme button.
  submitBtn.addEventListener('click', () => {
    if (canActivateSubmitBtn(keywordsBtns)) {
      displayPoemContainer.style.display = "flex";
      keywordsContainer.style.display = "none";
      submitBtn.disabled = true;

      // goes through all the btns and get the selected themes
      var activeBtns = [];
      for (i = 0; i < keywordsBtns.length; i++) {
        if (keywordsBtns[i].dataset.active == "true") {
          activeBtns.push(keywordsBtns[i]);
        }
      }

      // displayPoem displays selected poem and returns the title and author of 
      // said poem.
      var author_title = displayPoem(activeBtns);
      title.innerText = author_title[0];
      author.innerText = author_title[1];
      resetBtn.classList.remove("shake1");
      var vh = document.documentElement.clientHeight || 0;
      if (displayPoemContainer.offsetHeight >= 0.9 * vh) {
        body.style.display = "block"; body.style.marginTop = "20px";
        html.style.display = "block"; html.style.marginTop = "20px";
      }

      var displayPoemSize = display_poem.offsetWidth;
      title_author_container.style.width = `${displayPoemSize}px`;

      // sets a timer and make it so that the inner button is not clickable.
      setTimeout(() => {
        resetBtn.disabled = false;
        // downloadBtn.style.display = "block";
        // title.innerText = author_title[0]; title.style.display = "block";
        // author.innerText = author_title[1]; author.style.display = "block";
        title.style.color = "rgba(0, 0, 0, 1)";
        author.style.color = "rgba(0, 0, 0, 1)";
        // downloadBtn.style.opacity = "1";

        downloadBtn.classList.add("shake1");
        resetBtn.classList.add("shake1");
      }, DURATION_RESET); // 10s
    }
  })

  /* ----- Display Poem Code ---------------------------------------- */
  // Get reset button 
  resetBtn.addEventListener("click", () => {
    resetBtn.disabled = true;
    displayPoemContainer.style.display = "none";

    body.style.display = "flex";
    html.style.display = "flex";
    keywordsContainer.style.display = "flex";
    // downloadBtn.style.display = "none";

    title.innerText = "";
    author.innerText = "";
    populateKeyWords();

    submitBtn.classList.remove("shake1");
    title.style.color = "rgba(0, 0, 0, 0)";
    author.style.color = "rgba(0, 0, 0, 0)";
    downloadBtn.style.opacity = "0";
    keywordsContainer.style.marginTop = "-25%";
    // Make submit button inactive for the duration.
    setTimeout(() => {
      submitBtn.disabled = false;
      canActivateSubmitBtn(keywordsBtns);
    }, DURATION_SUBMIT);
  });
});
