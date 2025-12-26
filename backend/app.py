from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the gemini_team directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'gemini_team'))

# Import all AI modules
import assistant_dean
import auditor
import creative_writing_fellow
import researcher
import visual_technician
import social_media_intern
import music_supervisor
import title_thumbnail_specialist
import gemini_base

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Store chat sessions per AI (in production, use Redis or similar)
chat_sessions = {}

# Map AI IDs to their respective module get_chat functions
AI_MODULES = {
    "assistant_dean": assistant_dean,
    "auditor": auditor,
    "creative_writing_fellow": creative_writing_fellow,
    "research_librarian": researcher,
    "the_archivist": visual_technician,
    "the_social_media_intern": social_media_intern,
    "the_music_supervisor": music_supervisor,
    "the_title_thumbnail_specialist": title_thumbnail_specialist
}


def get_or_create_chat(ai_id):
    """Get existing chat session or create a new one for the specified AI."""
    if ai_id not in chat_sessions:
        if ai_id in AI_MODULES:
            # Use the specific AI module's get_chat function
            chat_sessions[ai_id] = AI_MODULES[ai_id].get_chat()
        else:
            # Fallback to assistant dean if AI not found
            chat_sessions[ai_id] = assistant_dean.get_chat()
    return chat_sessions[ai_id]


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages from the frontend."""
    try:
        data = request.json
        ai_id = data.get('ai_id', 'assistant_dean')
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create chat session for this AI
        chat_session = get_or_create_chat(ai_id)
        
        # Send message and get response
        response_text = gemini_base.ask_model(message, chat_session)
        
        return jsonify({
            'response': response_text,
            'ai_id': ai_id,
            'status': 'success'
        })
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


@app.route('/api/reset-chat/<ai_id>', methods=['POST'])
def reset_chat(ai_id):
    """Reset the chat session for a specific AI."""
    try:
        if ai_id in chat_sessions:
            del chat_sessions[ai_id]
        
        return jsonify({
            'message': f'Chat session reset for {ai_id}',
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


@app.route('/api/token-count/<ai_id>', methods=['GET'])
def get_token_count(ai_id):
    """Get token count for a specific AI's chat history."""
    try:
        if ai_id not in chat_sessions:
            return jsonify({
                'token_count': 0,
                'ai_id': ai_id
            })
        
        chat_session = chat_sessions[ai_id]
        token_count = gemini_base.count_tokens(chat_session.history)
        
        return jsonify({
            'token_count': token_count.total_tokens if hasattr(token_count, 'total_tokens') else token_count,
            'ai_id': ai_id,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'active_sessions': len(chat_sessions),
        'available_ais': list(AI_MODULES.keys())
    })


@app.route('/api/list-ais', methods=['GET'])
def list_ais():
    """List all available AI assistants."""
    return jsonify({
        'ais': [
            {
                'id': 'assistant_dean',
                'name': 'Assistant Dean',
                'description': 'Strategic partner and Chief of Staff for the Hardwood Academy'
            },
            {
                'id': 'auditor',
                'name': 'The Auditor',
                'description': 'NTSB Investigator ensuring safety, accuracy, and Just Culture alignment'
            },
            {
                'id': 'creative_writing_fellow',
                'name': 'Creative Writing Fellow',
                'description': 'Transforms forensic fact sheets into financial thrillers'
            },
            {
                'id': 'research_librarian',
                'name': 'Research Librarian',
                'description': 'Provides forensic fact sheets with verified dates and contract numbers'
            },
            {
                'id': 'the_archivist',
                'name': 'The Archivist',
                'description': 'Visual technician translating scripts into shot lists'
            },
            {
                'id': 'the_social_media_intern',
                'name': 'The Social Media Intern',
                'description': 'Condenses documentaries into 60-second flight logs'
            },
            {
                'id': 'the_music_supervisor',
                'name': 'The Music Supervisor',
                'description': 'Selects sonic identity for case files'
            },
            {
                'id': 'the_title_thumbnail_specialist',
                'name': 'The Title/Thumbnail Specialist',
                'description': 'Packaging specialist and Trojan Horse architect'
            }
        ],
        'status': 'success'
    })


if __name__ == '__main__':
    print("=" * 60)
    print("Starting Gemini AI Team Backend Server (Hardwood Academy)")
    print("=" * 60)
    print("Available AI Assistants:")
    for ai_id, module in AI_MODULES.items():
        print(f"  - {ai_id}")
    print("Server starting on http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, port=5000)