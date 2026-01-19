export class UserDTO {
  req: {
    body: {
      id: number;
      name: string;
      email: string;
      password?: string;
    };
    params?: Record<string, string>;
    query?: Record<string, string | number>;
  };

  res: {
    statusCode: number;
    message: string;
    data?: {
      name: string;
    };
  };

  constructor(
    req: {
      body: {
        id: number;
        name: string;
        email: string;
        password?: string;
      };
      params?: Record<string, string>;
      query?: Record<string, string | number>;
    },
    res: {
      statusCode: number;
      message: string;
      data?: any;
    }
  ) {
    this.req = req;
    this.res = res;
  }
}
