import { projects } from './projects.js';
import { todos } from './todos.js';

// Handle the saving and loading from storage
const storageHandler = (function () {

  // Load the data upon page load, either create new data or load old data
  function loadInitial() {
    if (!localStorage.getItem("projects")) {
      // If no data exists, create default project and save
      relationHandler.addProject("Default");
      saveData();
    } else {
      // Load user data and populate arrays based on user data
      const data = loadData();
      projects.setProjects(data.projects);
      todos.setTodo(data.todo);
      relationHandler.setRelations(data.relations);
    }
    // Load the current relations and create an array of projects to load initially
    const initialRelations = relationHandler.getRelations();
    const initialProjects = new Array();
    for (const projectId in initialRelations) {
      initialProjects.push(relationHandler.getProject(projectId));
    }
    return initialProjects;
  }

  // This function saves the user data to the localstorage. Call it whenever a change is made.
  function saveData() {
    localStorage.setItem('projects', JSON.stringify(projects.getAllProjects()));
    localStorage.setItem('todo', JSON.stringify(todos.getAllTodo()));
    localStorage.setItem('relations', JSON.stringify(relationHandler.getRelations()));
  }

  // This function loads the user data. This happens on page load
  function loadData() {
    const data = {
      projects: JSON.parse(localStorage.getItem('projects')),
      todo: JSON.parse(localStorage.getItem('todo')),
      relations: JSON.parse(localStorage.getItem('relations')),
    }
    return data
  }

  return { loadInitial, saveData }
})();

// This handles the relationship between projects and todos
const relationHandler = (function() {

  // Initiate the relations object that stores the relations
  const relations = new Object();

  // The function to add a project calls projects to create it and adds it to the relations array
  function addProject(name) {
    const newProject = projects.createProject(name);
    relations[newProject.id] = new Array();
    // Save the user data
    storageHandler.saveData();
    // Return the project so it can be used 
    return {project: newProject, todo: new Array(), total: 0, checked: 0};
  }
  
  // The function to add a todo calls the todos to create it and adds it to the relations array
  function addTodo(projectId, title, description, dueDate, priority, notes, checklist) {
    const newTodo = todos.createTodo(title, description, dueDate, priority, notes, checklist);
    relations[projectId].push(newTodo.id);
    // Save the user data
    storageHandler.saveData();
    return newTodo;
  };

  // The function to remove a project. 
  function removeProject(projectId) {
    // Check the relations array for todos and delete all of them
    const project = relations[projectId];
    for (const todo in project) {
      todos.deleteTodo(todo);
    };
    // Delete the project from relations
    const projectIndex = relations.indexOf(project);
    relations.splice(projectIndex, 1);
    // Delete the project from the projects array
    projects.deleteProject(projectId)
    // Save the user data
    storageHandler.saveData();
  }
  
  // The function to remove a Todo
  function removeTodo(projectId, todoId) {
    // Get the project from the project array, and erase the todo from the project todo array
    const project = relations[projectId];
    const todoIndex = project.findIndex((todo) => todo.id === todoId);
    project.splice(todoIndex, 1);

    // Delete the todo from the global todo array
    todos.deleteTodo(todoId);
    // Save the user data
    storageHandler.saveData();
  };

  // The function to return data from a project
  function getProject(projectId) {
    // Get the project and the relations via the id
    const project = projects.getProject(projectId);
    const projectRelations = relations[projectId];

    // Create an array of todos of this project
    const projectTodo = new Array();
    for (const todoId in projectRelations) {
      const todo = todos.getTodo(todoId);
      projectTodo.push(todo);
    };

    // Check how many todos exist and how many are checked
    const total = projectTodo.length;
    const checked = projectTodo.filter(todo => todo.checked).length;

    // Return the project, the todo list and total and checked todo amounts
    return {project: project, todo: projectTodo, total: total, checked: checked};
  }

  // This function simply returns the relations as they are
  function getRelations() {
    return relations;
  }

  /* 
  This function removes existing relations and sets new ones.
  Currently only used on page load, so technically deletion is not necessary.
  I want to keep it for now in case I change my mind later.
  */
  function setRelations(storedRelations) {
    Object.keys(relations).forEach(project => delete relations[project]);
    Object.keys(storedRelations).forEach(project => relations[project] = storedRelations[project]);
  }

  return { addProject, addTodo, removeProject, removeTodo, getProject, getRelations, setRelations }
})();

export { relationHandler, storageHandler }