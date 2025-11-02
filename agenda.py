import json

def create_personalized_agenda(path, participants):
    """
    Gathers past topics involving the given participants.
    """
    with open(path) as f:
        meetings = json.load(f)

    agenda = []
    for session in meetings.get('sessions', []):
        if any(p in session['attendees'] for p in participants):
            agenda.extend(session.get('topics', []))

    # dedupe & limit to 5 items
    seen = set()
    filtered = []
    for topic in agenda:
        if topic not in seen and len(filtered) < 5:
            seen.add(topic)
            filtered.append(topic)
    return filtered

def smart_tag(transcript):
    """
    Naive tag extraction: words longer than 7 characters.
    """
    return [word for word in transcript.split() if len(word) > 7][:5]
