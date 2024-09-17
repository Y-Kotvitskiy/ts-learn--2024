class School {
  // implement 'add area', 'remove area', 'add lecturer', and 'remove lecturer' methods

  _areas = [];
  _lecturers = []; // Name, surname, position, company, experience, courses, contacts

  get areas() {
    this._areas;
  }

  get lecturers() {
    this._lecturers;
  }
}

class Area {
  // implement getters for fields and 'add/remove level' methods
  _levels = [];
  _name;

  constructor(name) {
    this._name = name;
  }
}

class Level {
  // implement getters for fields and 'add/remove group' methods

  _groups;
  _name;

  constructor(name, description) {
    this.name = name;
    this._description = description;
  }
}

class Group {
  // implement getters for fields and 'add/remove student' and 'set status' methods

  _area;
  _status;
  _students = []; // Modify the array so that it has a valid toSorted method*

  constructor(directionName, levelName) {
    this.directionName = directionName;
    this.levelName = levelName;
  }

  showPerformance() {
    const sortedStudents = this._students.toSorted((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    return sortedStudents;
  }
}

class Student {
  // implement 'set grade' and 'set visit' methods

  _firstName;
  _lastName;
  _birthYear;
  _grades = []; // workName: mark
  _visits = []; // lesson: present

  constructor(firstName, lastName, birthYear) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthYear = birthYear;
  }

  get fullName() {
    return `${this._lastName} ${this._firstName}`;
  }

  set fullName(value) {
    [this._lastName, this._firstName] = value.split(' ');
  }

  get age() {
    return new Date().getFullYear() - this._birthYear;
  }

  getPerformanceRating() {
    const gradeValues = Object.values(this._grades);

    if (!gradeValues.length) return 0;

    const averageGrade = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
    const attendancePercentage = (this._visits.filter(present => present).length / this._visits.length) * 100;

    return (averageGrade + attendancePercentage) / 2;
  }
}