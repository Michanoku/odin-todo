const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();
  const defaultBG = 'B8BDB5';


  class Project {
    constructor(name) {
      this.id = crypto.randomUUID();
      this.name = name;
      this.color = defaultBG;
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

  function setProjects(storedArray) {
    projectsArray.push(...storedArray);
  }

  function getProject(projectId) {
    return projectsArray.find((project) => project.id === projectId);
  };

  function editProjectName(projectId, newName) {
    const project = getProject(projectId);
    project.name = newName;
  };

  return { createProject, deleteProject, getAllProjects, setProjects, getProject, editProjectName };
})();

export { projects }