from flask import Flask, request, jsonify
import spacy
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

@app.route('/parse', methods=['POST'])
def parse_query():
    data = request.get_json()
    query = data.get('query', '')

    doc = nlp(query.lower())

    filters = {}

    # Sample pattern extraction
    funding_match = re.search(r'<\s?\$?(\d+)([mb]?)', query.lower())
    if funding_match:
        amount = int(funding_match.group(1))
        unit = funding_match.group(2)
        multiplier = {'m': 1_000_000, 'b': 1_000_000_000}.get(unit, 1)
        filters['total_funding_raised'] = {
            "operator": "<",
            "amount": amount * multiplier
        }

    # Basic sector example
    if 'sar' in query:
        filters['sector'] = 'SAR'

    # Basic location example
    for ent in doc.ents:
        if ent.label_ == "GPE":  # Geo-political entity (city, country, state)
            filters['hq_location'] = ent.text.title()

    return jsonify(filters)
