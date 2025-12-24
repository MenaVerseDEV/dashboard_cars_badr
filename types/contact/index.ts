export interface IContact {
  city: string;
  branches: IBranch[];
}

export interface IBranch {
  id: number;
  branchName: string;
  address: string;
  location: string;
}
