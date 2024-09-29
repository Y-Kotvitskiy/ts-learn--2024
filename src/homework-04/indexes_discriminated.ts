// 1.
// Визначте інтерфейс, який використовує сигнатуру індексу з типами об'єднання.
// Наприклад, тип значення для кожного ключа може бути число | рядок.

interface ITask1 {
  [key: number]: string;
  [key: string]: string;
}

// 2.
// Створіть інтерфейс, у якому типи значень у сигнатурі індексу є функціями.
// Ключами можуть бути рядки, а значеннями — функції, які приймають будь-які аргументи.

interface ITask2 {
  [key: string]: (param: any) => void;
}

// 3.
// Опишіть інтерфейс, який використовує сигнатуру індексу для опису об'єкта, подібного до масиву.
// Ключі повинні бути числами, а значення - певного типу.
interface ITask3 {
  [key: number]: [string, number];
}

// 4.
// Створіть інтерфейс з певними властивостями та індексною сигнатурою.
// Наприклад, ви можете мати властивості типу name: string та індексну сигнатуру для додаткових динамічних властивостей

interface ITask4 {
  name: string;
  [key: number]: [string, number];
}

// 5.
// Створіть два інтерфейси, один з індексною сигнатурою,
// а інший розширює перший, додаючи специфічні властивості.

interface ITask51 {
  [key: number]: string;
}

interface ITask52 extends ITask51 {
  [key: number]: string;
  description: string;
}

// 6
// Напишіть функцію, яка отримує об'єкт з індексною сигнатурою і перевіряє,
// чи відповідають значення певних ключів певним критеріям
// (наприклад, чи всі значення є числами).

function isAllNumbersKeys(obj: ITask1): boolean {
  for (const key in obj) {
    if (Number.isNaN(Number(key))) {
      return false;
    }
  }
  return true;
}

class T5 implements ITask1 {
  [key: number]: string;
  [key: string]: string;
}