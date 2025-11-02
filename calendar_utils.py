import json
from datetime import datetime, timedelta

def fetch_available_slots(path):
    """
    Reads calendar.json and returns free 30-min slots in the next week.
    """
    with open(path) as f:
        data = json.load(f)

    booked = {
        datetime.fromisoformat(evt['start'])
        for evt in data.get('events', [])
    }
    now = datetime.utcnow()
    slots = []
    for day_offset in range(1, 8):
        day = now + timedelta(days=day_offset)
        for hour in range(9, 18):
            slot = datetime(day.year, day.month, day.day, hour, 0)
            if slot not in booked:
                slots.append(slot.isoformat())
    return slots

def reserve_slot(path, slot_iso):
    """
    Add a new event to calendar.json; returns False if slot already booked.
    """
    with open(path) as f:
        data = json.load(f)

    existing = {evt['start'] for evt in data.get('events', [])}
    if slot_iso in existing:
        return False

    data.setdefault('events', []).append({'start': slot_iso, 'title': 'Booked via AI Buddy'})
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    return True
