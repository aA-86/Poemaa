// popular_themes was taken from the ./js/themes_and_poems.js
// popular_themes only contains themes with more than 5 poems associated with them.
const THEMES_AND_POEMS = poems;
const THEMES = themes;

const DURATION_TITLE = 7000; //  Duration for the title card in ms.
const DURATION_SUBMIT = 4000; // Duration for the submit button to be ready in ms.
const DURATION_RESET = 10000; // Duration for the reset button in ms.


const DURATION_FADE = 750; // Duration for fading page transitions in ms. To  
                           // work out the delay, it is DURATION_FADE - 
                           // duration in FADE_IN_PAGE. i.e., 750-500ms.
const FADE_IN_BTN = "fade-in 0.7s linear 1"; // Fade in button animation.
const FADE_OUT_BTN = "fade-out 0.7s linear 1"; // Fade out button animation.
const FADE_IN_PAGE = "fade-in 0.5s linear 1"; // Fade in page animation.
const FADE_OUT_PAGE = "fade-out 0.5s linear 1"; // Fade out page animation.


/* ----- When document is ready ----- */
$('document').ready(function () {
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

  /* ----- general document variabels ----- */
  const body = document.getElementsByTagName("BODY")[0];
  const html = document.getElementsByTagName("HTML")[0];

  /* ----- title card variables ----- */
  const titleCard = document.getElementById("title-card-container");

  /* ----- keywords variables ----- */
  const keywordsBtns = document.querySelectorAll(".keywords-btn");
  const keywordsContainer = document.getElementById("keywords-container");
  const submitBtn = document.getElementById("submit-btn");
  const progressBarSubmit = document.getElementsByClassName("progress-bar-outer")[0];
  
  /* ----- display poem variables ----- */
  const display_poem = document.getElementById('display-poem');
  const displayPoemContainer = document.getElementById("display-poem-container");
  const downloadBtn = document.getElementById("download-btn");
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const resetBtn = document.getElementById("inner-btn-reset");
  const title_author_container = document.getElementById("title-author-container");
  const progressBarReset = document.getElementsByClassName("progress-bar-outer")[1];

  /* ----- Set timeout for title page ----------------------------------- */

  setTimeout(() => {
    titleCard.style.animation = FADE_IN_PAGE;
    titleCard.style.animationFillMode = "forwards";
    setTimeout(() => {
      titleCard.style.animation = FADE_OUT_PAGE;
      titleCard.style.animationFillMode = "forwards";
      
      // make submitBtn deactivated until after the duration.
      setTimeout(() => {
        titleCard.style.display = "none";
        keywordsContainer.style.display = "flex";
        keywordsContainer.style.animation = FADE_IN_PAGE;
        keywordsContainer.animationFillMode = "forwards";
        
        setTimeout(() => {
          submitBtn.disabled = false;
          // submitBtn.style.display = "inline";
          // resetBtn.style.display = "none";
          resetBtn.style.animation = "none";
          submitBtn.style.animation = FADE_IN_BTN;
          submitBtn.style.animationFillMode = "forwards";
    
          canActivateSubmitBtn(keywordsBtns);
        }, DURATION_SUBMIT);
      }, DURATION_FADE);
    }, DURATION_TITLE);
  }, DURATION_FADE);

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
      submitBtn.disabled = true;

      /* ----- Set the delay for the keywords to disappear ----- */
      keywordsContainer.style.animation = FADE_OUT_PAGE;
      keywordsContainer.style.animationFillMode = "forwards";

      setTimeout(() => {
        displayPoemContainer.style.display = "flex";
        displayPoemContainer.style.animation = FADE_IN_PAGE;
        displayPoemContainer.style.animationFillMode = "fowards";
        keywordsContainer.style.display = "none";

        // goes through all the btns and get the selected themes
        var activeBtns = [];
        for (i = 0; i < keywordsBtns.length; i++) {
          if (keywordsBtns[i].dataset.active == "true") {
            activeBtns.push(keywordsBtns[i]);
          }
        }

        // Writes the author and title into the document
        var author_title = displayPoem(activeBtns);
        title.innerText = author_title[0];
        author.innerText = author_title[1];
        resetBtn.classList.remove("shake1");

        // Determiens the height of the client and the size of the poem 
        var vh = document.documentElement.clientHeight || 0;
        if (displayPoemContainer.offsetHeight >= 0.9 * vh) {
          // If height of the poem container is greater than 0.9 of the viewport height, change formatting of the document.
          body.style.display = "block"; body.style.marginTop = "20px";
          html.style.display = "block"; html.style.marginTop = "20px";
        } else {
          body.style.display = "flex"; body.style.marginTop = "0px";
          html.style.display = "flex"; html.style.marginTop = "0px";
        }

        // Set the container size to be the same width as the poem.
        var displayPoemSize = display_poem.offsetWidth;
        title_author_container.style.width = `${displayPoemSize}px`;
        
        // sets a timer and make it so that the inner button is not clickable until the duration is over.
        setTimeout(() => {
          resetBtn.disabled = false;
          submitBtn.style.animation = "none";

          // Reset Button animation.
          resetBtn.style.animation = FADE_IN_BTN;
          resetBtn.style.animationFillMode = "forwards";

          // Title and author animation.
          title.style.opacity = 0; author.style.opacity = 0; 
          title.style.transform = "translateY(0)";
          author.style.transform = "translateY(0)";
          title.style.animation = FADE_IN_BTN; 
          title.style.animationFillMode = "forwards";
          author.style.animation = FADE_IN_BTN; 
          author.style.animationFillMode = "forwards";

          downloadBtn.classList.add("shake1");
          resetBtn.classList.add("shake1");
        }, DURATION_RESET); // 10s
      }, DURATION_FADE);
    }
  })

  /* ----- Display Poem Code ---------------------------------------- */
  // Get reset button 
  resetBtn.addEventListener("click", () => {
    resetBtn.disabled = true;

    displayPoemContainer.style.animation = FADE_OUT_PAGE;
    displayPoemContainer.style.animationFillMode = "forwards";


    setTimeout(() => {
      // Reset document layout.
      body.style.display = "flex"; body.style.marginTop = "0px";
      html.style.display = "flex"; html.style.marginTop = "0px";

      // Visually remove display container and fade in keywords page
      displayPoemContainer.style.display = "none";
      keywordsContainer.style.display = "flex";
      keywordsContainer.style.animation = FADE_IN_PAGE;
      keywordsContainer.animationFillMode = "forwards";
      
      // Reset the animations.
      resetBtn.style.animation = "none";
      title.style.animation = "none";
      author.style.animation = "none";

      title.innerText = "";
      author.innerText = "";
      populateKeyWords();

      submitBtn.classList.remove("shake1");
      title.style.transform = "translateY(1000%)";
      author.style.transform = "translateY(1000%)";
      downloadBtn.style.opacity = "0";
      // Make submit button inactive for the duration.
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.animation = FADE_IN_BTN;
        submitBtn.style.animationFillMode = "forwards";
        canActivateSubmitBtn(keywordsBtns);
      }, DURATION_SUBMIT);
    }, DURATION_FADE);
  });
});
