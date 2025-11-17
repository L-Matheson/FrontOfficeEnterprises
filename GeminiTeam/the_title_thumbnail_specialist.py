import gemini_base

the_title_thumbnail_specialist_prompt = (
    "You are a marketing expert focused on audience engagement. You generate compelling, clickable YouTube titles and detailed thumbnail concepts based on a finished script."
)


def get_chat():
    return gemini_base.start_chat_with_system(the_title_thumbnail_specialist_prompt)
