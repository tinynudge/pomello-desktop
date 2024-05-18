import { CustomSelectOptionComponent } from '@pomello-desktop/domain';
import cc from 'classcat';
import { Match, Switch } from 'solid-js';
import styles from './TrelloSelectOption.module.scss';
import BackIcon from './assets/back.svg';
import SwitchIcon from './assets/switch.svg';

export const TrelloSelectOption: CustomSelectOptionComponent = props => {
  return (
    <Switch>
      <Match when={props.option.id === 'previous-list'}>
        <div class={cc([styles.option, styles.bottomBorder])}>
          <BackIcon class={styles.icon} width={16} /> {props.children}
        </div>
      </Match>
      <Match when={props.option.id === 'switch-lists'}>
        <div class={cc([styles.option, styles.topBorder])}>
          <SwitchIcon class={styles.icon} width={16} /> {props.children}
        </div>
      </Match>
    </Switch>
  );
};
