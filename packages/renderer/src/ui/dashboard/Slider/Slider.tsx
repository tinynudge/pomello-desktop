import cc from 'classcat';
import { Component, JSX, createEffect, on, onCleanup, onMount, splitProps } from 'solid-js';
import styles from './Slider.module.scss';

type SliderProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Slider: Component<SliderProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['class', 'ref']);

  onMount(() => {
    updateProgress();

    inputRef.addEventListener('input', updateProgress);

    onCleanup(() => {
      inputRef.removeEventListener('input', updateProgress);
    });
  });

  createEffect(
    on(
      () => remainingProps.value,
      () => updateProgress()
    )
  );

  const attachRef = (element: HTMLInputElement) => {
    inputRef = element;

    /* @ts-expect-error Solid uses the callback form when forwarding refs */
    props.ref?.(element);
  };

  const updateProgress = () => {
    const max = inputRef.max ? +inputRef.max : 100;
    const min = inputRef.min ? +inputRef.min : 0;
    const progress = (+inputRef.value / (max - min)) * 100;

    inputRef.style.setProperty('--slider-progress', `${progress}%`);
  };

  let inputRef: HTMLInputElement;

  return (
    <input
      {...remainingProps}
      class={cc([styles.slider, props.class])}
      ref={element => attachRef(element)}
      type="range"
    />
  );
};
