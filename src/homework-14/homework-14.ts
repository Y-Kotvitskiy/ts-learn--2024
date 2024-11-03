const { v4: uuidv4 } = require('uuid');

enum noteType {
  default = 'default',
  confirmation = 'confirmation',
}

interface IEditNote {
  name?: string;
  content?: string;
}

interface ICreateNote {
  name: string;
  content: string;
  type: noteType;
}

interface INote extends ICreateNote {
  id: string;
  dateCreate: Date;
  dateModify: Date;
  done: boolean;
}

// У списку нотаток повинні бути методи для додавання нового запису, видалення, редагування та отримання повної інформації про нотатку за ідентифікаторо

interface ITodoList {
  notes: INote[];
  addNote(note: ICreateNote): string;
  deleteNote(id: string): boolean;
  info(id: string): string | undefined;
  edit(id: string, editNote: IEditNote): boolean;
  makeDone(id: string): boolean;
  total(): number;
}

class TodoList implements ITodoList {
  protected _notes: Partial<Record<string, INote>> = {};

  public get notes(): INote[] {
    const result: INote[] = [];
    for (const noteId in this._notes) {
      const note = this._notes[noteId] as INote;
      result.push({ ...note });
    }
    return result;
  }

  addNote(note: ICreateNote): string {
    if (!note.name) throw new Error(`cannot create note with empty name`);
    if (!note.content) throw new Error(`cannot create note with empty content`);
    const dateCreate = new Date();
    const newNote: INote = {
      id: uuidv4(),
      ...note,
      dateCreate: dateCreate,
      dateModify: dateCreate,
      done: false,
    };
    this._notes[newNote.id] = newNote;
    return newNote.id;
  }

  deleteNote(id: string): boolean {
    if (this._notes[id]) {
      delete this._notes[id];
      return true;
    }
    return false;
  }

  info(id: string): string | undefined {
    if (this._notes[id]) {
      const note: INote = this._notes[id] as INote;
      return `id: ${note.id}
name: ${note.name}
content: ${note.content}
date create: ${note.dateCreate.toISOString()}
date modify: ${note.dateModify?.toISOString()}
done: ${note.done}`;
    }
    return undefined;
  }

  edit(id: string, editPropertise: IEditNote): boolean {
    const note = this._notes[id];
    if (!note) {
      return false;
    }
    let property: keyof IEditNote;
    for (property in editPropertise) {
      if (editPropertise[property]) {
        note[property] = editPropertise[property] as string;
        note.dateModify = new Date();
      }
    }
    return true;
  }

  makeDone(id: string): boolean {
    const note = this._notes[id];
    if (!note) {
      return false;
    }
    note.done = true;
    return true;
  }

  countNotDone(): number {
    let notDone = 0;
    for (const noteId in this._notes) {
      if (!this._notes[noteId]?.done) notDone++;
    }
    return notDone;
  }

  total(): number {
    return Object.keys(this._notes).length;
  }
}

// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка за ім'ям або змістом
class TodoSearchList extends TodoList {
  public searchNames(searchName: string) {
    const result: INote[] = [];
    for (const noteId in this._notes) {
      const note = this._notes[noteId] as INote;
      if (note.name.toLowerCase().includes(searchName.toLowerCase())) {
        result.push({ ...note });
      }
    }
    return result;
  }

  public searchContent(searchConten: string) {
    const result: INote[] = [];
    for (const noteId in this._notes) {
      const note = this._notes[noteId] as INote;
      if (note.content.toLowerCase().includes(searchConten.toLowerCase())) {
        result.push({ ...note });
      }
    }
    return result;
  }
}

// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка за ім'ям або змістом.
class TodoSortList extends TodoList {
  public sortedStatus() {
    let result = this.notes;
    result = result.sort((a, b) => {
      return Number(a.type === noteType.confirmation) - Number(b.type === noteType.confirmation);
    });
    return result;
  }

  public sortedDateCreate(order: 1 | -1 = 1) {
    let result = this.notes;
    result = result.sort((a, b) => {
      return order * (a.dateCreate.getTime() - b.dateCreate.getTime());
    });
    return result;
  }
}

const test = () => {
  const todoList = new TodoList();
  const noteId = todoList.addNote({ name: 'start', content: 'some description', type: noteType.default });
  console.log(`not done:`, todoList.countNotDone());
  console.log(`notes:`, todoList.notes);
  todoList.edit(noteId, { name: `new name` });
  todoList.makeDone(noteId);
  console.log(`note info:`, '\n--\n' + todoList.info(noteId));

  const todoSearch = new TodoSearchList();
  todoSearch.addNote({ name: '#1', content: 'some description #1', type: noteType.default });
  todoSearch.addNote({ name: '#2', content: 'some description #2', type: noteType.confirmation });
  console.log('find name #1:', todoSearch.searchNames('#1'));
  console.log('find content #2:', todoSearch.searchContent('#2'));

  const todoSorted = new TodoSortList();
  todoSorted.addNote({ name: '#3', content: 'some description', type: noteType.default });
  todoSorted.addNote({ name: '#2', content: 'some description', type: noteType.confirmation });
  setTimeout(() => {
    todoSorted.addNote({ name: '#1', content: 'some description', type: noteType.default });
    console.log('sorted status: ', todoSorted.sortedStatus());
    console.log('sorted dateCreate asc:', todoSorted.sortedDateCreate());
    console.log('sorted dateCreate desc:', todoSorted.sortedDateCreate(-1));
  }, 500);
};

test();
