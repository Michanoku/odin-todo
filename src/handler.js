import { projects } from './projects.js';
import { todos } from './todos.js';
import { manipulateDOM } from './interface.js';

const relationHandler = (function() {
  const relations = new Object();

  function addProject(name) {
    const newProjectId = projects.createProject(name);
    relations[newProjectId] = new Array();
    manipulateDOM.addProject(projects.getProject(newProjectId));
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

  return { addProject, addTodo, removeProject, removeTodo }
})();

export { relationHandler }