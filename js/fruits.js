var FRUIT_ZONES = [
  { id: 'all', label: '全部', icon: '🌍' },
  { id: 'common', label: '常见', icon: '⭐' },
  { id: 'tropical', label: '热带', icon: '🌴' },
  { id: 'berry', label: '浆果', icon: '🫐' }
];

var FRUITS = [
  { id: 'apple', zone: 'common', emoji: '🍎', english: 'Apple', chinese: '苹果' },
  { id: 'banana', zone: 'common', emoji: '🍌', english: 'Banana', chinese: '香蕉' },
  { id: 'orange', zone: 'common', emoji: '🍊', english: 'Orange', chinese: '橙子' },
  { id: 'grape', zone: 'berry', emoji: '🍇', english: 'Grape', chinese: '葡萄' },
  { id: 'watermelon', zone: 'common', emoji: '🍉', english: 'Watermelon', chinese: '西瓜' },
  { id: 'strawberry', zone: 'berry', emoji: '🍓', english: 'Strawberry', chinese: '草莓' },
  { id: 'pear', zone: 'common', emoji: '🍐', english: 'Pear', chinese: '梨' },
  { id: 'peach', zone: 'common', emoji: '🍑', english: 'Peach', chinese: '桃子' },
  { id: 'mango', zone: 'tropical', emoji: '🥭', english: 'Mango', chinese: '芒果' },
  { id: 'pineapple', zone: 'tropical', emoji: '🍍', english: 'Pineapple', chinese: '菠萝' },
  { id: 'cherry', zone: 'berry', emoji: '🍒', english: 'Cherry', chinese: '樱桃' },
  { id: 'lemon', zone: 'common', emoji: '🍋', english: 'Lemon', chinese: '柠檬' },
  { id: 'kiwi', zone: 'tropical', emoji: '🥝', english: 'Kiwi', chinese: '猕猴桃' },
  { id: 'coconut', zone: 'tropical', emoji: '🥥', english: 'Coconut', chinese: '椰子' },
  { id: 'blueberry', zone: 'berry', emoji: '🫐', english: 'Blueberry', chinese: '蓝莓' },
  { id: 'melon', zone: 'common', emoji: '🍈', english: 'Melon', chinese: '甜瓜' },
  { id: 'plum', zone: 'common', emoji: '🟣', image: 'images/fruits/plum.svg', english: 'Plum', chinese: '李子' },
  { id: 'papaya', zone: 'tropical', emoji: '🟠', image: 'images/fruits/papaya.svg', english: 'Papaya', chinese: '木瓜' },
  { id: 'avocado', zone: 'tropical', emoji: '🥑', english: 'Avocado', chinese: '牛油果' },
  { id: 'pomegranate', zone: 'common', emoji: '🔴', image: 'images/fruits/pomegranate.svg', english: 'Pomegranate', chinese: '石榴' }
];

var FRUIT_SENTENCES = {
  apple:       { en: 'The apple is red.', zh: '苹果是红色的。' },
  banana:      { en: 'I like bananas.', zh: '我喜欢香蕉。' },
  orange:      { en: 'The orange is sweet.', zh: '橙子很甜。' },
  grape:       { en: 'Grapes are small and round.', zh: '葡萄又小又圆。' },
  watermelon:  { en: 'Watermelon is big and juicy.', zh: '西瓜又大又多汁。' },
  strawberry:  { en: 'Strawberries are red.', zh: '草莓是红色的。' },
  pear:        { en: 'The pear is yummy.', zh: '梨很好吃。' },
  peach:       { en: 'The peach is soft and sweet.', zh: '桃子又软又甜。' },
  mango:       { en: 'Mango is a tropical fruit.', zh: '芒果是热带水果。' },
  pineapple:   { en: 'Pineapple has a spiky skin.', zh: '菠萝皮有刺。' },
  cherry:      { en: 'Cherries are small and red.', zh: '樱桃又小又红。' },
  lemon:       { en: 'Lemon tastes sour.', zh: '柠檬是酸的。' },
  kiwi:        { en: 'Kiwi is green inside.', zh: '猕猴桃里面是绿色的。' },
  coconut:     { en: 'Coconut has white milk.', zh: '椰子有白色的汁。' },
  blueberry:   { en: 'Blueberries are tiny and blue.', zh: '蓝莓又小又蓝。' },
  melon:       { en: 'Melon is sweet and cool.', zh: '甜瓜又甜又凉。' },
  plum:        { en: 'The plum is purple.', zh: '李子是紫色的。' },
  papaya:      { en: 'Papaya is orange inside.', zh: '木瓜里面是橙色的。' },
  avocado:     { en: 'Avocado is green and soft.', zh: '牛油果又绿又软。' },
  pomegranate: { en: 'Pomegranate has many seeds.', zh: '石榴有很多籽。' }
};

SceneApp.init({ items: FRUITS, zones: FRUIT_ZONES, sentences: FRUIT_SENTENCES });
