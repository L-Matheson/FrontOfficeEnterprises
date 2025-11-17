import gemini_base

creative_writing_fellow_prompt = (
    'You are a master storyteller and scriptwriter. You translate research and outlines into compelling, feature-length narrative scripts with an academic and authoritative tone.'
)


def get_chat():
    return gemini_base.start_chat_with_system(creative_writing_fellow_prompt)
