import { relationHandler, storageHandler } from './handler.js'; 
import { projects } from './projects.js';

const manipulateDOM = (function () {
  // Add elements that will be used througout most DOM manipulations

  // Grid related items
  const content = document.querySelector('#content');
  const listTitle = document.querySelector('#list-title');
  const projectList = document.querySelector('#project-list');
  const projectTitle = document.querySelector('#project-title');
  const projectContent = document.querySelector('#project-content');

  // Project list related
  const addProject = document.querySelector('#add-project');

  // Project related
  const projectName = document.querySelector('#project-name');
  const back = document.querySelector('#back');
  const colorButtons = document.querySelectorAll('.color-button');
  const todoList = document.querySelector('#todo-list');
  const addContainer = document.querySelector('#add-container');
  const addTodo = document.querySelector('#add-todo');
  const deleteProject = document.querySelector('#delete-project');

  // Todo related
  const creatorContainer = document.querySelector('#creator-container');
  const addTodoForm = document.querySelector('#add-todo-form');
  const cancel = document.querySelector('#cancel-button');


  // Set the default background color
  const defaultBG = '#F4F0BB';
  let currentProject;

  // Event Handlers on project list
  addProject.addEventListener('click', () => {
    addNewProject('New Project');
  });

  // Event Handlers in project content
  projectName.addEventListener('mouseover', () => {
    projectName.style.filter =  currentProject.textColor === '#000000' ? 'brightness(70%)' : 'brightness(130%)'
  });

  projectName.addEventListener('mouseout', () => {
    projectName.style.filter = `brightness(100%)`;
  });

  projectName.addEventListener('click', () => {
    projectName.readOnly = false;
    projectName.style.border = `1px solid ${currentProject.textColor}`;
  });

  projectName.addEventListener('blur', () => {
    projectName.readOnly = true;
    projectName.style.border = '1px solid transparent';
    projects.editProjectName(currentProject, projectName.value);
  });

  back.addEventListener('click', () => {
    closeProject();
  });

  colorButtons.forEach(button => {
    button.addEventListener('click', () => {
      projects.editProjectColor(currentProject, button.dataset.color);
      changeColor();
    });
  });

  addTodo.addEventListener('click', () => {
    addTodo.style.display = 'none';
    creatorContainer.style.display = 'block';
  });

  deleteProject.addEventListener('click', () => {
    if (confirm("Delete this project?")) {
      relationHandler.removeProject(currentProject.id);
      closeProject()
    } 
  });

  // Event Handlers for Todo Creator
  addTodoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const todoData = new FormData(addTodoForm);
    const title = todoData.get("title") || null;
    const priority = todoData.get("priority") || null;
    const description = todoData.get("description") || null;
    const date = todoData.get("date") || null;
    if (!title) {
      alert('Please set a title for your todo item.');
      return;
    } else if (!priority) {
      alert('Please set the priority for your todo item.');
      return;
    }
    relationHandler.addTodo(currentProject.id, title, priority, description, date, false, null);
    loadTodo();
    closeAddTodo();
  });

  cancel.addEventListener('click', () => {
    closeAddTodo();
  });

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


  // Add a new project, as opposed to adding an existing project
  function addNewProject(name) {
    // Use the relationhandler to create the project with the desired name
    const project = relationHandler.addProject(name);

    // Create the project button
    const button = createProjectButton(project);

    // Append the button before the add button, so the add button is always last
    projectList.insertBefore(button, addProject);
  }

  // Create the button for the project
  function createProjectButton(projectData) {
      // Unpack the project object: 
      const { project, todoArray, checked, total } = projectData;
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
        openProject(project, todoArray);
      });
    return button;
  }

  function createTodoElement(todo) {
    const div = document.createElement('div');
    div.classList.add('todo-container');
    const title = document.createElement('div');
    title.classList.add('todo-title');
    title.textContent = todo.title;
    div.appendChild(title);
    todoList.insertBefore(div, addContainer);
  }

  // Open a project 
  function openProject(project, todoArray) {
    currentProject = project;
    projectName.value = currentProject.name;

    // Load the todos
    loadTodo(todoArray);
    // Change the colors to the colors of the project, 
    changeColor();

    // Set to display the project name, hide the project list and show the project
    projectList.style.display = 'none';
    listTitle.style.display = 'none';
    projectContent.style.display = 'grid';
    projectTitle.style.display = 'flex';
  }

  function closeProject() {
    // Reload project list before going back (something may have changed)
    loadInitial();

    // Set background color to default
    content.style.backgroundColor = defaultBG;

    // Close and reset add form just in case
    addTodoForm.reset();
    creatorContainer.style.display = 'none';
    addTodo.style.display = 'block';

    // Show the list and hide the rest
    projectList.style.display = 'grid';
    listTitle.style.display = 'flex';
    projectContent.style.display = 'none';
    projectTitle.style.display = 'none';
  }

  // Load the todo items and put them on the page
  function loadTodo(todoArray=null) {
    if (!todoArray) {
      todoArray = relationHandler.getTodoArray(currentProject.id);
    }
    Array.from(todoList.children).forEach(child => {
      if (child !== addContainer) {
        todoList.removeChild(child);
      } 
    });
    todoArray.forEach(todo => {
      createTodoElement(todo);
    });
  }

  function closeAddTodo() {
    addTodoForm.reset();
    creatorContainer.style.display = 'none';
    addTodo.style.display = 'block';
  }

  // Change the color of objects in a project
  function changeColor() {
    // Change background color for content and projectname
    content.style.backgroundColor = currentProject.backgroundColor;
    projectName.style.backgroundColor = currentProject.backgroundColor;

    // Get all texts and subtexts and change their color
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