import { randomUUID } from 'node:crypto';

interface StudentProps {
  name: string;
}

export class Student {
  public id: string;
  public name: string;

  constructor(props: StudentProps, id?: string) {
    this.name = props.name;
    this.id = id ?? randomUUID();
  }
}
