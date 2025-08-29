import { storageHandler } from './handler.js';

const projects = (function () {

  // Create array to house all projects
  let projectsArray = new Array();
  // Set the default background color for new projects
  const defaultBG = '#f5f5f5';

  // The project class. Works with just a name. Color and ID are optional.
  class Project {
    constructor(name, backgroundColor = defaultBG, id = null) {
      this.id = id ?? crypto.randomUUID();
      this.name = name;
      this._backgroundColor = backgroundColor;
      this._backgroundType = this.calculateBackgroundType(backgroundColor);
    }

    // Calculate if the background is dark or light based on the hex value 
    // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area 
    calculateBackgroundType(color) {
      const red = parseInt(`${color[1]}${color[2]}`, 16);
      const green = parseInt(`${color[3]}${color[4]}`, 16);
      const blue = parseInt(`${color[5]}${color[6]}`, 16);
      const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
      return brightness < 128 ? 'dark' : 'light';
    }

    get backgroundColor() {
      return this._backgroundColor;
    }

    // Set the background color and calculate the type
    set backgroundColor(color) {
      this._backgroundColor = color;
      this._backgroundType = this.calculateBackgroundType(color);
    }

    // If the background is light, return black, if not white text color
    get textColor() {
      return this._backgroundType === 'light' ? '#000000' : '#f5f5f5';
    }

    // If the background is light, darken it, if its dark, brighten it (to use for hover)
    get subtextBrightness() {
      return this._backgroundType === 'light' ? '50%' : '400%';
    }
  }

  // Create a project and add it to the array, then return it
  function createProject(name, backgroundColor = defaultBG, id = null) {
    const project = new Project(name, backgroundColor, id);
    projectsArray.push(project);
    return project;
  };

  // Delete a project from the array
  function deleteProject(projectId) {
    const projectIndex = projectsArray.findIndex((project) => project.id === projectId);
    projectsArray.splice(projectIndex, 1);
  }

  // Return all projects
  function getAllProjects() {
    return projectsArray;
  };

  // Set all projects by creating them from data
  function setProjects(storedArray) {
    projectsArray = new Array();
    for (const project in storedArray) {
      createProject(storedArray[project].name, storedArray[project]._backgroundColor, storedArray[project].id);
    }
  }

  // Get a specific project by its ID
  function getProject(projectId) {
    return projectsArray.find((project) => project.id === projectId);
  };

  // Edit the project name
  function editProjectName(project, newName) {
    project.name = newName;
    storageHandler.saveData();
  };

  // Edit the color of the project (This is used when the project has already previously been received)
  function editProjectColor(project, color) {
    project.backgroundColor = color;
    storageHandler.saveData();
  }

  return { createProject, deleteProject, getAllProjects, setProjects, getProject, editProjectName, editProjectColor };
})();

export { projects }