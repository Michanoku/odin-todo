import { relationHandler, storageHandler } from './handler.js'; 

const manipulateDOM = (function () {
  const content = document.querySelector('#content');
  const projectList = document.querySelector('#project-list');

  document.querySelector('#add-project').addEventListener('click', () => {
    addNewProject("New Project");
  });

  document.querySelector('#add-todo').addEventListener('click', () => {
   //
  });

  function openProject(projectId) {
    content.textContent = '';
    const projectObject = relationHandler.getProject(projectId);
    content.textContent = `${projectObject.project.name} (${ projectObject.checked}/${ projectObject.total})`;
  }

  function addNewProject(name) {
    const project = relationHandler.addProject(name);
    const button = document.createElement('button');
    button.classList.add('project-button');
    button.textContent = `${project.name} (0/0)`;
    button.dataset.id = project.id;
    projectList.appendChild(button);
    button.addEventListener('click', () =>{
      openProject(button.dataset.id);
    });
  }

  function loadInitial() {
    const currentProjects = storageHandler.loadInitial();
    currentProjects.forEach(project => {
      const button = document.createElement('button');
      button.classList.add('project-button');
      button.textContent = `${project.project.name} (${ project.checked}/${ project.total})`;
      button.dataset.id = project.project.id;
      projectList.appendChild(button);
      button.addEventListener('click', () =>{
        openProject(button.dataset.id);
      });
    });
  }

  return { addNewProject, openProject };
})();

export { manipulateDOM }