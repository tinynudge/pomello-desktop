interface ParsedName {
  title: string;
}

const parseName = (name: string, marker: string): ParsedName => {
  const regex = new RegExp(`(?:([\\d\\.⅛|¼|⅜|½|⅝|¾|⅞]+)?\\s${marker})?(.+)`);
  const results = name.match(regex);

  if (!results) {
    return {
      title: name,
    };
  }

  const [, , title] = results;

  return {
    title: title.trim(),
  };
};

export default parseName;
