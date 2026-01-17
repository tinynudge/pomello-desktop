import { ParentComponent } from 'solid-js';
import { PanelAccordionItem } from './PanelAccordionItem';

type PanelAccordionComponent = ParentComponent & {
  Item: typeof PanelAccordionItem;
};

export const PanelAccordion: PanelAccordionComponent = props => {
  return <div>{props.children}</div>;
};

PanelAccordion.Item = PanelAccordionItem;
