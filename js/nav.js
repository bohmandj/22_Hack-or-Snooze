"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show new story form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
  hidePageComponents();
  $newStoryForm.show();
  putStoriesOnPage();
}

$navSubmitStory.on("click", navSubmitClick);

/** Show favorited stories on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putFavoritesOnPage();
  $favStoriesPage.show();
}

$navFavorites.on("click", navFavoritesClick);

/** Show user's own stories on click on "my stories" */

function navMyStoriesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putMyStoriesOnPage();
  $myStoriesPage.show();
}

$navMyStories.on("click", navMyStoriesClick);

/** When a user first logs in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
