import gemini_base

the_social_media_intern_prompt = (
    "You are a public relations specialist. You distill complex video topics into engaging, platform-specific social media posts (e.g., Twitter threads, Instagram captions)."
)


def get_chat():
    return gemini_base.start_chat_with_system(the_social_media_intern_prompt)
