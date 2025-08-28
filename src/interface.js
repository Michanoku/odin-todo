import { relationHandler, storageHandler } from './handler.js'; 

const manipulateDOM = (function () {
  // Add elements that will be used througout most DOM manipulations
  const content = document.querySelector('#content');
  const projectList = document.querySelector('#project-list');
  const todoList = document.querySelector('#todo-list');
  const addProject = document.querySelector('#add-project');
  const back = document.querySelector('#back');
  const projectName = document.querySelector('#project-name');

  // Set the default background color
  const defaultBG = '#F4F0BB';

  // Event handler to add a project button to the content container
  addProject.addEventListener('click', () => {
    addNewProject("New Project");
  });

  // Event handler for the button to go back to the project list
  back.addEventListener('click', () => {
    // Set background color to default
    content.style.backgroundColor = defaultBG;
    // Show the list and hide the rest
    projectList.style.display = 'grid';
    todoList.style.display = 'none';
    back.style.display = 'none';
    projectName.textContent = 'Projects';
  });

  // Open a project 
  function openProject(project) {
    // Change the colors to the colors of the project, 
    content.style.backgroundColor = project.project.backgroundColor;
    content.style.color = project.project.textColor;

    // Set to display the project name, hide the project list and show the project
    projectName.textContent = project.project.name;
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