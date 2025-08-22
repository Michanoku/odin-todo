const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();

  class Project {
    constructor(name) {
      this.name = name;
      this.id = crypto.randomUUID();
      // All todo objects will go in here
      this.todo = new Array();
    }
  }

  function createProject(name) {
    projectsArray.append(new Project(name));
  };

  function deleteProject(projectId) {
    const projectIndex = projectsArray.findIndex((project) => project.id === projectId);
    projectsArray.splice(todoIndex, 1);
  }

  function getAllProjects() {
    return projectsArray;
  };

  function getProject(projectId) {
    return projectsArray.find((project) => project.id === projectId);
  };

  function editProjectName(projectId, newName) {
    const project = projectsArray.find((project) => project.id === projectId);
    project.name = newName;
  };

  function addTodo(projectId, todo) {
    const project = projectsArray.find((project) => project.id === projectId);
    project.todo.append(todo);
  };

  function removeTodo(projectId, todoId) {
    const project = projectsArray.find((project) => project.id === projectId);
    const todoIndex = project.todo.findIndex((todo) => todo.id === todoId);
    project.todo.splice(todoIndex, 1);
  };

  return { createProject, deleteProject, getAllProjects, getProject, editProjectName, addTodo, removeTodo }
})();