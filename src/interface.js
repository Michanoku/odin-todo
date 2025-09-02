import { relationHandler, storageHandler } from './handler.js'; 
import { projects } from './projects.js';

const manipulateDOM = (function () {
  // Add elements that will be used througout most DOM manipulations
  const content = document.querySelector('#content');
  const listTitle = document.querySelector('#list-title');
  const projectList = document.querySelector('#project-list');
  const projectTitle = document.querySelector('#project-title');
  const projectContent = document.querySelector('#project-content');
  const addProject = document.querySelector('#add-project');
  const addTodo = document.querySelector('#add-todo');
  const back = document.querySelector('#back');
  const colorButtons = document.querySelectorAll('.color-button');
  const addContainer = document.querySelector('#add-container');
  const creatorContainer = document.querySelector('#creator-container');
  const projectId = document.querySelector('#project-id');
  const cancel = document.querySelector('#cancel-button');
  const addTodoForm = document.querySelector('#add-todo-form');

  // Set the default background color
  const defaultBG = '#F4F0BB';
  let currentProject;

  // Event handler to add a project button to the content container
  addProject.addEventListener('click', () => {
    addNewProject("New Project");
  });

  addTodo.addEventListener('click', () => {
    todoCreator();
  });

  colorButtons.forEach(button => {
    button.addEventListener('click', () => {
      projects.editProjectColor(currentProject, button.dataset.color);
      changeColor();
    });
  });

  // Event handler for the button to go back to the project list
  back.addEventListener('click', () => {
    // Reload project list before going back (something may have changed)
    loadInitial();
    // Set background color to default
    content.style.backgroundColor = defaultBG;

    // Remove elements that will be added when projects are opened
    projectTitle.removeChild(projectTitle.firstElementChild);

    // Show the list and hide the rest
    projectList.style.display = 'grid';
    listTitle.style.display = 'flex';
    projectContent.style.display = 'none';
    projectTitle.style.display = 'none';
  });

  cancel.addEventListener('click', () => {
    addTodoForm.reset();
    const addButton = document.querySelector('#add-todo');
    creatorContainer.style.display = 'none';
    addButton.style.display = 'block';
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
        openProject(project, todo);
      });
    return button;
  }

  // Open a project 
  function openProject(project, todo) {
    currentProject = project;
    // Change the colors to the colors of the project, 
    changeColor();
    addInput();
    // Set to display the project name, hide the project list and show the project
    projectList.style.display = 'none';
    listTitle.style.display = 'none';
    projectContent.style.display = 'grid';
    projectTitle.style.display = 'flex';
  }

  // Add color buttons to a project
  function addInput() {

    // Create the projectName input to change the name of the project
    const projectName = document.createElement("input");
    projectName.className = "text";
    projectName.type = "text";
    projectName.value = currentProject.name;
    projectName.readOnly = true;
    projectName.id = "project-name";
    projectName.style.color = currentProject.textColor;

    // Add one EventListener for click and one for blur
    projectName.addEventListener('click', () => {
      projectName.readOnly = false;
      projectName.style.border = `1px solid ${currentProject.textColor}`;
    });
    projectName.addEventListener('blur', () => {
      projectName.readOnly = true;
      projectName.style.border = 0;
      projects.editProjectName(currentProject, projectName.value);
    });
    projectTitle.insertBefore(projectName, back);
  }

  // Create the input to create todos
  function todoCreator() {
    addTodo.style.display = 'none';

    creatorContainer.style.display = 'block';
    projectId.value = currentProject.id;

    // Add Needed Event Listeners
  }

  // Change the color of objects in a project
  function changeColor() {
    content.style.backgroundColor = currentProject.backgroundColor;
    const texts = document.querySelectorAll('.text');
    const subtexts = document.querySelectorAll('.subtext');
    texts.forEach(text => {
      text.style.color = currentProject.textColor;
    });
    subtexts.forEach(subtext => {
      subtext.style.color = currentProject.backgroundColor;
      subtext.style.filter = `brightness(${currentProject.subtextBrightness})`;
    });
  }


  return { loadInitial };
})();

export { manipulateDOM }