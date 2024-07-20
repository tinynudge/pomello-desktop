import { HTTPError } from 'ky';

type SerializableHttpErrorParams = {
  error: HTTPError;
  message: string;
  sensitiveSearchParams?: string[];
};

export class SerializableHttpError extends HTTPError {
  private sensitiveSearchParams: string[];

  constructor({ error, message, sensitiveSearchParams = [] }: SerializableHttpErrorParams) {
    super(error.response, error.request, error.options);

    this.message = message;
    this.sensitiveSearchParams = sensitiveSearchParams;
  }

  public toJson() {
    const url = new URL(this.request.url);

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: (this.options as any).json,
      message: this.message,
      method: this.request.method,
      searchParams: this.sanitizeSearchParams(url.searchParams),
      status: this.response.status,
      url: `${url.origin}${url.pathname}`,
    };
  }

  public toString() {
    return JSON.stringify(this.toJson(), null, 2);
  }

  private sanitizeSearchParams(searchParams: URLSearchParams) {
    const sanitizedSearchParams: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (this.sensitiveSearchParams.includes(key)) {
        sanitizedSearchParams[key] = '******';
      } else {
        sanitizedSearchParams[key] = value;
      }
    });

    return sanitizedSearchParams;
  }
}
