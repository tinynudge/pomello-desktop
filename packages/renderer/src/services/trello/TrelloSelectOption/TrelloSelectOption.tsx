import { CustomSelectOptionComponent } from '@domain';
import cc from 'classcat';
import { ReactComponent as BackIcon } from './assets/back.svg';
import { ReactComponent as SwitchIcon } from './assets/switch.svg';
import styles from './TrelloSelectOption.module.scss';

const TrelloSelectOption: CustomSelectOptionComponent = ({ children, option }) => {
  if (option.id === 'previous-list') {
    return (
      <div className={cc([styles.option, styles.bottomBorder])}>
        <BackIcon className={styles.icon} width={16} /> {children}
      </div>
    );
  }

  if (option.id === 'switch-lists') {
    return (
      <div className={cc([styles.option, styles.topBorder])}>
        <SwitchIcon className={styles.icon} width={16} /> {children}
      </div>
    );
  }

  return null;
};

export default TrelloSelectOption;
