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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
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

/** Hide new story form on click on "cancel" */

function hideClearNewStoryForm(evt) {
  console.debug("hideClearNewStoryForm", evt);
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
}

$cancelStoryFormBtn.on("click", hideClearNewStoryForm);