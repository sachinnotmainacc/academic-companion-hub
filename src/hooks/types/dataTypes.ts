
// Type definitions for data models
export interface Semester {
  id: string;
  name: string;
  order?: number;
}

export interface Subject {
  id: string;
  name: string;
  semesterId: string;
}
