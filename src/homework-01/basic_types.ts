class School {
  directions: Direction[] = [];

  addDirection(direction: Direction): void {
    this.directions.push(direction);
  }
}

class Direction {
  levels: Level[] = [];
  _name: string;

  get name(): string {
    return this._name;
  }

  constructor(name: string) {
    this._name = name;
  }

  addLevel(level: Level): void  {
    this.levels.push(level);
  }
}

class Level {
  groups: Group[] = [];
  _name: string;
  _program: any;

  constructor(name: string, program: any) {
    this._name = name;
    this._program = program;
  }

  get name(): string {
    return this._name;
  }

  get program(): any {
    return this._program;
  }

  addGroup(group: Group): void {
    this.groups.push(group);
  }
}

class Group {
  _students: Student[] = [];
  _directionName: string;
  _levelName: string;

  get students(): Student[] {
    return this._students;
  }

  constructor(directionName: string, levelName: string) {
    this._directionName = directionName;
    this._levelName = levelName;
  }

  addStudent(student: Student) : void {
    this._students.push(student);
  }

  showPerformance(): Student[] {
    const sortedStudents: Student[] = this.students.toSorted(
      (a: Student, b: Student) => b.getPerformanceRating() - a.getPerformanceRating()
    );

    return sortedStudents;
  }
}

class Student {
  grades: { [key: string]: number } = {};
  attendance: boolean[] = [];
  _firstName: string;
  _lastName: string;
  _birthYear: number;

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

  setGrade(subject: string, grade: number): void {
    this.grades[subject] = grade;
  }

  markAttendance(present: boolean): void {
    this.attendance.push(present);
  }

  getPerformanceRating(): number {
    const gradeValues: number[] = Object.values(this.grades);

    if (gradeValues.length === 0) return 0;

    const averageGrade: number = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;

    const attendancePercentage = (this.attendance.filter(present => present).length / this.attendance.length) * 100;

    return (averageGrade + attendancePercentage) / 2;
  }
}
