export interface INotification {
  _id: string;
  title: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
  date: string | Date;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateNotification {
  title: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
  date: Date | string;
  type: string;
}
