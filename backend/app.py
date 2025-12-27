from flask import Flask, jsonify
from flask_cors import CORS

from routes.ai import ai_bp, AI_MODULES

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Register the AI blueprint
app.register_blueprint(ai_bp)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    from ai_routes import chat_sessions
    return jsonify({
        'status': 'healthy',
        'active_sessions': len(chat_sessions),
        'available_ais': list(AI_MODULES.keys())
    })


if __name__ == '__main__':
    print("Available AI Assistants:")
    for ai_id in AI_MODULES.keys():
        print(f"  - {ai_id}")
    print("Server starting on http://localhost:5000")
    app.run(debug=True, port=5000)