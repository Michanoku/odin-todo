const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();

  class Project {
    constructor(name) {
      this.id = crypto.randomUUID();
      this.name = name;
    }
  }

  function createProject(name) {
    const project = new Project(name);
    projectsArray.push(project);
    return project;
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

  return { createProject, deleteProject, getAllProjects, getProject, editProjectName };
})();

export { projects }