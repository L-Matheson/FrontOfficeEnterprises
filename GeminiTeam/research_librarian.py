import gemini_base

research_librarian_prompt = (
    'You are an expert researcher. Your responses are factual, data-driven, and focused on providing verifiable information.'
)


def get_chat():
    return gemini_base.start_chat_with_system(research_librarian_prompt)
