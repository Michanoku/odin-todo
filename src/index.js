import "./styles.css";
import { manipulateDOM } from './interface.js';

/* 
Call manipulateDOM to load the initial data.
If the user is recurring, this will load their projects and todo.
*/
manipulateDOM.loadInitial();