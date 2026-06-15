var VEG_ZONES = [
  { id: 'all', label: '全部', icon: '🌍' },
  { id: 'leafy', label: '叶菜', icon: '🥬' },
  { id: 'root', label: '根茎', icon: '🥕' },
  { id: 'common', label: '常见', icon: '⭐' }
];

var VEGETABLES = [
  { id: 'carrot', zone: 'root', emoji: '🥕', english: 'Carrot', chinese: '胡萝卜' },
  { id: 'tomato', zone: 'common', emoji: '🍅', english: 'Tomato', chinese: '西红柿' },
  { id: 'potato', zone: 'root', emoji: '🥔', english: 'Potato', chinese: '土豆' },
  { id: 'cucumber', zone: 'common', emoji: '🥒', english: 'Cucumber', chinese: '黄瓜' },
  { id: 'cabbage', zone: 'leafy', emoji: '🥬', english: 'Cabbage', chinese: '卷心菜' },
  { id: 'eggplant', zone: 'common', emoji: '🍆', english: 'Eggplant', chinese: '茄子' },
  { id: 'onion', zone: 'root', emoji: '🧅', english: 'Onion', chinese: '洋葱' },
  { id: 'garlic', zone: 'root', emoji: '🧄', english: 'Garlic', chinese: '大蒜' },
  { id: 'corn', zone: 'common', emoji: '🌽', english: 'Corn', chinese: '玉米' },
  { id: 'pumpkin', zone: 'common', emoji: '🎃', english: 'Pumpkin', chinese: '南瓜' },
  { id: 'broccoli', zone: 'leafy', emoji: '🥦', english: 'Broccoli', chinese: '西兰花' },
  { id: 'spinach', zone: 'leafy', emoji: '🍃', english: 'Spinach', chinese: '菠菜' },
  { id: 'lettuce', zone: 'leafy', emoji: '🥗', english: 'Lettuce', chinese: '生菜' },
  { id: 'pepper', zone: 'common', emoji: '🫑', english: 'Pepper', chinese: '甜椒' },
  { id: 'mushroom', zone: 'common', emoji: '🍄', english: 'Mushroom', chinese: '蘑菇' },
  { id: 'celery', zone: 'leafy', emoji: '🌿', english: 'Celery', chinese: '芹菜' },
  { id: 'radish', zone: 'root', emoji: '🔴', english: 'Radish', chinese: '萝卜' },
  { id: 'pea', zone: 'common', emoji: '🫛', english: 'Pea', chinese: '豌豆' },
  { id: 'bean', zone: 'common', emoji: '🫘', english: 'Bean', chinese: '豆子' },
  { id: 'sweetpotato', zone: 'root', emoji: '🍠', english: 'Sweet Potato', chinese: '红薯' }
];

var VEG_SENTENCES = {
  carrot:      { en: 'Carrots are orange.', zh: '胡萝卜是橙色的。' },
  tomato:      { en: 'Tomatoes are red.', zh: '西红柿是红色的。' },
  potato:      { en: 'Potatoes grow in the ground.', zh: '土豆长在地下。' },
  cucumber:    { en: 'Cucumber is long and green.', zh: '黄瓜又长又绿。' },
  cabbage:     { en: 'Cabbage has many leaves.', zh: '卷心菜有很多叶子。' },
  eggplant:    { en: 'Eggplant is purple.', zh: '茄子是紫色的。' },
  onion:       { en: 'Onion can make you cry.', zh: '洋葱会让人流眼泪。' },
  garlic:      { en: 'Garlic smells strong.', zh: '大蒜味道很浓。' },
  corn:        { en: 'Corn is yellow on the cob.', zh: '玉米棒是黄色的。' },
  pumpkin:     { en: 'Pumpkin is big and orange.', zh: '南瓜又大又橙。' },
  broccoli:    { en: 'Broccoli looks like a tree.', zh: '西兰花像一棵小树。' },
  spinach:     { en: 'Spinach is good for you.', zh: '菠菜对你有好处。' },
  lettuce:     { en: 'Lettuce is fresh and green.', zh: '生菜又新鲜又绿。' },
  pepper:      { en: 'Pepper can be red or green.', zh: '甜椒有红色也有绿色。' },
  mushroom:    { en: 'Mushrooms grow after rain.', zh: '蘑菇雨后长出来。' },
  celery:      { en: 'Celery is crunchy.', zh: '芹菜脆脆的。' },
  radish:      { en: 'Radish is white and red.', zh: '萝卜又白又红。' },
  pea:         { en: 'Peas are small and green.', zh: '豌豆又小又绿。' },
  bean:        { en: 'Beans are good for you.', zh: '豆子对你有好处。' },
  sweetpotato: { en: 'Sweet potato is sweet.', zh: '红薯是甜的。' }
};

SceneApp.init({ items: VEGETABLES, zones: VEG_ZONES, sentences: VEG_SENTENCES });
