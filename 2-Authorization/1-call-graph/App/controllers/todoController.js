const Note = require('../models/note');

exports.writeNote = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    res.render('write', {isAuthenticated: isAuthenticated});
}

exports.postNote = (req, res, next) => {
    const note = new Note(req.body.title, req.body.description, req.body.status);
    note.saveNote();
    res.redirect('/');
}

exports.readNotes = (req, res, next) => {
    Note.getAll().then(notes => {
        const isAuthenticated = req.session.isAuthenticated;
        res.render('read', {isAuthenticated: isAuthenticated, notes: notes});
    });
}

exports.seeNote = (req, res, next) => {
    const noteId = req.params.noteId;
    const isEditing = req.query.edit;

    Note.getAll().then(notes => {
        const note = notes.find((nt) => nt._id == noteId);
        const isAuthenticated = req.session.isAuthenticated;
        res.render('see', {isAuthenticated: isAuthenticated, note: note, isEditing: isEditing});
    });
}

exports.deleteNote = (req, res, next) => {
    const noteId = req.body.noteId;
    Note.deleteNote(noteId);
    res.redirect('/');
}

exports.updateNote = (req, res, next) => {
    const noteId = req.body.noteId;
    const description = req.body.description;
    const status = req.body.status;

    Note.updateNote(noteId, description, status);
    res.redirect('/notes/' + noteId);
}