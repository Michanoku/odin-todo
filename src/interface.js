import { relationHandler, storageHandler } from './handler.js'; 

const manipulateDOM = (function () {
  // Add elements that will be used througout most DOM manipulations

  const defaultBG = '#F4F0BB';

  const content = document.querySelector('#content');
  const projectList = document.querySelector('#project-list');
  const todoList = document.querySelector('#todo-list');
  const addProject = document.querySelector('#add-project');
  const back = document.querySelector('#back');
  const projectName = document.querySelector('#project-name');

  // Event handler to add a project button to the content container
  addProject.addEventListener('click', () => {
    addNewProject("New Project");
  });

  back.addEventListener('click', () => {
    content.style.backgroundColor = defaultBG;
    projectList.style.display = 'grid';
    todoList.style.display = 'none';
    back.style.display = 'none';
    projectName.textContent = 'Projects';
  });

  // Open a project 
  function openProject(project, button) {
    content.style.backgroundColor = button.style.backgroundColor;
    content.style.color = calculateTextColor(button.style.backgroundColor);
    projectName.textContent = project.project.name;
    projectList.style.display = 'none';
    todoList.style.display = 'grid';
    back.style.display = 'block';

    /*
    content.textContent = '';
    const projectObject = relationHandler.getProject(projectId);
    content.textContent = `${projectObject.project.name} (${ projectObject.checked}/${ projectObject.total})`;*/
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

  // Calculate whether the text color needs to be black or white
  function calculateTextColor(backgroundColor) {
    const red = `${backgroundColor[0]}${backgroundColor[1]}`;
    const green = `${backgroundColor[2]}${backgroundColor[3]}`;
    const blue = `${backgroundColor[4]}${backgroundColor[5]}`;

    // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
    const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
    return brightness < 128 ? '#ffffff' : '#000000';
  }

  // Create the button for the project (TODO, needs more INFO and styling)
  function createProjectButton(project) {
      const button = document.createElement('button');
      button.classList.add('project-button');
      button.textContent = `${project.project.name} (${ project.checked}/${ project.total})`;
      button.style.backgroundColor = `#${project.project.color}`;
      button.style.color = calculateTextColor(project.project.color);
      button.dataset.id = project.project.id;
      button.addEventListener('click', () =>{
        openProject(project, button);
      });
    return button;
  }

  // The function to load the initial content, either existing or new
  function loadInitial() {
    // Ask storageHandler to load the data. If no data exists, storageHandler will create initial data
    const currentProjects = storageHandler.loadInitial();

    // For each project the handler returned, create the button and add it to the page
    currentProjects.forEach(project => {

      // Create the project button
      const button = createProjectButton(project);

      // Append the button before the add button, so the add button is always last
      projectList.insertBefore(button, addProject);
    });
  }

  return { loadInitial };
})();

export { manipulateDOM }