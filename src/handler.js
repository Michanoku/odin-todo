import { projects } from './projects.js';
import { todos } from './todos.js';

const storageHandler = (function () {
  function loadInitial() {
    if (!localStorage.getItem("projects")) {
      relationHandler.addProject("Default");
      localStorage.setItem('projects', JSON.stringify(projects.getAllProjects()));
      localStorage.setItem('todo', JSON.stringify(todos.getAllTodo()));
      localStorage.setItem('relations', JSON.stringify(relationHandler.getRelations()));
    } else {
      const storedArray = JSON.parse(localStorage.getItem('projects'));
      const storedTodo = JSON.parse(localStorage.getItem('todo'));
      const storedRelations = JSON.parse(localStorage.getItem('relations'));
      projects.setProjects(storedArray);
      todos.setTodo(storedTodo);
      relationHandler.setRelations(storedRelations);
    }
    const currentRelations = relationHandler.getRelations();
    const currentProjects = new Array();
    for (const projectId in currentRelations) {
      currentProjects.push(relationHandler.getProject(projectId));
    }
    return currentProjects;
  }

  return { loadInitial }
})();

const relationHandler = (function() {
  const relations = new Object();

  function addProject(name) {
    const newProject = projects.createProject(name);
    relations[newProject.id] = new Array();
    return {project: newProject, todo: new Array(), total: 0, checked: 0};
  }
  
  function addTodo(projectId, title, description, dueDate, priority, notes, checklist) {
    const newTodoId = todos.createTodo(title, description, dueDate, priority, notes, checklist);
    relations[projectId].push(newTodoId);
  };

  function removeProject(projectId) {
    const project = relations[projectId];
    for (const todo in project) {
      todos.deleteTodo(todo);
    };
    const projectIndex = relations.indexOf(project);
    relations.splice(projectIndex, 1);
  }
  
  function removeTodo(projectId, todoId) {
    const project = relations[projectId];
    const todoIndex = project.findIndex((todo) => todo.id === todoId);
    project.splice(todoIndex, 1);
    todos.deleteTodo(todoId);
  };

  function getProject(projectId) {
    const project = projects.getProject(projectId);
    const projectRelations = relations[projectId];
    const projectTodo = new Array();
    for (const todoId in projectRelations) {
      const todo = todos.getTodo(todoId);
      projectTodo.push(todo);
    };
    const total = projectTodo.length;
    const checked = projectTodo.filter(todo => todo.checked).length;

    return {project: project, todo: projectTodo, total: total, checked: checked};
  }

  function getRelations() {
    return relations;
  }

  function setRelations(storedRelations) {
    Object.keys(relations).forEach(project => delete relations[project]);
    Object.keys(storedRelations).forEach(project => relations[project] = storedRelations[project]);
  }

  return { addProject, addTodo, removeProject, removeTodo, getProject, getRelations, setRelations }
})();

export { relationHandler, storageHandler }