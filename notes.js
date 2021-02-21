"use strict";

let notes = (function() {
   let notesSaved = {};     // holds the user's notes 
   let index = 0;           // used to index the identifier of a note inside notesSaved
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
   const remove = function(pos = null) { // removes a note inside notesSaved
      pos = Number(pos);
      if (isNaN(pos) || pos > index) return this;
      delete notesSaved[pos];
      return this;
   };
   const clear = function() { // clears notesSaved
      notesSaved = {};
      return this;
   };
   const saveNotes = function() { // save notes in user's machine
      // check if localStorage exists
      if (window.localStorage) {
         // save notes in localStorage
         let data = {
            notes: notesSaved,
            index: index,
         };

         localStorage.setItem("notes", JSON.stringify(data));
      } else {
         // save notes inside a cookie
         let data = JSON.stringify(this.getNotes());
         document.cookie = `notes=${data}:note:;`;
         document.cookie = `index=${index}:index:;`;
      }

      return this;
   };
   const getSavedNotes = function() { // get notes in user's machine
      if (window.localStorage) {
         let data = JSON.parse(localStorage.notes);

         notesSaved = data.notes;
         index = data.index;
      } else {
         let data = document.cookie;
         let notes = data.substring( data.indexOf("notes="), data.indexOf(":note:") ).replace("notes=", "");
         let index = data.substring( data.indexOf("index="), data.indexOf(":index:") ).replace("index=", "");

         notesSaved = JSON.parse(notes);
         index = index;
      }

      return this;
   };

   return {
      getNotes,
      add,
      remove,
      clear,
      saveNotes,
      getSavedNotes,
   };
})();

notes.add("note 1", "# note 1 ## About this note...")
     .add("note 2", "# note 2 ## About this note...")
     .add("note 3", "# note 3 ## About this note...");