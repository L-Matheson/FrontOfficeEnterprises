from flask import Blueprint, request, jsonify
from gemini_team import assistant_dean, auditor, creative_writing_fellow, researcher, visual_technician, social_media_intern, music_supervisor, title_thumbnail_specialist, gemini_base

# Create the AI blueprint
ai_bp = Blueprint('ai', __name__, url_prefix='/api')

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


@ai_bp.route('/chat', methods=['POST'])
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


@ai_bp.route('/reset-chat/<ai_id>', methods=['POST'])
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


@ai_bp.route('/token-count/<ai_id>', methods=['GET'])
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


@ai_bp.route('/list-ais', methods=['GET'])
def list_ais():
    """List all available AI assistants."""
    ais = []
    
    for ai_id, module in AI_MODULES.items():
        # Get metadata from module if available
        ai_info = {
            'id': ai_id,
            'name': getattr(module, 'AI_NAME', ai_id.replace('_', ' ').title()),
            'description': getattr(module, 'AI_DESCRIPTION', 'AI Assistant')
        }
        ais.append(ai_info)
    
    return jsonify({
        'ais': ais,
        'status': 'success'
    })