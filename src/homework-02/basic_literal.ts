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
type Levels = Level[];

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
}

class Area {
  // implement getters for fields and 'add/remove level' methods
  _levels: Levels = [];
  _name: string;

  constructor(name: string) {
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
  _directionName: string; 
  _levelName: string;
  _area?: Area ;
  _status?: string;
  _students: Student[] = []; // Modify the array so that it has a valid toSorted method*

  constructor(directionName: string, levelName: string) {
    this._directionName = directionName;
    this._levelName = levelName;
  }

  showPerformance() {
    const sortedStudents = this._students.toSorted((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    return sortedStudents;
  }
}

type Grade = { workname: string; mark: number };
type Visit = { lesson: string; present: boolean };

class Student {
  // implement 'set grade' and 'set visit' methods

  _firstName: string;
  _lastName: string;
  _birthYear: number;
  _grades: Grade[] = []; // workName: mark
  _visits: Visit[] = []; // lesson: present

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
    const lastGrade: Grade | undefined = this._grades.find(currGrade => currGrade.workname === grade.workname);
    if (lastGrade) {
      lastGrade.mark = grade.mark;
    } else {
      this._grades.push(grade);
    }
  }

  setVisit(visit: Visit): void {
    const lastVisit: Visit | undefined = this._visits.find(currVisit => currVisit.lesson === visit.lesson);
    if (lastVisit) {
      lastVisit.present = visit.present;
    } else {
      this._visits.push(visit);
    }
  }

  getPerformanceRating(): number {
    const gradeValues = Object.values(this._grades);

    if (!gradeValues.length) return 0;

    const averageGrade = gradeValues.reduce((sum, grade) => sum + grade.mark, 0) / gradeValues.length;
    const attendancePercentage = (this._visits.filter(present => present).length / this._visits.length) * 100;

    return (averageGrade + attendancePercentage) / 2;
  }
}
