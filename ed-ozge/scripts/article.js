'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly
//to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects,
// which means we can add properties/values to them at any time. In this case, the array relates to
// ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// We can not use arrow funtion  because we use "this" and this refers to prototype objects.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent?
  //How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // Question mark is represent if condition and colon represent the or logic. Before colon is value assign true  after colon if false.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board,
//rather than just single instances. Object-oriented programming would call these "class-level" functions,
//that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles.
//This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now?
// How is this different from previous labs?
// This function called from Article.fetchAll function. raw data represets hackerIpsum.json file. previously it was represent blogArticle.js It has object data
Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)));
};

// REVIEW: This function will retrieve the data from either a local or remote source,
//and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  //IF statement checking for if localStorage has data.IF it has data loads Articles
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
  } else {
    $.getJSON('/data/hackerIpsum.json').then(data => localStorage.setItem('rawData', JSON.stringify(data)));
    // .then(data => console.log(data));
    // .then(localStorage.setItem('rawData', JSON.stringify('data')));
    //It gets data form hackerIpsum.json and set  in local storage and convert it to string.
  }
  articleView.initIndexPage();
};