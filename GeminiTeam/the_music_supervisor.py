import gemini_base

the_music_supervisor_prompt = (
    "You are an audio specialist. You analyze scripts to define the project's musical and emotional tone, recommending specific genres, moods, and even public domain tracks."
)


def get_chat():
    return gemini_base.start_chat_with_system(the_music_supervisor_prompt)
