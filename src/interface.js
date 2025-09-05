import { relationHandler, storageHandler } from './handler.js'; 
import { projects } from './projects.js';
import { todos } from './todos.js';

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

  // Mouse over the project name shows the user its editable
  projectName.addEventListener('mouseover', () => {
    const percent = currentProject.textColor === '#000000' ? '70%' : '130%';
    projectName.style.filter = `brightness(${percent})`;
  });

  projectName.addEventListener('mouseout', () => {
    projectName.style.filter = `brightness(100%)`;
  });

  // Clicking the name makes it editable, clicking away saves the change
  projectName.addEventListener('click', () => {
    projectName.readOnly = false;
    projectName.style.border = `1px solid ${currentProject.textColor}`;
  });

  projectName.addEventListener('blur', () => {
    projectName.readOnly = true;
    projectName.style.border = '1px solid transparent';
    projects.editProjectName(currentProject, projectName.value);
  });

  // The button to close a project and go back to project list
  back.addEventListener('click', () => {
    closeProject();
  });

  // Color buttons change the backgroundcolor and color of a project
  colorButtons.forEach(button => {
    button.addEventListener('click', () => {
      projects.editProjectColor(currentProject, button.dataset.color);
      changeColor();
    });
  });

  // Using the addtodo button will open the add todo dialog
  addTodo.addEventListener('click', () => {
    addTodo.style.display = 'none';
    creatorContainer.style.display = 'block';
  });

  deleteProject.addEventListener('click', () => {
    if (confirm('Delete this project?')) {
      relationHandler.removeProject(currentProject.id);
      closeProject()
    } 
  });

  // Event Handlers for Todo Creator
  addTodoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get all form data first
    const todoData = new FormData(addTodoForm);
    const title = todoData.get('title') || null;
    const priority = todoData.get('priority') || null;
    const description = todoData.get('description') || null;
    const date = todoData.get('date') || null;
    
    /* 
    Prompt the user to at least enter title and priority
    This should be taken care of by html, but just to be sure
    */
    if (!title) {
      alert('Please set a title for your todo item.');
      return;
    } else if (!priority) {
      alert('Please set the priority for your todo item.');
      return;
    }

    relationHandler.addTodo(
      currentProject.id, 
      title, 
      priority, 
      description, 
      date, 
      false, 
      null
    );

    // Once the todo is added, reload all todos (so it can be displayed)
    loadTodo();
    // Change the color of the newly added items to the current color setting
    changeColor();
    // Close the add dialog
    closeAddTodo();
  });

  // If the user clicks cancel when adding
  cancel.addEventListener('click', () => {
    // Close the add dialog
    closeAddTodo();
  });

  // The function to load the initial content, either existing or new
  function loadInitial() {
    // Remove all children besides the last button from the project list
    Array.from(projectList.children).forEach(child => {
      if (child !== addProject) {
        projectList.removeChild(child);
      } 
    });
    
    /*
    Ask storageHandler to load the data. 
    If no data exists, storageHandler will create initial data
    */
    const initialProjects = storageHandler.loadInitial();

    // For each project the handler returned, create the button and add it
    initialProjects.forEach(projectData => {
      // Create the project button
      const button = createProjectButton(projectData);

      // Append the button before the add button, so the add button is last
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

    // Create the elements and add classes and attributes

    // The container to house all items
    const container = document.createElement('div');
    container.classList.add('todo-container');
    container.dataset.expanded = 'false';

    // The row to house checkbox, title and date
    const flexRow = document.createElement('div');
    flexRow.classList.add('todo-flex-row', 'text');

    // The checkbox to check or uncheck a todo item
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    // The column that houses the title and due date
    const flexColumn = document.createElement('div');
    flexColumn.classList.add('todo-flex-column');

    // The title of the todo item
    const title = document.createElement('div');
    title.classList.add('todo-title', 'text');

    // The due date of the todo item
    const dueDate = document.createElement('div');
    dueDate.classList.add('todo-date', 'subtext');

    // The description under the row, invisible at first
    const description = document.createElement('div');
    description.classList.add('todo-description', 'text');

    // The button container for edit buttons, invisible at first
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('todo-button-container');

    // The input fields and buttons to edit todo item content
    const editPriority = document.createElement('select');
    editPriority.classList.add('todo-edit-input');

    const editDate = document.createElement('input');
    editDate.type = 'date';
    editDate.classList.add('todo-edit-input');

    const editTitle = document.createElement('button');
    editTitle.classList.add('todo-button', 'todo-edit-button');
    editTitle.textContent = 'Edit Title';

    const editDescription = document.createElement('button');
    editDescription.classList.add('todo-button', 'todo-edit-button');
    editDescription.textContent = 'Edit Description';

    const deleteTodo = document.createElement('button');
    deleteTodo.classList.add('todo-button', 'todo-delete-button');
    deleteTodo.textContent = 'Delete Todo';

    // Hidden input fields that will be shown when the edit buttons are pushed
    const titleInput = document.createElement('input');
    titleInput.classList.add('todo-creator', 'edit-input', 'edit-title-input');
    titleInput.type = 'text';
    titleInput.maxLength = 64;
    titleInput.value = todo.title;

    const descriptionInput = document.createElement('textarea');
    descriptionInput.classList.add('todo-creator', 'edit-input', 'edit-description-input');
    descriptionInput.rows = 2;
    descriptionInput.maxLength = 256;
    descriptionInput.value = todo.description;

    // A hidden confirm button to confirm input on the hidden input elements
    const confirmEditContainer = document.createElement('div');
    confirmEditContainer.classList.add('confirm-edit-container');
    const confirmEdit = document.createElement('button');
    confirmEdit.classList.add('todo-button', 'todo-edit-button', 'confirm-edit');
    confirmEdit.textContent = 'Save';

    // Add data to the fields
    title.textContent = todo.title;
    checkbox.checked = todo.checked;
    checkbox.dataset.priority = todo.priority;
    dueDate.textContent = todo.dueDate ? `Due: ${todo.dueDate}` : 'Due: No date';
    description.textContent = todo.description;
    editDate.value = todo.dueDate;

    // Add options to the priority input and select the current priority
    const options = ['Low', 'Normal', 'High'];
    options.forEach(option => {
      const temp = document.createElement('option');
      temp.value = option;
      temp.textContent = option;
      if (todo.priority === option) {
        temp.selected = true;
      }
      editPriority.appendChild(temp);
    })

    // Add Listeners
    checkbox.addEventListener('change', () => {
      todos.toggleTodo(todo, checkbox.checked)
    });

    // If the column is clicked, expand and show the hidden data
    flexColumn.addEventListener('click', () => {
      const expanded = container.dataset.expanded === 'true';
      container.style.maxHeight = expanded ? '3rem' : '50rem';
      container.dataset.expanded = expanded ? 'false' : 'true';
    });

    // Priority and date are edited upon change, no need for a confirm button
    editPriority.addEventListener('change', () => {
      todos.editPriority(todo, editPriority.value);
      checkbox.dataset.priority = todo.priority;
    });

    editDate.addEventListener('change', () => {
      todos.editDate(todo, editDate.value);
      dueDate.textContent = todo.dueDate ? `Due: ${todo.dueDate}` : 'Due: No date';
    });

    // Title and description need an input field, so open them when needed
    editTitle.addEventListener('click', () => {
      buttonContainer.style.display = 'none';
      titleInput.style.display = 'block';
      confirmEditContainer.style.display = 'flex';
      confirmEdit.dataset.edit = 'title';
      titleInput.focus();
    });

    editDescription.addEventListener('click', () => {
      buttonContainer.style.display = 'none';
      descriptionInput.style.display = 'block';
      confirmEditContainer.style.display = 'flex';
      confirmEdit.dataset.edit = 'description';
      descriptionInput.focus();
    });

    // Once an edit is made and the confirm button pushed, set it
    confirmEdit.addEventListener('click', () => {
      if (confirmEdit.dataset.edit === 'title') {
        // If the user wants to edit title, force an input
        if (!titleInput.value) {
          alert('Please set a title for your todo item.');
        } else {
          // Set the data and hide the input
          todos.editTitle(todo, titleInput.value);
          title.textContent = todo.title;
          titleInput.style.display = 'none';
        }
      } else {
        // Set the data and hide the input
        todos.editDescription(todo, descriptionInput.value);
        description.textContent = todo.description;
        descriptionInput.style.display = 'none';
      }
      // Hide the button and show the edit button container
      confirmEditContainer.style.display = 'none';
      buttonContainer.style.display = 'flex';
    });

    // Delete the todo via confirm dialog
    deleteTodo.addEventListener('click', () => {
      if (confirm('Delete this todo?')) {
        relationHandler.removeTodo(currentProject.id, todo.id);
        // Reload todo list and set appropriate color
        loadTodo();
        changeColor();
      } 
    });

    // Append the elements
    flexColumn.append(title, dueDate);
    flexRow.append(checkbox, flexColumn);
    buttonContainer.append(
      editPriority, 
      editDate, 
      editTitle, 
      editDescription, 
      deleteTodo
    );
    confirmEditContainer.appendChild(confirmEdit);
    container.append(
      flexRow, 
      description, 
      titleInput, 
      descriptionInput, 
      confirmEditContainer, 
      buttonContainer
    );
    todoList.insertBefore(container, addContainer);
  }

  // Open a project 
  function openProject(project, todoArray) {
    // Set the current project variable so all other functions can use it
    currentProject = project;

    // Set to show the current project name
    projectName.value = currentProject.name;

    // Load the todos
    loadTodo(todoArray);
    // Change the colors to the colors of the project, 
    changeColor();

    // Set to display the project name, hide the list and show the project
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
    // If no todo array was provided, load the current array 
    if (!todoArray) {
      todoArray = relationHandler.getTodoArray(currentProject.id);
    }
    // Remove all current todo items before replacing them with the new array
    Array.from(todoList.children).forEach(child => {
      // Do not remove the add dialog container
      if (child !== addContainer) {
        todoList.removeChild(child);
      } 
    });
    // Create the element for each todo in the array
    todoArray.forEach(todo => {
      createTodoElement(todo);
    });
  }

  // Closing the add dialog
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