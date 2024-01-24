"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, extraIcon) {
  // console.debug("generateStoryMarkup", story);

  /***************************************************************
  put code below for funciton getting delete button (only on "my stories" page)
  ***************************************************************/
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showTrashIcon(extraIcon)}
        ${showFavoriteStar(story, currentUser)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submit new story form on "submit" */

async function submitNewStory(evt) {
  console.debug("submitNewStory", evt);
  evt.preventDefault();
  // harvest form data
  const title = $("#newstory-title").val();
  const author = $("#newstory-author").val();
  const url = $("#newstory-url").val();
  const username = currentUser.username;
  const storyData = { title, author, url, username };
  // make new story
  const newStory = await storyList.addStory(currentUser, storyData);
  const newStoryMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend(newStoryMarkup);
  hideClearNewStoryForm();
}

$newStoryForm.on("submit", submitNewStory);

/** Hide and clear new story form on click on "cancel" */

function hideClearNewStoryForm(evt) {
  console.debug("hideClearNewStoryForm", evt);
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
}

$cancelStoryFormBtn.on("click", hideClearNewStoryForm);

/***************************************************
 * Code relating to "Favorites" functionality below:
 */

// funciton to show favorited stories page, called when favorites nav button is clicked
function putFavoritesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favStoriesList.empty();
  if (currentUser !== undefined && currentUser.favorites.length === 0) {
    $favStoriesList.append("<h5>You haven't favorited any stories!</h5>");
    return
  }
  // loop through all of our user's favorited stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    ($story).appendTo("#fav-stories-list");
  }
}

/* Handle favorite-star click
* - if star has class "fav", remove story from favorites list and update api
* - if star has class "notFav", add story to favorites list and update api
* - changes clicked star to full if empty or to empty if full
*/
function starClick(e) {
  const storyId = e.target.closest("li").id;
  const story = storyList.stories.find((story) => story.storyId === storyId);
  if (e.target.classList.contains("fav")) {
    currentUser.removeFavorite(story);
    $(e.target).html("&#9734;")
  };
  if (e.target.classList.contains("notFav")) {
    currentUser.addFavorite(story);
    $(e.target).html("&#9733;")
  };
  $(e.target).toggleClass("fav notFav");
}

$(".stories-list").on("click", function (e) {
  if (e.target.classList.contains("star")) {
    starClick(e);
  }
});

// function to determine filled/empty star for favorited/unfavorited story
function showFavoriteStar(story, user) {
  const storyId = story.storyId
  if (user !== undefined) {
    if (user.checkFavStatus(storyId)) {
      return "<span class='star fav'>&#9733;</span>";
    } else {
      return "<span class='star notFav'>&#9734;</span>";
    }
  }
  return "";
}

/***************************************************
 * Code relating to "My Stories" functionality below:
 */

// funciton to show user's own stories page, called when "my stories" nav button is clicked
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $myStoriesList.empty();
  if (currentUser !== undefined && currentUser.ownStories.length === 0) {
    $myStoriesList.append("<h5>You haven't posted any stories!</h5>");
    return
  }
  // loop through all of our user's own stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, "trash");
    ($story).appendTo("#my-stories-list");
  }
}

/* Handle trash icon click
* - removes story from currentUser.ownStories and updates API
*/
function trashClick(e) {
  const li = e.target.closest("li");
  const ul = li.closest("ul");
  const storyId = li.id;
  const story = storyList.stories.find((story) => story.storyId === storyId);
  const isConfirmed = confirm(`Delete "${story.title}" story?\nThis action cannot be undone.`)
  if (isConfirmed === true) {
    storyList.deleteStory(currentUser, storyId);
    ul.removeChild(li);
  }
}

$(".stories-list").on("click", function (e) {
  if (e.target.classList.contains("trash")) {
    trashClick(e);
  }
});

// function to prepend trash icon to stories on "my stories" page
function showTrashIcon(extraIcon) {
  if (extraIcon === "trash") {
    return "<span class='trash'>&#128465;</span>";
  }
  return "";
}