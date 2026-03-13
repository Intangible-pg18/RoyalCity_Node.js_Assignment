// File: /server/models/Note.js
let notes = [];
let nextId = 1;

class Note {
  static findAll() {
    return notes;
  }

  static findById(id) {
    return notes.find((note) => note.id === parseInt(id));
  }

  static create({ title, content }) {
    const newNote = {
      id: nextId++,
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    return newNote;
  }

  static update(id, { title, content }) {
    const note = this.findById(id);
    if (note) {
      if (title) note.title = title;
      if (content) note.content = content;
      note.updatedAt = new Date().toISOString();
      return note;
    }
    return null;
  }

  static remove(id) {
    const initialLength = notes.length;
    notes = notes.filter((note) => note.id !== parseInt(id));
    return notes.length !== initialLength;
  }
}

module.exports = Note;