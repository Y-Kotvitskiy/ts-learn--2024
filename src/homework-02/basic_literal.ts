type Lecturer = {
  name: string;
  surname: string;
  position: string;
  company: string;
  experience: number;
  courses: any[];
  contacts: any[];
};

type Areas = Area[];
type Lecturers = Lecturer[];

class School {
  // implement 'add area', 'remove area', 'add lecturer', and 'remove lecturer' methods

  _areas: Areas = [];
  _lecturers: Lecturers = []; // Name, surname, position, company, experience, courses, contacts

  get areas(): Areas {
    return this._areas;
  }

  get lecturers(): Lecturers {
    return this._lecturers;
  }

  addArea(value: Area): boolean {
    if (this._areas.find(x => x.name === value.name)) {
      return false;
    }
    this._areas.push(value);
    return true;
  }

  removeArea(value: Area): boolean {
    const index = this._areas.findLastIndex(x => x.name === value.name);
    if (index < 0) {
      return false;
    }
    this._areas.splice(index, 1);
    return true;
  }

  addLecturer(value: Lecturer): boolean {
    if (this._lecturers.find(x => x.name === value.name)) {
      return false;
    }
    this._lecturers.push(value);
    return true;
  }

  removeLecturer(value: Lecturer): boolean {
    const index = this._lecturers.findLastIndex(x => x.name === value.name);
    if (index < 0) {
      return false;
    }
    this._lecturers.splice(index, 1);
    return true;
  }
}

type Levels = Level[];

class Area {
  // implement getters for fields and 'add/remove level' methods
  _levels: Levels = [];
  _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get levels(): Levels {
    return this._levels;
  }

  get name(): string {
    return this._name;
  }

  addLevel(value: Level): boolean {
    if (this._levels.find(x => x.name === value.name)) {
      return false;
    }
    this._levels.push(value);
    return true;
  }

  removeLevel(value: Level): boolean {
    const index = this._levels.findLastIndex(x => x.name === value.name);
    if (index < 0) {
      return false;
    }
    this._levels.splice(index, 1);
    return true;
  }
}

type Groups = Group[];

type SameGroup = (a: Group, b: Group) => boolean;

const sameGrop: SameGroup = (a: Group, b: Group) => {
  return a.directionName === b.directionName && a.levelName === b.levelName;
};

class Level {
  // implement getters for fields and 'add/remove group' methods

  _groups: Groups = [];
  _name: string;
  _description: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  get groups(): Groups {
    return this._groups;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  addGroup(value: Group): boolean {
    if (this._groups.find(x => sameGrop(x, value))) {
      return false;
    }
    this._groups.push(value);
    return true;
  }

  removeGroup(value: Group): boolean {
    const index = this._groups.findIndex(x => sameGrop(x, value));
    if (index < 0) {
      return false;
    }
    this._groups.splice(index, 1);
    return true;
  }
}

type Students = Student[];

type SameStudent = (a: Student, b: Student) => boolean;

const sameStudent: SameStudent = (a: Student, b: Student) => {
  return a.fullName === b.fullName && a.age === b.age;
};

class Group {
  // implement getters for fields and 'add/remove student' and 'set status' methods
  _directionName: string;
  _levelName: string;
  _area?: Area;
  _status: string = '';
  _students: Student[] = []; // Modify the array so that it has a valid toSorted method*

  constructor(directionName: string, levelName: string) {
    this._directionName = directionName;
    this._levelName = levelName;
  }

  get directionName(): string {
    return this._directionName;
  }

  get levelName(): string {
    return this._levelName;
  }

  get area(): Area | undefined {
    return this._area;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get students(): Students {
    return this._students;
  }

  addStudent(value: Student): boolean {
    if (this._students.find(x => sameStudent(x, value))) {
      return false;
    }
    this._students.push(value);
    return true;
  }

  removeStudent(value: Student): boolean {
    const index = this._students.findIndex(x => sameStudent(x, value));
    if (index < 0) {
      return false;
    }
    this._students.splice(index, 1);
    return true;
  }

  showPerformance() {
    const sortedStudents = this._students.toSorted((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    return sortedStudents;
  }
}

type Grade = [string, number];
type Visit = [string, boolean];

class Student {
  // implement 'set grade' and 'set visit' methods

  _firstName: string;
  _lastName: string;
  _birthYear: number;
  _grades: Grade[] = []; // workName: mark [string, number]
  _visits: Visit[] = []; // lesson: present [string, boolean]

  constructor(firstName: string, lastName: string, birthYear: number) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthYear = birthYear;
  }

  get fullName(): string {
    return `${this._lastName} ${this._firstName}`;
  }

  set fullName(value: string) {
    [this._lastName, this._firstName] = value.split(' ');
  }

  get age(): number {
    return new Date().getFullYear() - this._birthYear;
  }

  setGrade(grade: Grade): void {
    const lastGrade: Grade | undefined = this._grades.find(currGrade => currGrade[0] === grade[0]);
    if (lastGrade) {
      lastGrade[1] = grade[1];
    } else {
      this._grades.push(grade);
    }
  }

  setVisit(visit: Visit): void {
    const lastVisit: Visit | undefined = this._visits.find(currVisit => currVisit[0] === visit[0]);
    if (lastVisit) {
      lastVisit[1] = visit[1];
    } else {
      this._visits.push(visit);
    }
  }

  getPerformanceRating(): number {
    const gradeValues = Object.values(this._grades);

    if (!gradeValues.length) return 0;

    const averageGrade = gradeValues.reduce((sum, grade) => sum + grade[1], 0) / gradeValues.length;
    const attendancePercentage = (this._visits.filter(present => present).length / this._visits.length) * 100;

    return (averageGrade + attendancePercentage) / 2;
  }
}
