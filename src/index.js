import "./styles.css";

import relationHandler from './handler.js';

document.querySelector('#add-project').addEventListener('click', () => {
  relationHandler.addProject("New Project");
});

document.querySelector('#add-todo').addEventListener('click', () => {
  relationHandler.addProject("New Project");
});