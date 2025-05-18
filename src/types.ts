export type SuccessResponse<T extends any = undefined> = {
  status: true;
  data?: T;
};

export type ErrorResponse<T extends any = undefined> = {
  status: false;
  code: string;
  errors?: T;
};
