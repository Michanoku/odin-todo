import { relationHandler, storageHandler } from './handler.js'; 
import { projects } from './projects.js';

const manipulateDOM = (function () {
  // Add elements that will be used througout most DOM manipulations
  const content = document.querySelector('#content');
  const listTitle = document.querySelector('#list-title');
  const projectList = document.querySelector('#project-list');
  const projectTitle = document.querySelector('#project-title');
  const todoList = document.querySelector('#todo-list');
  const addProject = document.querySelector('#add-project');
  const back = document.querySelector('#back');
  const colorButtons = document.querySelector('#color-buttons');

  // Set the default background color
  const defaultBG = '#F4F0BB';

  // Event handler to add a project button to the content container
  addProject.addEventListener('click', () => {
    addNewProject("New Project");
  });

  // Event handler for the button to go back to the project list
  back.addEventListener('click', () => {
    // Reload project list before going back (something may have changed)
    loadInitial();
    // Set background color to default
    content.style.backgroundColor = defaultBG;
    projectTitle.removeChild(projectTitle.firstElementChild);
    while (colorButtons.firstElementChild) {    
      colorButtons.removeChild(colorButtons.firstElementChild);
    };
    // Show the list and hide the rest
    projectList.style.display = 'grid';
    listTitle.style.display = 'flex';
    todoList.style.display = 'none';
    projectTitle.style.display = 'none';
  });

  // Add a new project, as opposed to adding an existing project
  function addNewProject(name) {
    // Use the relationhandler to create the project with the desired name
    const project = relationHandler.addProject(name);

    // Create the project button
    const button = createProjectButton(project);

    // Append the button before the add button, so the add button is always last
    projectList.insertBefore(button, addProject);
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
    initialProjects.forEach(projectData => {
      // Create the project button
      const button = createProjectButton(projectData);

      // Append the button before the add button, so the add button is always last
      projectList.insertBefore(button, addProject);
    });
  }

  // Create the button for the project
  function createProjectButton(projectData) {
      // Unpack the project object: 
      const { project, todo, checked, total } = projectData;
      // Create the button and set the classes
      const button = document.createElement('button');
      button.classList.add('project-button', 'open-project');
      button.style.backgroundColor = project.backgroundColor;

      // Create the name space for the project and set the classes and content
      const projectName = document.createElement('div');
      projectName.classList.add('project-name');
      projectName.textContent = project.name;
      projectName.style.color = project.textColor;

      // Create the check counter (to see how many todo are done) and set it up
      const projectChecked = document.createElement('div');
      projectChecked.classList.add('project-checked');
      projectChecked.textContent = `${checked}/${total}`;
      projectChecked.style.color = project.backgroundColor;
      projectChecked.style.filter = `brightness(${project.subtextBrightness})`;

      // Append the fields, style the button and add the EventListener
      button.append(projectName, projectChecked);
      button.style.backgroundColor = `#${project.color}`;
      button.addEventListener('click', () =>{
        openProject(project);
      });
    return button;
  }

  // Open a project 
  function openProject(project) {
    // Change the colors to the colors of the project, 
    content.style.backgroundColor = project.backgroundColor;
    back.style.color = project.textColor;

    addInput(project);
    // Set to display the project name, hide the project list and show the project
    projectList.style.display = 'none';
    listTitle.style.display = 'none';
    todoList.style.display = 'grid';
    projectTitle.style.display = 'flex';
  }

  // Add color buttons to a project
  function addInput(project) {
    // Set colors to use for buttons to change background color
    const colors = ["#38618C", "#EC4E20", "#FF9505", "#6A0136", "#35CE8D", "#f5f5f5", "#19180A"];
    // Create a button for each color and add the required listeners
    colors.forEach(color => {
      const button = document.createElement('button');
      button.classList.add('color-button');
      button.style.backgroundColor = color;
      button.addEventListener('click', () => {
        projects.editProjectColor(project, color);
        changeColor(project);
      });
      colorButtons.appendChild(button);
    });
    // Create the projectName input to change the name of the project
    const projectName = document.createElement("input");
    projectName.className = "text";
    projectName.type = "text";
    projectName.value = project.name;
    projectName.readOnly = true;
    projectName.id = "project-name";
    projectName.style.color = project.textColor;

    // Add one EventListener for click and one for blur
    projectName.addEventListener('click', () => {
      projectName.readOnly = false;
      projectName.style.border = `1px solid ${project.textColor}`;
    });
    projectName.addEventListener('blur', () => {
      projectName.readOnly = true;
      projectName.style.border = 0;
      projects.editProjectName(project, projectName.value);
    });
    projectTitle.insertBefore(projectName, back);
  }

  // Change the color of objects in a project
  function changeColor(project) {
    content.style.backgroundColor = project.backgroundColor;
    const texts = document.querySelectorAll('.text');
    const subtexts = document.querySelectorAll('.subtext');
    texts.forEach(text => {
      text.style.color = project.textColor;
    });
    subtexts.forEach(subtext => {
      subtext.style.color = project.backgroundColor;
      subtext.style.filter = `brightness(${project.subtextBrightness})`;
    });
  }


  return { loadInitial };
})();

export { manipulateDOM }