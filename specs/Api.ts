/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PaginatedBooks {
  status?: string;
  /** @default 2 */
  count?: number;
  /** @default 1 */
  page?: number;
  /** @default 2 */
  pages?: number;
  data?: Book[];
}

export interface Book {
  /** @example "6461eb55c0d90113a28cffbb" */
  _id?: string;
  /**
   * @minLength 4
   * @example "Major Heading"
   */
  title: string;
  /**
   * @minLength 10
   * @example "stringstringstring"
   */
  description: string;
  /**
   * @pattern ^https?:\/\/.+$
   * @example "https://support.echo360.com/hc/article_attachments/360041256731/Swagger_accessTokenReponse_original.png"
   */
  imgUrl: string;
  /** @example "prominent author" */
  author: string;
  /** user object is <u>populated</u> only in `getAllBooks` method */
  user?: User & {
    _id?: string;
    name?: string;
    role?: string;
  };
  likes?: string[];
  uploadedByUsers?: string[];
  userName?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format float */
  __v?: number;
}

export interface User {
  /** @example "642fea9b6ec5181c3b69de19" */
  _id?: string;
  /** @example "Fred" */
  name: string;
  /**
   * @format email
   * @pattern ^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$
   * @example "fred@abv.bg"
   */
  email: string;
  /**
   * @format password
   * @example 7654321
   */
  password: string;
  /** @default "user" */
  role: "user" | "poweruser" | "admin";
  finishedBooks?: string[];
  likedBooks?: string[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:{port}/{var}";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Cool Library Project
 * @version 0.0.1
 * @license MIT (https://opensource.org/licenses/MIT)
 * @termsOfService https://opensource.org/licenses/MIT
 * @baseUrl http://localhost:{port}/{var}
 * @externalDocs https://example.com
 * @contact API Support <support@support.com> (https://www.ibm.com/blog/why-open-source-isnt-free-support-as-a-best-practice/)
 *
 * ## About Us
 * OpenAPI specification for the **CLP** - _Cool Library Project_ - open market product
 * for `educational purposes only`.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  books = {
    /**
     * @description Get all books with pagination and limit per page
     *
     * @tags Books
     * @name GetAllBooksPaginated
     * @summary Get all books
     * @request GET:/books/paginated
     */
    getAllBooksPaginated: (
      query?: {
        /**
         * The number of the current page
         * @min 1
         * @example 1
         */
        page?: number;
        /**
         * The number of books displayed on page
         * @min 1
         * @max 6
         * @example 2
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedBooks, void>({
        path: `/books/paginated`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates new record of a book in the CLP backend
     *
     * @tags Books
     * @name CreateBook
     * @summary Creates a new book
     * @request POST:/books
     * @secure
     */
    createBook: (data: Book, params: RequestParams = {}) =>
      this.request<Book, void>({
        path: `/books`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns all books in the library
     *
     * @tags Books
     * @name GetAllBooks
     * @summary Lists all books
     * @request GET:/books
     * @deprecated
     */
    getAllBooks: (params: RequestParams = {}) =>
      this.request<Book[], any>({
        path: `/books`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Updates and returns a specific book by id
     *
     * @tags Books
     * @name UpdateBook
     * @summary Updates the book
     * @request PUT:/books/{bookId}
     * @secure
     */
    updateBook: (bookId: string, data: Book, params: RequestParams = {}) =>
      this.request<Book, any>({
        path: `/books/${bookId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete specific book from CLP application
     *
     * @tags Books
     * @name DeleteBook
     * @summary Delete Book
     * @request DELETE:/books/{bookId}
     * @secure
     */
    deleteBook: (bookId: string, params: RequestParams = {}) =>
      this.request<
        {
          message?: string;
        },
        void
      >({
        path: `/books/${bookId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns required book with details by id
     *
     * @tags Books
     * @name GetBookById
     * @summary Returns a book
     * @request GET:/books/{bookId}
     * @secure
     */
    getBookById: (bookId: string, params: RequestParams = {}) =>
      this.request<Book, any>({
        path: `/books/${bookId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
