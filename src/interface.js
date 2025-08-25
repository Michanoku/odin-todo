import { relationHandler } from './handler.js'; 

const manipulateDOM = (function () {
  const content = document.querySelector('#content');
  const projectList = document.querySelector('#project-list');

  document.querySelector('#add-project').addEventListener('click', () => {
    addProject("New Project");
  });

  document.querySelector('#add-todo').addEventListener('click', () => {
   //
  });

  function openProject(projectId) {
    content.textContent = '';
    const projectObject = relationHandler.getProject(projectId);
    content.textContent = projectObject.project.name;
  }

  function addProject(name) {
    const project = relationHandler.addProject(name);
    const button = document.createElement('button');
    button.classList.add('project-button');
    button.textContent = `${project.name} (${project.checked}/${project.total})`;
    button.dataset.id = project.id;
    projectList.appendChild(button);
    button.addEventListener('click', () =>{
      openProject(button.dataset.id);
    });
  }

  return { addProject, openProject };
})();

export { manipulateDOM }