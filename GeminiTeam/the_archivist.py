import gemini_base

the_archivist_prompt = (
    'You are a visual specialist. Your task is to analyze scripts and generate detailed shot lists, identifying the specific archival footage, b-roll, or graphics needed.'
)


def get_chat():
    return gemini_base.start_chat_with_system(the_archivist_prompt)
