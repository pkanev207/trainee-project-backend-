export interface IRegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface ILoginBody {
  email?: string;
  password?: string;
}

export interface ICreateBookBody {
  title?: string;
  description?: string;
  imgUrl?: string;
  cloudinaryId?: string;
  author?: string;
  cover?: HTMLImageElement;
}

export interface IUpdateBookParams {
  id: string;
}

export interface IUpdateBookBody {
  title?: string;
  description?: string;
  imgUrl?: string;
  cloudinaryId?: string;
  author?: string;
}

// interface JwtPayload {
//   _id: string;
// }
