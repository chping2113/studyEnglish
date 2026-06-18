import asyncio
import os
import re

import edge_tts

BASE_DIR = os.path.join(os.path.dirname(__file__), "..")
EN_DIR = os.path.join(BASE_DIR, "audio", "en")
ZH_DIR = os.path.join(BASE_DIR, "audio", "zh")
EN_VOICE = "en-US-JennyNeural"
ZH_VOICE = "zh-CN-XiaoxiaoNeural"

# id -> English word
WORDS = {
    # animals
    "lion": "Lion", "tiger": "Tiger", "leopard": "Leopard", "elephant": "Elephant",
    "giraffe": "Giraffe", "zebra": "Zebra", "rhino": "Rhino", "hippo": "Hippo",
    "panda": "Panda", "bear": "Bear", "monkey": "Monkey", "gorilla": "Gorilla",
    "kangaroo": "Kangaroo", "koala": "Koala", "camel": "Camel", "fox": "Fox",
    "wolf": "Wolf", "deer": "Deer", "crocodile": "Crocodile", "snake": "Snake",
    "frog": "Frog", "turtle": "Turtle", "squirrel": "Squirrel", "raccoon": "Raccoon",
    "otter": "Otter", "bat": "Bat", "lizard": "Lizard", "horse": "Horse",
    "cow": "Cow", "sheep": "Sheep", "pig": "Pig", "goat": "Goat",
    "chicken": "Chicken", "duck": "Duck", "goose": "Goose", "turkey": "Turkey",
    "rabbit": "Rabbit", "buffalo": "Buffalo", "owl": "Owl", "eagle": "Eagle",
    "parrot": "Parrot", "peacock": "Peacock", "flamingo": "Flamingo", "swan": "Swan",
    "penguin": "Penguin", "dolphin": "Dolphin", "whale": "Whale", "shark": "Shark",
    "octopus": "Octopus", "seal": "Seal", "crab": "Crab", "cat": "Cat",
    "dog": "Dog", "hamster": "Hamster", "mouse": "Mouse",
    # fruits
    "apple": "Apple", "banana": "Banana", "orange": "Orange", "grape": "Grape",
    "watermelon": "Watermelon", "strawberry": "Strawberry", "pear": "Pear", "peach": "Peach",
    "mango": "Mango", "pineapple": "Pineapple", "cherry": "Cherry", "lemon": "Lemon",
    "kiwi": "Kiwi", "coconut": "Coconut", "blueberry": "Blueberry", "melon": "Melon",
    "plum": "Plum", "papaya": "Papaya", "avocado": "Avocado", "pomegranate": "Pomegranate",
    # vegetables
    "carrot": "Carrot", "tomato": "Tomato", "potato": "Potato", "cucumber": "Cucumber",
    "cabbage": "Cabbage", "eggplant": "Eggplant", "onion": "Onion", "garlic": "Garlic",
    "corn": "Corn", "pumpkin": "Pumpkin", "broccoli": "Broccoli", "spinach": "Spinach",
    "lettuce": "Lettuce", "pepper": "Pepper", "mushroom": "Mushroom", "celery": "Celery",
    "radish": "Radish", "pea": "Pea", "bean": "Bean", "sweetpotato": "Sweet Potato",
    # vehicles
    "car": "Car", "bus": "Bus", "truck": "Truck", "bike": "Bike",
    "motorcycle": "Motorcycle", "train": "Train", "taxi": "Taxi", "ambulance": "Ambulance",
    "firetruck": "Fire Truck", "policecar": "Police Car", "van": "Van", "tractor": "Tractor",
    "airplane": "Airplane", "helicopter": "Helicopter", "rocket": "Rocket", "boat": "Boat",
    "ship": "Ship", "submarine": "Submarine",
    # family
    "father": "Father", "mother": "Mother", "brother": "Brother", "sister": "Sister",
    "baby": "Baby", "grandpa": "Grandpa", "grandma": "Grandma", "uncle": "Uncle",
    "aunt": "Aunt", "son": "Son", "daughter": "Daughter", "cousin": "Cousin",
    "family": "Family", "parents": "Parents", "friend": "Friend",
}

# id -> { en, zh }
SENTENCES = {
    "lion": {"en": "This is a lion.", "zh": "这是一只狮子。"},
    "tiger": {"en": "The tiger runs fast.", "zh": "老虎跑得很快。"},
    "leopard": {"en": "I see a leopard.", "zh": "我看见一只豹子。"},
    "elephant": {"en": "The elephant is big.", "zh": "大象很大。"},
    "giraffe": {"en": "The giraffe has a long neck.", "zh": "长颈鹿脖子很长。"},
    "zebra": {"en": "The zebra has stripes.", "zh": "斑马有条纹。"},
    "rhino": {"en": "The rhino is strong.", "zh": "犀牛很强壮。"},
    "hippo": {"en": "The hippo lives in water.", "zh": "河马住在水里。"},
    "panda": {"en": "I love the panda.", "zh": "我喜欢熊猫。"},
    "bear": {"en": "The bear is furry.", "zh": "熊毛茸茸的。"},
    "monkey": {"en": "The monkey likes bananas.", "zh": "猴子喜欢香蕉。"},
    "gorilla": {"en": "The gorilla is big and strong.", "zh": "大猩猩又大又壮。"},
    "kangaroo": {"en": "The kangaroo can jump.", "zh": "袋鼠会跳。"},
    "koala": {"en": "The koala lives in a tree.", "zh": "考拉住在树上。"},
    "camel": {"en": "The camel lives in the desert.", "zh": "骆驼住在沙漠里。"},
    "fox": {"en": "The fox is clever.", "zh": "狐狸很聪明。"},
    "wolf": {"en": "The wolf howls at night.", "zh": "狼在夜里嚎叫。"},
    "deer": {"en": "The deer runs in the forest.", "zh": "鹿在森林里跑。"},
    "crocodile": {"en": "The crocodile has sharp teeth.", "zh": "鳄鱼有尖牙。"},
    "snake": {"en": "The snake is long.", "zh": "蛇很长。"},
    "frog": {"en": "The frog can jump.", "zh": "青蛙会跳。"},
    "turtle": {"en": "The turtle moves slowly.", "zh": "乌龟走得很慢。"},
    "squirrel": {"en": "The squirrel likes nuts.", "zh": "松鼠喜欢坚果。"},
    "raccoon": {"en": "The raccoon is cute.", "zh": "浣熊很可爱。"},
    "otter": {"en": "The otter swims in the river.", "zh": "水獭在河里游泳。"},
    "bat": {"en": "The bat flies at night.", "zh": "蝙蝠在夜里飞。"},
    "lizard": {"en": "The lizard likes the sun.", "zh": "蜥蜴喜欢晒太阳。"},
    "horse": {"en": "I ride a horse.", "zh": "我骑马。"},
    "cow": {"en": "The cow gives us milk.", "zh": "奶牛给我们牛奶。"},
    "sheep": {"en": "The sheep has soft wool.", "zh": "绵羊的毛很软。"},
    "pig": {"en": "The pig loves mud.", "zh": "猪喜欢玩泥。"},
    "goat": {"en": "The goat eats grass.", "zh": "山羊吃草。"},
    "chicken": {"en": "The chicken lays eggs.", "zh": "鸡会下蛋。"},
    "duck": {"en": "The duck says quack.", "zh": "鸭子嘎嘎叫。"},
    "goose": {"en": "The goose can swim.", "zh": "鹅会游泳。"},
    "turkey": {"en": "The turkey is a big bird.", "zh": "火鸡是一种大鸟。"},
    "rabbit": {"en": "The rabbit has long ears.", "zh": "兔子有长耳朵。"},
    "buffalo": {"en": "The buffalo is very strong.", "zh": "水牛非常强壮。"},
    "owl": {"en": "The owl stays awake at night.", "zh": "猫头鹰夜里醒着。"},
    "eagle": {"en": "The eagle flies very high.", "zh": "老鹰飞得很高。"},
    "parrot": {"en": "The parrot can talk.", "zh": "鹦鹉会说话。"},
    "peacock": {"en": "The peacock has pretty feathers.", "zh": "孔雀有漂亮的羽毛。"},
    "flamingo": {"en": "The flamingo is pink.", "zh": "火烈鸟是粉色的。"},
    "swan": {"en": "The swan is white.", "zh": "天鹅是白色的。"},
    "penguin": {"en": "The penguin walks on ice.", "zh": "企鹅在冰上走。"},
    "dolphin": {"en": "The dolphin is very smart.", "zh": "海豚很聪明。"},
    "whale": {"en": "The whale is very big.", "zh": "鲸鱼非常大。"},
    "shark": {"en": "The shark swims in the sea.", "zh": "鲨鱼在海里游。"},
    "octopus": {"en": "The octopus has eight arms.", "zh": "章鱼有八条触手。"},
    "seal": {"en": "The seal loves the sea.", "zh": "海豹喜欢大海。"},
    "crab": {"en": "The crab walks sideways.", "zh": "螃蟹横着走。"},
    "cat": {"en": "I have a cat.", "zh": "我有一只猫。"},
    "dog": {"en": "The dog is my friend.", "zh": "狗是我的朋友。"},
    "hamster": {"en": "The hamster is small and cute.", "zh": "仓鼠又小又可爱。"},
    "mouse": {"en": "The mouse is tiny.", "zh": "老鼠很小。"},
    "apple": {"en": "The apple is red.", "zh": "苹果是红色的。"},
    "banana": {"en": "I like bananas.", "zh": "我喜欢香蕉。"},
    "orange": {"en": "The orange is sweet.", "zh": "橙子很甜。"},
    "grape": {"en": "Grapes are small and round.", "zh": "葡萄又小又圆。"},
    "watermelon": {"en": "Watermelon is big and juicy.", "zh": "西瓜又大又多汁。"},
    "strawberry": {"en": "Strawberries are red.", "zh": "草莓是红色的。"},
    "pear": {"en": "The pear is yummy.", "zh": "梨很好吃。"},
    "peach": {"en": "The peach is soft and sweet.", "zh": "桃子又软又甜。"},
    "mango": {"en": "Mango is a tropical fruit.", "zh": "芒果是热带水果。"},
    "pineapple": {"en": "Pineapple has a spiky skin.", "zh": "菠萝皮有刺。"},
    "cherry": {"en": "Cherries are small and red.", "zh": "樱桃又小又红。"},
    "lemon": {"en": "Lemon tastes sour.", "zh": "柠檬是酸的。"},
    "kiwi": {"en": "Kiwi is green inside.", "zh": "猕猴桃里面是绿色的。"},
    "coconut": {"en": "Coconut has white milk.", "zh": "椰子有白色的汁。"},
    "blueberry": {"en": "Blueberries are tiny and blue.", "zh": "蓝莓又小又蓝。"},
    "melon": {"en": "Melon is sweet and cool.", "zh": "甜瓜又甜又凉。"},
    "plum": {"en": "The plum is purple.", "zh": "李子是紫色的。"},
    "papaya": {"en": "Papaya is orange inside.", "zh": "木瓜里面是橙色的。"},
    "avocado": {"en": "Avocado is green and soft.", "zh": "牛油果又绿又软。"},
    "pomegranate": {"en": "Pomegranate has many seeds.", "zh": "石榴有很多籽。"},
    "carrot": {"en": "Carrots are orange.", "zh": "胡萝卜是橙色的。"},
    "tomato": {"en": "Tomatoes are red.", "zh": "西红柿是红色的。"},
    "potato": {"en": "Potatoes grow in the ground.", "zh": "土豆长在地下。"},
    "cucumber": {"en": "Cucumber is long and green.", "zh": "黄瓜又长又绿。"},
    "cabbage": {"en": "Cabbage has many leaves.", "zh": "卷心菜有很多叶子。"},
    "eggplant": {"en": "Eggplant is purple.", "zh": "茄子是紫色的。"},
    "onion": {"en": "Onion can make you cry.", "zh": "洋葱会让人流眼泪。"},
    "garlic": {"en": "Garlic smells strong.", "zh": "大蒜味道很浓。"},
    "corn": {"en": "Corn is yellow on the cob.", "zh": "玉米棒是黄色的。"},
    "pumpkin": {"en": "Pumpkin is big and orange.", "zh": "南瓜又大又橙。"},
    "broccoli": {"en": "Broccoli looks like a tree.", "zh": "西兰花像一棵小树。"},
    "spinach": {"en": "Spinach is good for you.", "zh": "菠菜对你有好处。"},
    "lettuce": {"en": "Lettuce is fresh and green.", "zh": "生菜又新鲜又绿。"},
    "pepper": {"en": "Pepper can be red or green.", "zh": "甜椒有红色也有绿色。"},
    "mushroom": {"en": "Mushrooms grow after rain.", "zh": "蘑菇雨后长出来。"},
    "celery": {"en": "Celery is crunchy.", "zh": "芹菜脆脆的。"},
    "radish": {"en": "Radish is white and red.", "zh": "萝卜又白又红。"},
    "pea": {"en": "Peas are small and green.", "zh": "豌豆又小又绿。"},
    "bean": {"en": "Beans are good for you.", "zh": "豆子对你有好处。"},
    "sweetpotato": {"en": "Sweet potato is sweet.", "zh": "红薯是甜的。"},
    "car": {"en": "I go to school by car.", "zh": "我坐小汽车去上学。"},
    "bus": {"en": "The bus is big.", "zh": "公交车很大。"},
    "truck": {"en": "The truck carries things.", "zh": "卡车运送东西。"},
    "bike": {"en": "I ride my bike.", "zh": "我骑自行车。"},
    "motorcycle": {"en": "The motorcycle is fast.", "zh": "摩托车很快。"},
    "train": {"en": "The train goes choo choo.", "zh": "火车呜呜开。"},
    "taxi": {"en": "We take a taxi.", "zh": "我们坐出租车。"},
    "ambulance": {"en": "The ambulance helps people.", "zh": "救护车帮助人们。"},
    "firetruck": {"en": "The fire truck is red.", "zh": "消防车是红色的。"},
    "policecar": {"en": "The police car keeps us safe.", "zh": "警车保护我们的安全。"},
    "van": {"en": "The van is very useful.", "zh": "面包车很有用。"},
    "tractor": {"en": "The tractor works on the farm.", "zh": "拖拉机在农场工作。"},
    "airplane": {"en": "The airplane flies in the sky.", "zh": "飞机在天上飞。"},
    "helicopter": {"en": "The helicopter can hover.", "zh": "直升机可以悬停。"},
    "rocket": {"en": "The rocket goes to space.", "zh": "火箭飞向太空。"},
    "boat": {"en": "The boat floats on water.", "zh": "小船漂在水上。"},
    "ship": {"en": "The ship is very big.", "zh": "轮船非常大。"},
    "submarine": {"en": "The submarine goes under water.", "zh": "潜水艇在水下航行。"},
    "father": {"en": "My father is kind.", "zh": "我的爸爸很和蔼。"},
    "mother": {"en": "My mother loves me.", "zh": "我的妈妈爱我。"},
    "brother": {"en": "My brother plays with me.", "zh": "我的哥哥/弟弟和我玩。"},
    "sister": {"en": "My sister is my friend.", "zh": "我的姐姐/妹妹是我的朋友。"},
    "baby": {"en": "The baby is cute.", "zh": "宝宝很可爱。"},
    "grandpa": {"en": "Grandpa tells me stories.", "zh": "爷爷/外公给我讲故事。"},
    "grandma": {"en": "Grandma cooks yummy food.", "zh": "奶奶/外婆做好吃的。"},
    "uncle": {"en": "My uncle visits us.", "zh": "叔叔/舅舅来看我们。"},
    "aunt": {"en": "My aunt is very nice.", "zh": "阿姨/姑姑非常好。"},
    "son": {"en": "He is their son.", "zh": "他是他们的儿子。"},
    "daughter": {"en": "She is their daughter.", "zh": "她是他们的女儿。"},
    "cousin": {"en": "My cousin is fun.", "zh": "我的表兄弟姐妹很有趣。"},
    "family": {"en": "I love my family.", "zh": "我爱我的家庭。"},
    "parents": {"en": "My parents take care of me.", "zh": "我的父母照顾我。"},
    "friend": {"en": "A friend is special.", "zh": "朋友很特别。"},
}

# id -> Chinese word (from JS data files)
CHINESE_WORDS = {
    "lion": "狮子", "tiger": "老虎", "leopard": "豹子", "elephant": "大象",
    "giraffe": "长颈鹿", "zebra": "斑马", "rhino": "犀牛", "hippo": "河马",
    "panda": "熊猫", "bear": "熊", "monkey": "猴子", "gorilla": "大猩猩",
    "kangaroo": "袋鼠", "koala": "考拉", "camel": "骆驼", "fox": "狐狸",
    "wolf": "狼", "deer": "鹿", "crocodile": "鳄鱼", "snake": "蛇",
    "frog": "青蛙", "turtle": "乌龟", "squirrel": "松鼠", "raccoon": "浣熊",
    "otter": "水獭", "bat": "蝙蝠", "lizard": "蜥蜴", "horse": "马",
    "cow": "奶牛", "sheep": "绵羊", "pig": "猪", "goat": "山羊",
    "chicken": "鸡", "duck": "鸭子", "goose": "鹅", "turkey": "火鸡",
    "rabbit": "兔子", "buffalo": "水牛", "owl": "猫头鹰", "eagle": "老鹰",
    "parrot": "鹦鹉", "peacock": "孔雀", "flamingo": "火烈鸟", "swan": "天鹅",
    "penguin": "企鹅", "dolphin": "海豚", "whale": "鲸鱼", "shark": "鲨鱼",
    "octopus": "章鱼", "seal": "海豹", "crab": "螃蟹", "cat": "猫",
    "dog": "狗", "hamster": "仓鼠", "mouse": "老鼠",
    "apple": "苹果", "banana": "香蕉", "orange": "橙子", "grape": "葡萄",
    "watermelon": "西瓜", "strawberry": "草莓", "pear": "梨", "peach": "桃子",
    "mango": "芒果", "pineapple": "菠萝", "cherry": "樱桃", "lemon": "柠檬",
    "kiwi": "猕猴桃", "coconut": "椰子", "blueberry": "蓝莓", "melon": "甜瓜",
    "plum": "李子", "papaya": "木瓜", "avocado": "牛油果", "pomegranate": "石榴",
    "carrot": "胡萝卜", "tomato": "西红柿", "potato": "土豆", "cucumber": "黄瓜",
    "cabbage": "卷心菜", "eggplant": "茄子", "onion": "洋葱", "garlic": "大蒜",
    "corn": "玉米", "pumpkin": "南瓜", "broccoli": "西兰花", "spinach": "菠菜",
    "lettuce": "生菜", "pepper": "甜椒", "mushroom": "蘑菇", "celery": "芹菜",
    "radish": "萝卜", "pea": "豌豆", "bean": "豆子", "sweetpotato": "红薯",
    "car": "小汽车", "bus": "公交车", "truck": "卡车", "bike": "自行车",
    "motorcycle": "摩托车", "train": "火车", "taxi": "出租车", "ambulance": "救护车",
    "firetruck": "消防车", "policecar": "警车", "van": "面包车", "tractor": "拖拉机",
    "airplane": "飞机", "helicopter": "直升机", "rocket": "火箭", "boat": "小船",
    "ship": "轮船", "submarine": "潜水艇",
    "father": "爸爸", "mother": "妈妈", "brother": "哥哥/弟弟", "sister": "姐姐/妹妹",
    "baby": "宝宝", "grandpa": "爷爷/外公", "grandma": "奶奶/外婆", "uncle": "叔叔/舅舅",
    "aunt": "阿姨/姑姑", "son": "儿子", "daughter": "女儿", "cousin": "表兄弟姐妹",
    "family": "家庭", "parents": "父母", "friend": "朋友",
}


async def save_tts(path, text, voice):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(path)


async def main():
    created = 0
    tasks = []

    for word_id, text in WORDS.items():
        path = os.path.join(EN_DIR, f"{word_id}.mp3")
        if not os.path.exists(path):
            tasks.append(("en word", word_id, save_tts(path, text, EN_VOICE)))

    for word_id, parts in SENTENCES.items():
        en_path = os.path.join(EN_DIR, f"{word_id}-sentence.mp3")
        if not os.path.exists(en_path):
            tasks.append(("en sentence", word_id, save_tts(en_path, parts["en"], EN_VOICE)))

        zh_word = CHINESE_WORDS.get(word_id)
        if zh_word:
            zh_path = os.path.join(ZH_DIR, f"{word_id}.mp3")
            if not os.path.exists(zh_path):
                tasks.append(("zh word", word_id, save_tts(zh_path, zh_word, ZH_VOICE)))

        zh_sentence_path = os.path.join(ZH_DIR, f"{word_id}-sentence.mp3")
        if not os.path.exists(zh_sentence_path):
            tasks.append(("zh sentence", word_id, save_tts(zh_sentence_path, parts["zh"], ZH_VOICE)))

    for label, word_id, coro in tasks:
        await coro
        created += 1
        print(f"Created {label}: {word_id}")

    en_total = len([f for f in os.listdir(EN_DIR) if f.endswith(".mp3")]) if os.path.isdir(EN_DIR) else 0
    zh_total = len([f for f in os.listdir(ZH_DIR) if f.endswith(".mp3")]) if os.path.isdir(ZH_DIR) else 0
    print(f"Done. Created {created} new files. EN total: {en_total}, ZH total: {zh_total}")


if __name__ == "__main__":
    asyncio.run(main())
