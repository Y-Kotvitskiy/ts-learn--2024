const { v4: uuidv4 } = require('uuid');

enum noteType {
  default = 'default',
  confirmation = 'confirmation',
}

interface ICreateNote {
  name: string;
  content: string;
}

interface INote extends ICreateNote {
  id: string;
  dateCreate: Date;
  dateModify: Date | null;
  done: boolean;
}

interface IEditNote {
  name?: INote['name'];
  content?: INote['content'];
}

abstract class BaseNote implements INote {
  readonly id: string = '';
  protected _name: string;
  protected _content: string;
  protected _done: boolean = false;
  readonly dateCreate: Date;
  protected _dateModify: Date | null = null;

  constructor(name: string, content: string) {
    if (!name) throw new Error(`cannot create note with empty name`);
    if (!content) throw new Error(`cannot create note with empty content`);
    (this.id = uuidv4()), (this._name = name);
    this._content = content;
    this.dateCreate = new Date();
  }

  public get dateModify(): Date | null {
    return this._dateModify;
  }

  public get name(): string {
    return this._name;
  }

  protected set name(value: string) {
    this._name = value;
  }

  public get content(): string {
    return this._content;
  }

  protected set content(value: string) {
    this._content = value;
  }

  public get done(): boolean {
    return this._done;
  }

  public abstract update(payload: IEditNote): boolean;

  public makeDone(): void {
    this._done = true;
  }
}

class DefaultNote extends BaseNote {
  public update(payload: IEditNote): boolean {
    let result = false;
    let property: keyof IEditNote;
    for (property in payload) {
      if (payload[property]) {
        this[property] = payload[property]!;
        this._dateModify = new Date();
        result = true;
      }
    }
    return result;
  }
}

class ConvifmNote extends BaseNote {
  public update(payload: IEditNote): boolean;
  public update(payload: IEditNote, confirm: boolean): boolean;
  public update(payload: IEditNote, confirm?: boolean): boolean {
    if (confirm === undefined) {
      throw new Error(`Upload shold be confirmed! Use method update(payload: IEditNote, confirm: boolean)`);
    }
    if (confirm) {
      let result = false;
      let property: keyof IEditNote;
      for (property in payload) {
        if (payload[property]) {
          this[property] = payload[property]!;
          this._dateModify = new Date();
          result = true;
        }
      }
      return result;
    }
    return false;
  }
}

// У списку нотаток повинні бути методи для додавання нового запису, видалення, редагування та отримання повної інформації про нотатку за ідентифікаторо

interface ITodoList {
  notes: BaseNote[];
  addNote(note: ICreateNote): string;
  deleteNote(id: string): boolean;
  info(id: string): string | undefined;
  edit(id: string, editNote: IEditNote): boolean;
  makeDone(id: string): boolean;
  total(): number;
}

class TodoList implements ITodoList {
  protected _notes: Partial<Record<string, BaseNote>> = {};

  public get notes(): BaseNote[] {
    const result: BaseNote[] = [];
    for (const noteId in this._notes) {
      const note = this._notes[noteId] as BaseNote;
      result.push(note);
    }
    return result;
  }

  addNote(note: BaseNote): string {
    if (this._notes[note.id]) {
      return '';
    }
    this._notes[note.id] = note;
    return note.id;
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

  edit(id: string, editPropertise: IEditNote): boolean;
  edit(id: string, editPropertise: IEditNote, confirm: boolean): boolean;
  edit(id: string, editPropertise: IEditNote, confirm?: boolean): boolean {
    const note = this._notes[id];
    if (!note) {
      return false;
    }
    if (confirm === undefined) {
      return note.update(editPropertise);
    }
    if (note instanceof ConvifmNote) {
      return note.update(editPropertise, confirm);
    } else {
      throw new Error('Use ConvifmNote class instatnce!');
    }
  }

  makeDone(id: string): boolean {
    const note = this._notes[id];
    if (!note) {
      return false;
    }
    note.makeDone();
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
      return Number(a.done) - Number(b.done);
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
  const noteId = todoList.addNote(new DefaultNote('start', 'some description'));
  console.log(`not done:`, todoList.countNotDone());
  console.log(`notes:`, todoList.notes);
  todoList.edit(noteId, { name: `new name` });
  todoList.makeDone(noteId);
  console.log(`note info:`, '\n--\n' + todoList.info(noteId));

  const todoSearch = new TodoSearchList();
  todoSearch.addNote(new DefaultNote('#1', 'some description #1'));
  todoSearch.addNote(new DefaultNote('#2', 'some description #2'));
  console.log('find name #1:', todoSearch.searchNames('#1'));
  console.log('find content #2:', todoSearch.searchContent('#2'));

  const todoSorted = new TodoSortList();
  const sortId = todoSorted.addNote(new DefaultNote('#3', 'some description'));
  todoSorted.makeDone(sortId);
  todoSorted.addNote(new DefaultNote('#2', 'some description'));
  setTimeout(() => {
    todoSorted.addNote(new DefaultNote('#1', 'some description'));
    console.log('sorted status: ', todoSorted.sortedStatus());
    console.log('sorted dateCreate asc:', todoSorted.sortedDateCreate());
    console.log('sorted dateCreate desc:', todoSorted.sortedDateCreate(-1));
  }, 500);
};

test();
