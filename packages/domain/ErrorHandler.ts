import type { ErrorHandlerProps } from './ErrorHandlerProps';
import type { View } from './View';

export type ErrorHandler = (props: ErrorHandlerProps) => View | undefined;
