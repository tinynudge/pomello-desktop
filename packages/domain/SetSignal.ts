import { SetSignalFunction } from './SetSignalFunction';

export type SetSignal<TValue> = TValue | SetSignalFunction<TValue>;
