"use strict";

/*
   Notes
      prop notes 
         an object that holds other objects with two properties: title and body.

      prop index 
         an integer used to indexed the identifier of notes prop. 

      prop add 
         A methods that adds a new note inside notes prop.

      prop remove 
      Methods that removes a note in notes prop.
*/

let notes = (function() {
   let notesSaved = {};     // holds the user's notes 
   let index = 1;           // used to index the identifier of a note inside notesSaved
   const getNotes = function() { // returns notesSaved
      return notesSaved;
   };
   const add = function(title = "", body = "") { // creates a new object inside notesSaved
      title = String(title);
      body = String(body);

      if (title !== "" && title.length > 1 && body !== "" && body.length > 1) {
         notesSaved[index] = { title, body };
         index++;
      }

      return this;
   };
   const remove = function(index = null) { // removes a note inside notesSaved
      if (!index || !Number(index)) return this;
      delete notesSaved[index];
      return this;
   }
   const saveNotes = function() {
      // check if localStorage exists
      if (!window.localStorage) {
         // save notes in localStorage
         let data = {
            notes: notesSaved,
            index: index,
         };

         localStorage.setItem("notes", JSON.stringify(data));
      } else {
         // save notes inside a cookie
         let data = JSON.stringify(this.getNotes());
         document.cookie = `notes=${data}`;
      }
   };

   return {
      getNotes,
      add,
      remove,
      saveNotes,
   };
})();

notes.add("note 1", "# note 1 ## About this note...")
     .add("note 2", "# note 3 ## About this note...")
     .add("note 3", "# note 3 ## About this note...");