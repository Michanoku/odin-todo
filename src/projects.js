const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();

  class Project {
    constructor(name) {
      this.id = crypto.randomUUID();
      this.name = name;
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
    const project = getProject(projectId);
    project.name = newName;
  };


  // MAY make a separate handler for this and outsource it to a third location, to link projects and
  // todos through that.
  function addTodo(projectId, todoId) {
    const project = getProject(projectId);
    project.todo.append(todoId);
  };

  function removeTodo(projectId, todoId) {
    const project = getProject(projectId);
    const todoIndex = project.todo.findIndex((todo) => todo.id === todoId);
    project.todo.splice(todoIndex, 1);
  };

  return { createProject, deleteProject, getAllProjects, getProject, editProjectName, addTodo, removeTodo };
})();