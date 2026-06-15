import asyncio
import os
import edge_tts

WORDS = {
    "apple": "Apple", "banana": "Banana", "orange": "Orange", "grape": "Grape",
    "watermelon": "Watermelon", "strawberry": "Strawberry", "pear": "Pear", "peach": "Peach",
    "mango": "Mango", "pineapple": "Pineapple", "cherry": "Cherry", "lemon": "Lemon",
    "kiwi": "Kiwi", "coconut": "Coconut", "blueberry": "Blueberry", "melon": "Melon",
    "plum": "Plum", "papaya": "Papaya", "avocado": "Avocado", "pomegranate": "Pomegranate",
    "carrot": "Carrot", "tomato": "Tomato", "potato": "Potato", "cucumber": "Cucumber",
    "cabbage": "Cabbage", "eggplant": "Eggplant", "onion": "Onion", "garlic": "Garlic",
    "corn": "Corn", "pumpkin": "Pumpkin", "broccoli": "Broccoli", "spinach": "Spinach",
    "lettuce": "Lettuce", "pepper": "Pepper", "mushroom": "Mushroom", "celery": "Celery",
    "radish": "Radish", "pea": "Pea", "bean": "Bean", "sweetpotato": "Sweet Potato",
    "car": "Car", "bus": "Bus", "truck": "Truck", "bike": "Bike",
    "motorcycle": "Motorcycle", "train": "Train", "taxi": "Taxi", "ambulance": "Ambulance",
    "firetruck": "Fire Truck", "policecar": "Police Car", "van": "Van", "tractor": "Tractor",
    "airplane": "Airplane", "helicopter": "Helicopter", "rocket": "Rocket", "boat": "Boat",
    "ship": "Ship", "submarine": "Submarine",
    "father": "Father", "mother": "Mother", "brother": "Brother", "sister": "Sister",
    "baby": "Baby", "grandpa": "Grandpa", "grandma": "Grandma", "uncle": "Uncle",
    "aunt": "Aunt", "son": "Son", "daughter": "Daughter", "cousin": "Cousin",
    "family": "Family", "parents": "Parents", "friend": "Friend",
}

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "audio", "en")
VOICE = "en-US-JennyNeural"

async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    created = 0
    for word_id, text in WORDS.items():
        path = os.path.join(OUT_DIR, f"{word_id}.mp3")
        if os.path.exists(path):
            continue
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(path)
        created += 1
        print(f"Created {word_id}.mp3")
    total = len([f for f in os.listdir(OUT_DIR) if f.endswith(".mp3")])
    print(f"Done. Created {created} new files. Total: {total}")

if __name__ == "__main__":
    asyncio.run(main())
