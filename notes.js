"use strict";
/* 
   Notes object 
   This object stores, creates and removes notes.
*/
const notes = {
   _notes: {},
   _index: 0,
   get notes() {
      return this._notes;
   },
   get index() {
      return this._index;
   },
   add(title = "", body = "") { // adds the object to _notes
      title = String(title);
      body = String(body);
      if (title !== "" && title.length > 0 && body !== "" && body.length > 0) {
         this._notes[this._index] = { title, body };
         this._index++;
      }
      return this;
   },
   remove(index = null) { // removes an object in _notes
      index = Number(index);
      if (isNaN(index) || index > this._index) return this;
      delete this._notes[index];
      return this;
   },
   modify(index = 0, newTitle = "", newBody = "") { // modifies an object in _notes
      let indexes = Object.keys(this._notes);
      let canModify = false;

      indexes.forEach(key => (index == key) ? canModify = true : null);
      if (canModify && newTitle !== "" && newTitle.length > 0 && newBody !== "" && newBody.length > 0) {
         this._notes[index].title = newTitle;
         this._notes[index].body = newBody;
      }
      return this;
   },
   save() { // save _notes in user's machine
      if (window.localStorage) { // check if localStorage exists
         if (Object.keys(this._notes).length !== 0) { // save notes in localStorage
             let data = {
               notes: this._notes,
               index: this._index,
            };

            localStorage.setItem("notes", JSON.stringify(data));
         } else { // delete data if there is no notes
            localStorage.removeItem("notes");
         }
      }
      return this;
   },
   getData() { // get notes stored in user machine
      if (window.localStorage) {
         if (localStorage.notes) {
            try {
               let data = JSON.parse(localStorage.notes);

               this._notes = data.notes;
               this._index = data.index;
               return true;
            } catch (e) {
               return false;
            }
         }
      }
      return this;
   },
};