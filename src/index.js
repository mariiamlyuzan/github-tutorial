/*const input = document.getElementById("myInput");
const btn = document.querySelector(".addBtn");
const container = document.getElementById("list");

btn.addEventListener('click', createList);

function createList() {

const list = document.createElement("li");
list.textContent = input.value;
container.prepend(list);

}*/
//--------------------------------------//

/*const input = document.getElementById("myInput");
const btn = document.querySelector(".addBtn");

class Services {
  constructor() {
    this.list = document.getElementById("list");
  }
  saveStorage(data) {
    localStorage.setItem("tasks", JSON.stringify(data));
  }
  getStorage() {
    return JSON.parse(localStorage.getItem("tasks"));
  }

  render() {
    const data = this.getStorage();

    const tasks = data?.reduce(
      (acc, task) => acc + `<li>${task.value}</li>`,
      ""
    );
    this.list.innerHTML = "";
    this.list.insertAdjacentHTML("beforeend", tasks);
  }
}

class TODO extends Services {
  #tasks;
  constructor({ name }) {
    super();
    this.#tasks = [];
    this.name = name;
  }

  saveTask(task) {
    this.#tasks.push(task);
    this.saveStorage(this.#tasks);
    this.render();
  }

  createTask(value) {
    const task = {
      dateCreate: new Date(),
      value: value,
      owner: this.name,
      priority: null,
      result: null,
      id: Date.now(),
    };

    this.saveTask(task);
  }

  update() {
    this.#tasks = this.getStorage() ?? [];
    console.log(this.#tasks);
  }
}

const user = new TODO({ name: "Maksim" });

window.addEventListener("DOMContentLoaded", user.update());

console.log(`user`, user);

user.render();

btn.addEventListener("click", () => {
  console.log(`input.value`, input.value);
  user.createTask(input.value);
});*/

/*
---------------HTML
 <div id="myDIV" class="header">
    <h2>My To Do List</h2>
    <div class="div">
    <input type="text" id="myInput" placeholder="Title...">
    <span class="addBtn">Add</span>
  </div>
</div>
*/

// https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/

 //import if from '../src/js/if';
 import io from '../src/js/io';
import articlesTpl from './templates/articles.hbs';
import NewsApiService from './js/news-service';

const refs = getRefs();
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  newsApiService.resetPage();
  clearArticlesContainer();
  newsApiService.fetchArticles().then(articles => {
    appendArticlesMarkup(articles);
    newsApiService.incrementPage();
  });
}

function appendArticlesMarkup(articles) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

function getRefs() {
  return {
    searchForm: document.querySelector('.js-search-form'),
    articlesContainer: document.querySelector('.js-articles-container'),
    sentinel: document.querySelector('#sentinel'),
  };
}

const onEntry = entries => {
  console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.query !== '') {
      console.log('Пора грузить еще статьи' + Date.now());
      newsApiService.fetchArticles().then(articles => {
        appendArticlesMarkup(articles);
        newsApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
console.log(observer);
observer.observe(refs.sentinel);