import { projects } from './projects.js';
import { todos } from './todos.js';

const relationHandler = (function() {
  const relations = new Object();

  function addProject(name) {
    const newProject = projects.createProject(name);
    relations[newProject.id] = new Array();
    return newProject;
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

    return {project: project, todo: projectTodo};
  }

  return { addProject, addTodo, removeProject, removeTodo, getProject }
})();

export { relationHandler }