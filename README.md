# Odin Todo

The Odin Project Todo List

---

## Live Demo
[Click here to play](https://michanoku.github.io/odin-todo) 

---

## Added features
- Create projects
- Show projects in project list with title, color and checked / total todo items
- Open / Close projects from the list
- Edit project names
- Edit project colors (text color will adjust accordingly)
- Delete projects
- Create todo items in projects (set title, description, date Due and priority)
- Show todo items in projects with their priority, title and due date
- Click todo items to show description and options for editing
- Edit todo items: Edit priority, due date, title, description
- Delete todo items
- Data is saved in localstorage upon every change and reloaded when needed

---

## Planned Features

- Add notes to todo items
- Be able to erase or edit notes
- Add checklist to todo items
- Add checklist items to checklists
- Be able to erase or edit and check checklist items
- Download your data as a CSV and upload it again to restore
- Sort todo items by priority, due date or creation order
- 100% compatibility for mobile and desktop

## Objectives

- Strengthen knowledge of modular JavaScript and IIFE patterns
- Use factory functions and IIFE to separate DOM and different Todo functions
- Experiment with CSS grid/flexbox layouts
- Try to be more mobile minded (That was not so important in this course so far)

---

## Built With
- HTML5
- CSS3 (Flexbox/Grid)
- JavaScript (ES6+)
- Webpack

---

## Thoughts on the Project

The initial project outline seemed simple enough, however after 
making a plan in my head about how to proceed I quickly found that
my own idea may be a bit too complicated for the scope of this 
project. Nevertheless, I decided to challenge myself. 

This is why this project took me a long time to complete, and I 
eventually decided against adding some of the features I wanted, as
they fall out of the scope of this project or don't enable me to 
learn more instead of just being some more busywork. 

Initially, I wanted to make it simple with project names in a list and 
todo items below, that you can hide or show, somewhat like bootstrap
accordions or dropdowns. But while planning, I had the idea of making it
very simple and easy to visually process. So I came up with the idea 
of just making large buttons for projects, that only have basic information 
such as name and amount of todo items, and leave all the other info inside. 
To keep it simple, I also kept the button to add another project in the 
same style. 

Creating a new project is as simple as just pressing the button. A pre-set
project will be created and the user can then go into and change the title 
and color and add todo items to it. I found this simple to use but somewhat 
hard to code at first. 

As far as opening a project goes, I really wanted to have some sort of quick 
animation where the button seems to expand over the whole project list area 
and make it seem like it becomes the background for the project contents, 
(by hiding the button when it covers the area and setting the bg to the 
button color) but after some tinkering I could not get it to work right. 
The issue was that the buttons are in a grid, and depending on the button 
position, if I want it to fill out the screen, it would need to break out 
of the grid. I tried setting it to absolute or making a copy of the button
in an absolute position to achieve the effect, but in the end it didn't look 
good. I abandoned the idea to not waste time on the project, but I would 
like to know at some point how I could have done this.

The biggest challenge in this project was to handle arrays and objects and 
reading and storing their data constantly and reliably, and then setting 
and getting the correct data from localstorage.

I did enjoy this project and I feel like I have an okay solution, even though 
I definitely like the way I handled projects more than the way I handled todo 
items. But because I spent way too much time on perfecting projects, I decided
to just fulfill the project conditions for now and move on with the course.

I would like to revisit this project sometime, especially to add some features
that I had mapped out but decided not to pursue for now.

---

## Future considerations

### Adding notes to todo items

This could be easily done with another object that
stores an array of notes under the key of the todo items id, much like projects
and todo relations are handled now. Because it's basically the same as something
I already did, I'm not going to spend time on it now.

---

### Adding checklists to todo items. 

In the same way, adding a checklist to a todo item
and then using an array in an object just like before to connect the checklist items
with the todo item could be implemented in time, but would not add much in learning
value for this current project. 

---

### Export and import user data. 

Getting the current user data and saving it to a CSV
file or similar, and allowing the user to replace the current data with data from 
a csv file would pose an interesting challenge. I have done this in python but never
in pure JavaScript. However, I feel like this may be a challenge reserved for later, to
not explode the scope. 

---

### Sorting of todo items within the project. 

Being able to sort todo items by due date,
priority or just creation order would be useful for users. It would involve
adding more buttons to the project and creating some array functions to sort the 
todo item array by these conditions. The current sort order could be saved
as an additional value to the project and then be loaded again when the project is
opened, so the user always has their desired sorting for every project.
Replacing the todo list is trivial as the function already exists, but again, 
it would be mostly busywork to implement this now so I am deciding against it for now. 