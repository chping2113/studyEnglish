var VEHICLE_ZONES = [
  { id: 'all', label: '全部', icon: '🌍' },
  { id: 'land', label: '陆地', icon: '🛣️' },
  { id: 'air', label: '空中', icon: '✈️' },
  { id: 'water', label: '水上', icon: '🌊' }
];

var VEHICLES = [
  { id: 'car', zone: 'land', emoji: '🚗', english: 'Car', chinese: '小汽车' },
  { id: 'bus', zone: 'land', emoji: '🚌', english: 'Bus', chinese: '公交车' },
  { id: 'truck', zone: 'land', emoji: '🚚', english: 'Truck', chinese: '卡车' },
  { id: 'bike', zone: 'land', emoji: '🚲', english: 'Bike', chinese: '自行车' },
  { id: 'motorcycle', zone: 'land', emoji: '🏍️', english: 'Motorcycle', chinese: '摩托车' },
  { id: 'train', zone: 'land', emoji: '🚂', english: 'Train', chinese: '火车' },
  { id: 'taxi', zone: 'land', emoji: '🚕', english: 'Taxi', chinese: '出租车' },
  { id: 'ambulance', zone: 'land', emoji: '🚑', english: 'Ambulance', chinese: '救护车' },
  { id: 'firetruck', zone: 'land', emoji: '🚒', english: 'Fire Truck', chinese: '消防车' },
  { id: 'policecar', zone: 'land', emoji: '🚓', english: 'Police Car', chinese: '警车' },
  { id: 'van', zone: 'land', emoji: '🚐', english: 'Van', chinese: '面包车' },
  { id: 'tractor', zone: 'land', emoji: '🚜', english: 'Tractor', chinese: '拖拉机' },
  { id: 'airplane', zone: 'air', emoji: '✈️', english: 'Airplane', chinese: '飞机' },
  { id: 'helicopter', zone: 'air', emoji: '🚁', english: 'Helicopter', chinese: '直升机' },
  { id: 'rocket', zone: 'air', emoji: '🚀', english: 'Rocket', chinese: '火箭' },
  { id: 'boat', zone: 'water', emoji: '⛵', english: 'Boat', chinese: '小船' },
  { id: 'ship', zone: 'water', emoji: '🚢', english: 'Ship', chinese: '轮船' },
  { id: 'submarine', zone: 'water', emoji: '🛥️', english: 'Submarine', chinese: '潜水艇' }
];

var VEHICLE_SENTENCES = {
  car:        { en: 'I go to school by car.', zh: '我坐小汽车去上学。' },
  bus:        { en: 'The bus is big.', zh: '公交车很大。' },
  truck:      { en: 'The truck carries things.', zh: '卡车运送东西。' },
  bike:       { en: 'I ride my bike.', zh: '我骑自行车。' },
  motorcycle: { en: 'The motorcycle is fast.', zh: '摩托车很快。' },
  train:      { en: 'The train goes choo choo.', zh: '火车呜呜开。' },
  taxi:       { en: 'We take a taxi.', zh: '我们坐出租车。' },
  ambulance:  { en: 'The ambulance helps people.', zh: '救护车帮助人们。' },
  firetruck:  { en: 'The fire truck is red.', zh: '消防车是红色的。' },
  policecar:  { en: 'The police car keeps us safe.', zh: '警车保护我们的安全。' },
  van:        { en: 'The van is very useful.', zh: '面包车很有用。' },
  tractor:    { en: 'The tractor works on the farm.', zh: '拖拉机在农场工作。' },
  airplane:   { en: 'The airplane flies in the sky.', zh: '飞机在天上飞。' },
  helicopter: { en: 'The helicopter can hover.', zh: '直升机可以悬停。' },
  rocket:     { en: 'The rocket goes to space.', zh: '火箭飞向太空。' },
  boat:       { en: 'The boat floats on water.', zh: '小船漂在水上。' },
  ship:       { en: 'The ship is very big.', zh: '轮船非常大。' },
  submarine:  { en: 'The submarine goes under water.', zh: '潜水艇在水下航行。' }
};

SceneApp.init({ items: VEHICLES, zones: VEHICLE_ZONES, sentences: VEHICLE_SENTENCES });
