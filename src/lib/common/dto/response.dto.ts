export type OkResponseDto<T> = Pick<
  BaseResponseDto,
  'statusCode' | 'message'
> & {
  data: T;
};

export type NotOkResponseDto = Pick<
  BaseResponseDto,
  'statusCode' | 'message'
> & {
  error: string;
};

export type BaseResponseDto = {
  statusCode: number;
  message: string;
};
