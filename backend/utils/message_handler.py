"""
Message Handler Utility

The current utility will be hard coded to handle messages, soon should
be generic to allow user input

"""

import re

test_input="""

Excellent directive, Dean.

This is a foundational pillar for The History Book. A comprehensive understanding of the league's origin story is pure Signal; it provides the context for every modern strategic and regulatory debate. Without this, we're just consuming Noise.

I am routing this directive through the Manual Operating System (MOS). Here is the operational plan for the "History of Basketball" course.

Project Title: Genesis: The Forging of the Modern NBA Department: The History Book Tier Level: 1 (Foundational)

Proposed Course Syllabus (Module Breakdown):
Module 1: The Invention (1891-1946)

Focus: From a PE class solution to a fledgling professional concept.
Key Concepts: James Naismith's 13 original rules, the barnstorming era (Original Celtics, NY Rens), the formation of early, unstable professional leagues (NBL, ABL).
Signal: The initial design principles of the game and the economic chaos that preceded a unified league.
Module 2: The BAA/NBL Merger & The Mikan Era (1946-1954)

Focus: The birth of the NBA and the league's first superstar.
Key Concepts: The formation of the Basketball Association of America (BAA) by arena owners, the 1949 merger with the National Basketball League (NBL), the dominance of George Mikan and the Minneapolis Lakers, the introduction of the shot clock to combat stalling.
Signal: How business interests (arena owners) stabilized the sport and how a single dominant strategy (Mikan's post play) forced a critical rule change (Rulebook crossover).
Module 3: The Dynasty & The Barrier (1955-1969)

Focus: The Celtics' dominance and the league's full integration.
Key Concepts: Bill Russell, Red Auerbach, and the systemic team-building of the Boston Celtics. The breaking of the color barrier and the rise of Black superstars who would define the next generation (Wilt Chamberlain, Oscar Robertson, Elgin Baylor).
Signal: Establishing the concept of a "dynasty" through superior front-office strategy. Analyzing the societal and on-court impact of the league's changing demographics.
Module 4: The Upstart - The ABA (1967-1976)

Focus: A rival league built on innovation, style, and financial risk.
Key Concepts: The 3-point line, the slam dunk contest, pace-and-space style of play, franchise instability, and iconic figures (Julius Erving, George Gervin).
Signal: Competition as a driver of innovation. This module will be a case study in market disruption and unsustainable business models. A perfect Just Culture analysis of a league's systemic collapse.
Module 5: The Merger (1976)

Focus: The complex absorption of the ABA and its lasting impact on the NBA.
Key Concepts: The four absorbed teams (Nets, Pacers, Nuggets, Spurs), the dispersal draft, the financial penalties on incoming teams, and the infamous "Spirits of St. Louis" TV rights deal.
Signal: A masterclass in leverage, negotiation, and long-term financial structuring. We will analyze this not as a simple event, but as one of the most important business transactions in American sports history.
MOS Execution Plan:
Researcher: Is now tasked with Phase 1.

Objective: Gather primary and secondary source materials for each module. This includes sourcing original rulebooks, financial data on the BAA/NBL and ABA/NBA mergers, player contracts where available, and timelines of key events.
Key Deliverable: A detailed dossier for each module containing verified facts, key figures, and a chronological event log. I have instructed them to pay special attention to the financial and legal mechanics of the 1976 merger.
Writer: Will be on standby to receive the researcher's dossier.

Objective: Synthesize the research into a clear, compelling narrative for each course module, adhering strictly to the Signal Engine philosophy. The focus must be on cause-and-effect, not just a recitation of events.
Auditor: Will review the Writer's drafts.

Objective: Fact-check every claim. More importantly, they will act as the guardian of our philosophy, ensuring the analysis is systemic (Just Culture) and avoids simplistic, individual-blame narratives.
Viz (Visualization): Will conceptualize visual aids in parallel.

Objective: Develop infographics to make complex information digestible. I envision:
An interactive timeline of league formation and franchise movement.
A financial chart illustrating the ABA's perilous cash flow vs. the NBA's.
A diagram explaining the legal and financial structure of the 1976 merger.
This project is now in motion. I will keep you appraised as it moves through the MOS pipeline. Awaiting your sign-off on this proposed structure before the Researcher proceeds beyond initial sourcing.

"""

class MessageHandler:

    # Maps MOS role labels to existing AI module IDs.
    # Adjust labels here if the Dean uses different names.
    ROLE_TO_AI_ID = {
        "researcher": "research_librarian",
        "research librarian": "research_librarian",
        "writer": "creative_writing_fellow",
        "creative writing fellow": "creative_writing_fellow",
        "auditor": "auditor",
        "viz": "the_archivist",
        "visual": "the_archivist",
        "visual technician": "the_archivist",
        "archivist": "the_archivist",
        "social media intern": "the_social_media_intern",
        "music supervisor": "the_music_supervisor",
        "title/thumbnail specialist": "the_title_thumbnail_specialist",
        "title thumbnail specialist": "the_title_thumbnail_specialist",
    }
    
    def extract_modules(text: str):
        """
        Extract syllabus modules from a structured course document.
        Prefer the 'Proposed Course Syllabus' section when present, but fall back
        to parsing a 'Course Syllabus' section (including numbered formats) when present.
        As a final fallback, parse for 'Module X:' blocks only when the text strongly
        indicates it is a syllabus (to avoid false positives from forwarded scripts).
        """
        # 1) Best: explicit "Proposed Course Syllabus" block.
        proposed_block = MessageHandler._extract_syllabus_block(text)
        if proposed_block:
            return MessageHandler._parse_modules_from_block(proposed_block)

        # 2) Next best: explicit "Course Syllabus" block (supports numbered layouts).
        course_block = MessageHandler._extract_course_syllabus_block(text)
        if course_block:
            modules = MessageHandler._parse_numbered_syllabus_from_block(course_block)
            if modules:
                return modules

            # If the course syllabus block used "Module X:" style, handle that too.
            modules = MessageHandler._parse_modules_from_block(course_block)
            if modules:
                return modules

        # 3) Last resort: parse whole response for "Module X:" blocks, but only
        # when it looks like an actual syllabus. This prevents random occurrences
        # like "MODULE 3:" inside a forwarded screenplay from triggering the timeline.
        lower = (text or "").lower()
        looks_like_syllabus = ("syllabus" in lower) or ("course syllabus" in lower)
        modules = MessageHandler._parse_modules_from_block(text)
        if modules and (looks_like_syllabus or len(modules) >= 2):
            return modules

        return []


    def _extract_course_syllabus_block(text: str) -> str:
        """Extract content following a 'Course Syllabus' heading, stopping before MOS."""
        pattern = re.compile(
            r"(?:^|\n)\s*(?:#{1,6}\s*)?(?:\*\*\s*)?Course\s+Syllabus\b\s*\n(.*?)(?=\n\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS Execution Plan\s*:\s*|\Z)",
            re.IGNORECASE | re.S,
        )
        match = pattern.search(text or "")
        return match.group(1).strip() if match else ""


    def _parse_numbered_syllabus_from_block(text: str):
        """Parse numbered course syllabus blocks like:

        Course Syllabus
        1
        Title
        1946-1956
        Body...
        2
        ...
        """
        lines = [(ln or "").rstrip() for ln in (text or "").splitlines()]

        def is_number_line(s: str) -> bool:
            s = (s or "").strip()
            return bool(re.fullmatch(r"\d{1,2}", s))

        def is_dates_line(s: str) -> bool:
            s = (s or "").strip()
            # Common patterns: 1891-1946, 1999-Present, 1979-1991
            return bool(re.fullmatch(r"\d{4}\s*[-–—]\s*(?:\d{4}|present)", s, flags=re.IGNORECASE))

        modules = []
        idx = 0
        n = len(lines)

        while idx < n:
            if not is_number_line(lines[idx]):
                idx += 1
                continue

            number = int(lines[idx].strip())
            idx += 1

            # Skip blank lines
            while idx < n and not lines[idx].strip():
                idx += 1
            if idx >= n:
                break

            title = lines[idx].strip()
            idx += 1

            # Skip blank lines
            while idx < n and not lines[idx].strip():
                idx += 1

            dates = None
            if idx < n and is_dates_line(lines[idx]):
                dates = lines[idx].strip()
                idx += 1

            # Collect body until next module number line
            body_lines = []
            while idx < n and not is_number_line(lines[idx]):
                body_lines.append(lines[idx])
                idx += 1

            body = "\n".join([ln for ln in body_lines]).strip()

            # Basic validation: a syllabus module needs a non-empty title.
            if title:
                modules.append({
                    "number": number,
                    "title": title,
                    "dates": dates,
                    "body": body,
                })

        return modules


    def extract_mos_execution_plan(text: str) -> str:
        """Extract the MOS Execution Plan section as plain text (Markdown preserved)."""
        pattern = re.compile(
            r"(?:^|\n)\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS Execution Plan:\s*(.*)$",
            re.IGNORECASE | re.S,
        )
        match = pattern.search(text)
        return match.group(1).strip() if match else ""


    def extract_assignments(text: str):
        """Extract "To X:" instruction blocks from the MOS Execution Plan.

        Returns a list of objects: {target_label, target_ai_id, content}
        """
        mos = MessageHandler.extract_mos_execution_plan(text)
        if not mos:
            return []

        pattern = re.compile(
            r"(?:^|\n)\s*(?:[-*]\s*)?(?:\*\*\s*)?To\s+(?P<label>[^:]{2,50})\s*:\s*(?:\*\*\s*)?(?P<body>.+?)(?=(?:\n\s*(?:[-*]\s*)?(?:\*\*\s*)?To\s+[^:]{2,50}\s*:\s*)|\Z)",
            re.IGNORECASE | re.S,
        )

        assignments = []
        for m in pattern.finditer(mos):
            label = (m.group("label") or "").strip().strip('*').strip()
            body = (m.group("body") or "").strip()
            if not label or not body:
                continue

            key = re.sub(r"\s+", " ", label.lower()).strip()
            target_ai_id = MessageHandler.ROLE_TO_AI_ID.get(key)

            assignments.append({
                "target_label": label,
                "target_ai_id": target_ai_id,
                "content": body,
            })

        return assignments


    def extract_non_syllabus_text(text: str) -> str:
        """Return the Dean response with syllabus + MOS sections removed.

        This prevents losing important narrative (e.g., forwarded drafts) when the
        API returns a structured modules array for timeline rendering.
        """
        if not text:
            return ""

        cleaned = text

        # Remove Proposed Course Syllabus section if present.
        cleaned = re.sub(
            r"(?is)(?:^|\n)\s*(?:#{1,6}\s*)?(?:\*\*\s*)?Proposed\s+Course\s+Syllabus.*?:\s*.*?(?=\n\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS\s+Execution\s+Plan\s*:\s*|\Z)",
            "\n",
            cleaned,
        )

        # Remove Course Syllabus section if present.
        cleaned = re.sub(
            r"(?is)(?:^|\n)\s*(?:#{1,6}\s*)?(?:\*\*\s*)?Course\s+Syllabus\b\s*\n.*?(?=\n\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS\s+Execution\s+Plan\s*:\s*|\Z)",
            "\n",
            cleaned,
        )

        # Remove MOS Execution Plan section (including everything after it).
        cleaned = re.sub(
            r"(?is)(?:^|\n)\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS\s+Execution\s+Plan\s*:\s*.*$",
            "\n",
            cleaned,
        )

        # Normalize whitespace.
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
        return cleaned

    
    
    def _extract_syllabus_block(text: str) -> str:
        # Accept Markdown headings like:
        # "### Proposed Course Syllabus ..." and "### MOS Execution Plan:"
        pattern = re.compile(
            r"Proposed Course Syllabus.*?:\s*(.*?)\n\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS Execution Plan:\s*",
            re.IGNORECASE | re.S,
        )
        match = pattern.search(text)
        return match.group(1).strip() if match else ""

     
    def _parse_modules_from_block(text: str):
        # Accept headings like:
        # - Module 1: Title
        # - **Module 1: Title**
        # - ### Module 1: Title
        # and stop on the next module heading.
        mos_stop = r"\n\s*(?:#{1,6}\s*)?(?:\*\*\s*)?MOS Execution Plan:\s*"
        pattern = re.compile(
            rf"(?:^|\n)\s*(?:[-*]\s*)?(?:#{1,6}\s*)?(?:\*\*\s*)?Module\s*(?P<number>\d+)\s*:\s*(?P<content>.+?)(?=(?:\n\s*(?:[-*]\s*)?(?:#{1,6}\s*)?(?:\*\*\s*)?Module\s*\d+\s*:)|{mos_stop}|\Z)",
            re.IGNORECASE | re.S,
        )

        modules = []
        for m in pattern.finditer(text):
            raw_num = m.group("number")
            if not raw_num:
                continue

            try:
                num = int(raw_num)
            except (TypeError, ValueError):
                continue

            title_and_rest = (m.group("content") or "").lstrip()
            if not title_and_rest:
                continue

            if "\n" in title_and_rest:
                title_line, rest = title_and_rest.split("\n", 1)
            else:
                title_line, rest = title_and_rest, ""

            # Remove markdown emphasis from the title line if present.
            title_line = title_line.strip().strip('*').strip()

            date_match = re.search(r"\(([^)]+)\)\s*$", title_line)
            dates = date_match.group(1).strip() if date_match else None
            title = re.sub(r"\s*\([^)]*\)\s*$", "", title_line).strip()

            modules.append({
                "number": num,
                "title": title,
                "dates": dates,
                "body": rest.strip(),
            })

        return modules


if __name__ == "__main__":
	modules = MessageHandler.extract_modules(test_input)
	for mod in modules:
		print(f"Module {mod['number']}: {mod['title']} ({mod['dates']})")
		print(mod['body'])
		print()