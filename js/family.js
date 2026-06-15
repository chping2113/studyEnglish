var FAMILY_ZONES = [
  { id: 'all', label: '全部', icon: '🌍' },
  { id: 'core', label: '家人', icon: '👨‍👩‍👧' },
  { id: 'elder', label: '长辈', icon: '👴' },
  { id: 'other', label: '其他', icon: '💛' }
];

var FAMILY = [
  { id: 'father', zone: 'core', emoji: '👨', english: 'Father', chinese: '爸爸' },
  { id: 'mother', zone: 'core', emoji: '👩', english: 'Mother', chinese: '妈妈' },
  { id: 'brother', zone: 'core', emoji: '👦', english: 'Brother', chinese: '哥哥/弟弟' },
  { id: 'sister', zone: 'core', emoji: '👧', english: 'Sister', chinese: '姐姐/妹妹' },
  { id: 'baby', zone: 'core', emoji: '👶', english: 'Baby', chinese: '宝宝' },
  { id: 'grandpa', zone: 'elder', emoji: '👴', english: 'Grandpa', chinese: '爷爷/外公' },
  { id: 'grandma', zone: 'elder', emoji: '👵', english: 'Grandma', chinese: '奶奶/外婆' },
  { id: 'uncle', zone: 'elder', emoji: '🧔', english: 'Uncle', chinese: '叔叔/舅舅' },
  { id: 'aunt', zone: 'elder', emoji: '👩‍🦱', english: 'Aunt', chinese: '阿姨/姑姑' },
  { id: 'son', zone: 'other', emoji: '👦', english: 'Son', chinese: '儿子' },
  { id: 'daughter', zone: 'other', emoji: '👧', english: 'Daughter', chinese: '女儿' },
  { id: 'cousin', zone: 'other', emoji: '🧒', english: 'Cousin', chinese: '表兄弟姐妹' },
  { id: 'family', zone: 'other', emoji: '👨‍👩‍👧‍👦', english: 'Family', chinese: '家庭' },
  { id: 'parents', zone: 'other', emoji: '👨‍👩', english: 'Parents', chinese: '父母' },
  { id: 'friend', zone: 'other', emoji: '🤝', english: 'Friend', chinese: '朋友' }
];

var FAMILY_SENTENCES = {
  father:  { en: 'My father is kind.', zh: '我的爸爸很和蔼。' },
  mother:  { en: 'My mother loves me.', zh: '我的妈妈爱我。' },
  brother: { en: 'My brother plays with me.', zh: '我的哥哥/弟弟和我玩。' },
  sister:  { en: 'My sister is my friend.', zh: '我的姐姐/妹妹是我的朋友。' },
  baby:    { en: 'The baby is cute.', zh: '宝宝很可爱。' },
  grandpa: { en: 'Grandpa tells me stories.', zh: '爷爷/外公给我讲故事。' },
  grandma: { en: 'Grandma cooks yummy food.', zh: '奶奶/外婆做好吃的。' },
  uncle:   { en: 'My uncle visits us.', zh: '叔叔/舅舅来看我们。' },
  aunt:    { en: 'My aunt is very nice.', zh: '阿姨/姑姑非常好。' },
  son:     { en: 'He is their son.', zh: '他是他们的儿子。' },
  daughter:{ en: 'She is their daughter.', zh: '她是他们的女儿。' },
  cousin:  { en: 'My cousin is fun.', zh: '我的表兄弟姐妹很有趣。' },
  family:  { en: 'I love my family.', zh: '我爱我的家庭。' },
  parents: { en: 'My parents take care of me.', zh: '我的父母照顾我。' },
  friend:  { en: 'A friend is special.', zh: '朋友很特别。' }
};

SceneApp.init({ items: FAMILY, zones: FAMILY_ZONES, sentences: FAMILY_SENTENCES });
