import type { ErrorOverlayProps } from './ErrorOverlayProps';

export type CustomErrorHandler = (error: unknown) => ErrorOverlayProps | undefined;
