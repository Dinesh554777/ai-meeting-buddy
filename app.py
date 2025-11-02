# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS

import modules.calendar_utils as cal
import modules.agenda        as ag
import modules.reminders     as rm
import modules.trust_score   as ts
import modules.gamification  as gm


app = Flask(__name__)
CORS(app)

@app.route('/api/calendar', methods=['GET'])
def get_calendar_slots():
    slots = cal.fetch_available_slots('data/calendar.json')
    return jsonify({'available_slots': slots})

@app.route('/api/calendar/book', methods=['POST'])
def book_calendar_slot():
    data = request.json
    slot = data.get('slot')
    participants = data.get('participants', [])
    # simple in-memory reserve, replace with DB in prod
    success = cal.reserve_slot('data/calendar.json', slot)
    if not success:
        return jsonify({'error': 'Slot unavailable'}), 409
    return jsonify({'status': 'booked', 'slot': slot, 'participants': participants}), 201

@app.route('/api/agenda', methods=['POST'])
def generate_agenda():
    participants = request.json.get('participants', [])
    agenda = ag.create_personalized_agenda('data/meetings.json', participants)
    return jsonify({'agenda': agenda})

@app.route('/api/transcript', methods=['POST'])
def transcribe_meeting():
    audio_url = request.json.get('audio_url')
    # stub: integrate real ASR here
    transcript = "This is a dummy transcript of the meeting."
    tags = ag.smart_tag(transcript)
    return jsonify({'transcript': transcript, 'tags': tags})

@app.route('/api/reminders', methods=['GET'])
def list_reminders():
    reminders = rm.load_reminders('data/followups.csv')
    return jsonify({'reminders': reminders})

@app.route('/api/reminders', methods=['POST'])
def add_reminder():
    item = request.json
    rm.save_reminder('data/followups.csv', item)
    return jsonify({'status': 'ok'}), 201

@app.route('/api/trust_score', methods=['GET'])
def get_trust_score():
    score = ts.compute_trust_score('data/followups.csv')
    return jsonify({'trust_score': score})

@app.route('/api/gamification', methods=['GET'])
def get_game_points():
    points = gm.calculate_points('data/followups.csv')
    return jsonify({'points': points})

if __name__ == '__main__':
    app.run(debug=True, port=5000, ssl_context='adhoc')
