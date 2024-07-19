import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component, For, ParentComponent, ValidComponent, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type TranslateProps = {
  components: Record<string, ValidComponent>;
  key: string;
};

type TranslationPiece = {
  attributes: Record<string, string>;
  component: ValidComponent;
  text: string;
};

const translationRegex = /(<[^>]+>[^<]*<\/[^>]+>)|([^<]+)/g;
const componentRegex = /^<(\w+)([^>]*)>(.*?)<\/\1>$/;
const attributesRegex = /(\w+)=(['"])(.*?)\2/g;

const Fragment: ParentComponent = props => <>{props.children}</>;

export const Translate: Component<TranslateProps> = props => {
  const t = useTranslate();

  const translationPieces = createMemo(() => {
    const translationMap: TranslationPiece[] = [];
    const translation = t(props.key);

    translation.match(translationRegex)?.forEach(text => {
      const componentMatches = text.match(componentRegex);

      if (!componentMatches) {
        translationMap.push({
          attributes: {},
          component: Fragment,
          text,
        });
      } else {
        const [, component, attributesString, text] = componentMatches;

        const attributes = Array.from(attributesString.matchAll(attributesRegex)).reduce<
          Record<string, string>
        >((attributeMap, [, name, , value]) => {
          attributeMap[name] = value;

          return attributeMap;
        }, {});

        translationMap.push({
          attributes,
          component: props.components[component] ?? Fragment,
          text,
        });
      }
    });

    return translationMap;
  });

  return (
    <For each={translationPieces()}>
      {({ attributes, component, text }) => (
        <Dynamic children={text} component={component} {...attributes} />
      )}
    </For>
  );
};
