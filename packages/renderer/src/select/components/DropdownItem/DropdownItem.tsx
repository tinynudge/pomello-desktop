import { SelectItem, SelectOptionType, Service } from '@pomello-desktop/domain';
import cc from 'classcat';
import { Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { DropdownList } from '../DropdownList';
import { DropdownRow } from '../DropdownRow';
import styles from './DropdownItem.module.scss';

interface DropdownItemProps {
  activeOptionId?: string;
  depth: number;
  item: SelectItem;
  onOptionHover(option: SelectOptionType): void;
  onOptionSelect(): void;
  service?: Service;
}

export const DropdownItem: Component<DropdownItemProps> = props => {
  return (
    <>
      {props.item.type === 'group' || props.item.type === 'customGroup' ? (
        <DropdownList
          activeOptionId={props.activeOptionId}
          aria-labelledby={props.item.id}
          depth={props.depth + 1}
          items={props.item.items}
          onOptionHover={props.onOptionHover}
          onOptionSelect={props.onOptionSelect}
          role="group"
          service={props.service}
        >
          <DropdownRow
            class={cc([styles.item, styles.group])}
            id={props.item.id}
            role="presentation"
          >
            {props.item.type === 'customGroup' && props.service?.CustomSelectGroup ? (
              <Dynamic component={props.service.CustomSelectGroup} group={props.item} />
            ) : (
              <>
                <span class={styles.label}>{props.item.label}</span>
                {props.item.hint && <span class={styles.hint}>{props.item.hint}</span>}
              </>
            )}
          </DropdownRow>
        </DropdownList>
      ) : (
        <DropdownRow
          class={cc({
            [styles.item]: true,
            [styles.selected]: props.activeOptionId === props.item.id,
          })}
          id={props.item.id}
          onClick={props.onOptionSelect}
          onMouseOver={() => props.onOptionHover(props.item as SelectOptionType)}
          role="option"
        >
          {props.item.type === 'customOption' && props.service?.CustomSelectOption ? (
            <Dynamic
              children={props.item.label}
              component={props.service.CustomSelectOption}
              option={props.item}
            />
          ) : (
            <>
              <span class={styles.label}>{props.item.label}</span>
              {props.item.hint && <span class={styles.hint}>{props.item.hint}</span>}
            </>
          )}
        </DropdownRow>
      )}
    </>
  );
};
