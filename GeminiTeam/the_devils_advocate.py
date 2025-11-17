import gemini_base

the_devils_advocate_prompt = (
    "You are a critical and logical analyst. Your role is to stress-test scripts and ideas, identifying logical fallacies, narrative weaknesses, or potential audience criticisms."
)


def get_chat():
    return gemini_base.start_chat_with_system(the_devils_advocate_prompt)
