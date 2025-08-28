import { relationHandler, storageHandler } from './handler.js'; 
import { projects } from './projects.js';

const manipulateDOM = (function () {
  // Add elements that will be used througout most DOM manipulations
  const content = document.querySelector('#content');
  const projectList = document.querySelector('#project-list');
  const todoList = document.querySelector('#todo-list');
  const addProject = document.querySelector('#add-project');
  const back = document.querySelector('#back');
  const projectName = document.querySelector('#project-name');
  const colorButtons = document.querySelectorAll('.color-button');

  // Set the default background color
  const defaultBG = '#F4F0BB';

  // Event handler to add a project button to the content container
  addProject.addEventListener('click', () => {
    addNewProject("New Project");
  });

  projectName.addEventListener('click', () => {
    if (projectName.dataset.id !== "none") {
      projectName.readOnly = false;
      projectName.style.border = `1px solid ${projectName.style.color}`;
    }
  });

  projectName.addEventListener('blur', () => {
    if (projectName.dataset.id !== "none") {
      projectName.readOnly = true;
      projectName.style.border = 0;
      projects.editProjectName(projectName.dataset.id, projectName.value);
    }
  });

  colorButtons.forEach(button => {
    content.style.backgroundColor = button.style.backgroundColor;
    projects.editProjectColor(projectName.dataset.id, button.style.backgroundColor);
  });

  // Event handler for the button to go back to the project list
  back.addEventListener('click', () => {
    // Reload project list before going back (something may have changed)
    loadInitial();
    // Set background color to default
    content.style.backgroundColor = defaultBG;
    // Show the list and hide the rest
    projectList.style.display = 'grid';
    todoList.style.display = 'none';
    back.style.display = 'none';
    projectName.value = 'Projects';
    projectName.dataset.id = 'none';
  });

  // Open a project 
  function openProject(project) {
    // Change the colors to the colors of the project, 
    content.style.backgroundColor = project.project.backgroundColor;
    content.style.color = project.project.textColor;

    // Set to display the project name, hide the project list and show the project
    projectName.value = project.project.name;
    projectName.dataset.id = project.project.id;
    projectList.style.display = 'none';
    todoList.style.display = 'grid';
    back.style.display = 'block';
  }

  // Add a new project, as opposed to adding an existing project
  function addNewProject(name) {
    // Use the relationhandler to create the project with the desired name
    const project = relationHandler.addProject(name);

    // Create the project button
    const button = createProjectButton(project);

    // Append the button before the add button, so the add button is always last
    projectList.insertBefore(button, addProject);
  }

  // Create the button for the project (TODO, needs more INFO and styling)
  function createProjectButton(project) {
      // Create the button and set the classes
      const button = document.createElement('button');
      button.classList.add('project-button', 'open-project');

      // Create the name space for the project and set the classes and content
      const projectName = document.createElement('div');
      projectName.classList.add('project-name');
      projectName.textContent = project.project.name;
      projectName.style.color = project.project.textColor;

      // Create the check counter (to see how many todo are done) and set it up
      const projectChecked = document.createElement('div');
      projectChecked.classList.add('project-checked');
      projectChecked.textContent = `${project.checked}/${project.total}`;
      projectChecked.style.color = project.project.backgroundColor;
      projectChecked.style.filter = `brightness(${project.project.subtextBrightness})`;

      // Append the fields, style the button and add the EventListener
      button.append(projectName, projectChecked);
      button.style.backgroundColor = `#${project.project.color}`;
      button.addEventListener('click', () =>{
        openProject(project);
      });
    return button;
  }

  // The function to load the initial content, either existing or new
  function loadInitial() {
    // Remove all children besides the last button from the list (only relevant for reload)
    Array.from(projectList.children).forEach(child => {
      if (child !== addProject) {
        projectList.removeChild(child);
      } 
    });
    
    // Ask storageHandler to load the data. If no data exists, storageHandler will create initial data
    const initialProjects = storageHandler.loadInitial();

    // For each project the handler returned, create the button and add it to the page
    initialProjects.forEach(project => {
      // Create the project button
      const button = createProjectButton(project);

      // Append the button before the add button, so the add button is always last
      projectList.insertBefore(button, addProject);
    });
  }

  return { loadInitial };
})();

export { manipulateDOM }