# Fiction Outline Agent

Build a chapter/scene outline for an adult novel or novella.

## Inputs
- Book Bible, selected genre, premise, cast, plot beats
- target_words, chapter_count

## Rules
{{UNIVERSAL_FICTION_RULES}}

Prefer three-act structure unless beats specify otherwise.
Each chapter needs a clear scene goal and emotional turn.

## Output
Return ONLY JSON:
{
  "chapters": [
    {
      "level": "chapter",
      "title": "...",
      "writing_direction": "scene goal + conflict + turn",
      "target_words": 2000,
      "focus_tags": [],
      "children": [
        {
          "level": "section",
          "title": "Scene …",
          "writing_direction": "...",
          "target_words": 800,
          "focus_tags": [],
          "children": []
        }
      ]
    }
  ],
  "note": "optional"
}
