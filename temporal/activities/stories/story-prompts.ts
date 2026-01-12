const LEVEL_PROMPTS: Record<string, string> = {
  beginner: `Write a Spanish story for language learners at the 'Beginner' proficiency level provided below. Match vocabulary, grammar, and length for that level.

**CRITICAL WORD LIMIT**: Your story must be between 150-300 words total. Count words carefully and do not exceed 300 words under any circumstances.

<proficiency_level>
{
  "description": "Can use memorized words and formulaic expressions for greetings, introductions, and very simple interactions.",
  "stories": {
    "min_words": 150,
    "max_words": 300,
    "note": "Very short narratives. Heavy use of repetition. Simple sentences. Mostly present tense. One clear plot line."
  },
  "vocabulary_size": "500–1,000",
  "tenses_mastered": ["present (basic)"],
  "skills": {
    "listening": "Understands slow, clear speech on familiar topics.",
    "speaking": "Produces isolated words and short memorized phrases.",
    "reading": "Can recognize familiar names, words, and simple notices.",
    "writing": "Can write simple words, names, and basic expressions."
  },
  "typical_tasks": [
    "Greeting a shop clerk and saying 'hello' or 'goodbye' at a convenience store.",
    "Introducing oneself to a new classmate by saying their name, nationality, and age.",
    "Pointing at an item in a café and saying 'coffee, please' to order.",
    "Answering 'yes' or 'no' when asked if they want a bag at checkout.",
    "Asking 'Where bathroom?' in a train station to find facilities.",
    "Responding 'I am from Mexico' when someone asks where they are from.",
    "Reading a bus timetable and recognizing the word 'Madrid' as the destination.",
    "Writing their name, address, and nationality on a hotel registration form.",
    "Saying 'two water' while holding up fingers to indicate quantity in a restaurant.",
    "Looking at a menu and recognizing the word 'pollo' to know they are ordering chicken."
  ]
}
</proficiency_level>

WORD COUNT REQUIREMENT: Write exactly 150-300 words. After writing, verify your word count stays within this range.

<response_format>
Return only this JSON (no extra text, no code fences):
{
	"title": "",
	"reading_time": " min",
	"text": "\\n\\n"
}
</response_format>`,

  high_beginner: `Write a Spanish story for language learners at the 'High Beginner' proficiency level provided below. Match vocabulary, grammar, and length for that level.

**CRITICAL WORD LIMIT**: Your story must be between 300-500 words total. Count words carefully and do not exceed 500 words under any circumstances.

<proficiency_level>
{
  "description": "Can handle short social exchanges and express immediate needs using simple sentences.",
  "stories": {
    "min_words": 300,
    "max_words": 500,
    "note": "Longer but still straightforward. Introduces past tense with limited variety. Simple sequencing of events."
  },
  "vocabulary_size": "1,000–2,000",
  "tenses_mastered": ["present", "near future (ir + a + infinitive)"],
  "skills": {
    "listening": "Understands common phrases related to shopping, travel, and routine tasks.",
    "speaking": "Can produce strings of simple sentences about self and immediate surroundings.",
    "reading": "Reads short, simple texts and personal communications.",
    "writing": "Writes short notes, forms, and simple letters."
  },
  "typical_tasks": [
    "Asking a taxi driver to take them to the airport and confirming the price.",
    "Telling a waiter 'I would like chicken with rice' and asking for the bill.",
    "Describing their family to a new acquaintance: 'I have two brothers and one sister.'",
    "Telling a colleague 'Tomorrow I go to the doctor' to explain an absence.",
    "Reading a supermarket flyer and understanding basic product descriptions.",
    "Writing a postcard saying 'The weather is good, the beach is nice.'",
    "Asking a shop assistant if they have a shirt in a different size or color.",
    "Ordering a bus ticket at a station and stating the destination and time.",
    "Inviting a friend for coffee by saying 'Do you want coffee with me tomorrow?'",
    "Reading a simple recipe and recognizing instructions like 'add sugar' or 'mix.'"
  ]
}
</proficiency_level>

WORD COUNT REQUIREMENT: Write exactly 300-500 words. After writing, verify your word count stays within this range.

<response_format>
Return only this JSON (no extra text, no code fences):
{
	"title": "",
	"reading_time": " min",
	"text": "\\n\\n"
}
</response_format>`,

  low_intermediate: `Write a Spanish story for language learners at the 'Low Intermediate' proficiency level provided below. Match vocabulary, grammar, and length for that level.

**CRITICAL WORD LIMIT**: Your story must be between 500-700 words total. Count words carefully and do not exceed 700 words under any circumstances.

<proficiency_level>
{
  "description": "Can manage routine conversations, describe events, and express personal opinions on familiar topics.",
  "stories": {
    "min_words": 500,
    "max_words": 700,
    "note": "Sustained short stories. Regular use of past tenses. Limited descriptive passages. Slightly more complex sentence structures."
  },
  "vocabulary_size": "2,000–3,500",
  "tenses_mastered": ["present", "near future", "preterite (basic past)", "imperfect (basic past description)"],
  "skills": {
    "listening": "Understands the gist of conversations on familiar subjects.",
    "speaking": "Can narrate in present and past with some accuracy.",
    "reading": "Understands straightforward texts about everyday subjects.",
    "writing": "Can write short connected paragraphs about experiences and plans."
  },
  "typical_tasks": [
    "Explaining to a teacher what they did over the weekend in short sentences.",
    "Telling a doctor about symptoms: 'Yesterday I had a fever, today I feel better.'",
    "Asking a hotel receptionist for recommendations about what to see in town.",
    "Reading a short news article about local events and summarizing it in class.",
    "Telling a story to friends about their last vacation with some detail.",
    "Explaining daily routines: 'I wake up at 7, I eat breakfast, then I go to work.'",
    "Talking to a store clerk about returning an item and explaining why.",
    "Writing a short email to confirm a meeting time and place with a colleague.",
    "Asking for directions and understanding simple answers with landmarks.",
    "Ordering food by describing how they want it prepared, e.g., 'without cheese.'"
  ]
}
</proficiency_level>

WORD COUNT REQUIREMENT: Write exactly 500-700 words. After writing, verify your word count stays within this range.

<response_format>
Return only this JSON (no extra text, no code fences):
{
	"title": "",
	"reading_time": " min",
	"text": "\\n\\n"
}
</response_format>`,

  high_intermediate: `Write a Spanish story for language learners at the 'High Intermediate' proficiency level provided below. Match vocabulary, grammar, and length for that level.

**CRITICAL WORD LIMIT**: Your story must be between 700-900 words total. Count words carefully and do not exceed 900 words under any circumstances.

<proficiency_level>
{
  "description": "Can participate in extended conversations with some fluency, handle work and study contexts, and argue a point of view",
  "stories": {
    "min_words": 700,
    "max_words": 900,
    "note": "Full short stories with character development and multiple events. Variety of tenses including subjunctive in simple contexts."
  },
  "vocabulary_size": "3,500–6,000",
  "tenses_mastered": ["present", "preterite", "imperfect", "near future", "future simple", "conditional", "present subjunctive (basic)"],
  "skills": {
    "listening": "Understands longer speech and main ideas of lectures or broadcasts.",
    "speaking": "Speaks with relative ease, though occasional errors remain.",
    "reading": "Can read articles and reports on familiar topics.",
    "writing": "Writes detailed connected texts with organized ideas."
  },
  "typical_tasks": [
    "Discussing plans for a weekend trip with friends, comparing different options.",
    "Explaining to a landlord why repairs are needed in their apartment.",
    "Participating in a class debate about social media use, giving reasons and examples.",
    "Writing a multi-paragraph email to a professor about a project delay.",
    "Listening to a radio broadcast about politics and summarizing the main points.",
    "Explaining to a colleague how to complete a work task with step-by-step detail.",
    "Giving a short presentation about their hometown and its history.",
    "Describing a movie they watched, including characters, plot, and personal opinion.",
    "Negotiating a price with a street vendor, using conditional forms to suggest compromises.",
    "Writing a review of a restaurant for a travel website, describing food and service."
  ]
}
</proficiency_level>

WORD COUNT REQUIREMENT: Write exactly 700-900 words. After writing, verify your word count stays within this range.

<response_format>
Return only this JSON (no extra text, no code fences):
{
	"title": "",
	"reading_time": " min",
	"text": "\\n\\n"
}
</response_format>`,

  advanced: `Write a Spanish story for language learners at the 'Advanced' proficiency level provided below. Match vocabulary, grammar, and length for that level.

**CRITICAL WORD LIMIT**: Your story must be between 900-1,000 words total. Count words carefully and do not exceed 1,000 words under any circumstances.

<proficiency_level>
{
  "description": "Communicates effectively in academic, social, and professional settings, with flexibility across topics and registers",
  "stories": {
    "min_words": 900,
    "max_words": 1000,
    "note": "Longer short stories or excerpts from novels. Dense description, abstract ideas, idiomatic expressions."
  },
  "vocabulary_size": "6,000–10,000+",
  "tenses_mastered": [
    "all indicative moods",
    "full range of subjunctive tenses",
    "compound tenses",
    "imperatives"
  ],
  "skills": {
    "listening": "Understands extended speech, lectures, and most media without difficulty.",
    "speaking": "Expresses ideas fluently, linking thoughts naturally and persuasively.",
    "reading": "Reads complex texts, both factual and literary, with full comprehension.",
    "writing": "Produces well-structured essays, reports, and formal documents."
  },
  "typical_tasks": [
    "Leading a business meeting and explaining project goals in detail.",
    "Participating in a university seminar and defending their interpretation of a text.",
    "Explaining abstract ideas such as justice or freedom with clarity.",
    "Negotiating a rental agreement with complex clauses about maintenance and payments.",
    "Reading a scientific article and explaining the findings to a peer in simpler terms.",
    "Writing a persuasive essay about climate change with structured arguments.",
    "Explaining cultural differences to visiting foreigners in a nuanced way.",
    "Participating in a televised panel discussion about education policy.",
    "Summarizing a film or book review and critiquing the reviewer's perspective.",
    "Writing a professional cover letter tailored to a specific job posting."
  ]
}
</proficiency_level>

WORD COUNT REQUIREMENT: Write exactly 900-1,000 words. After writing, verify your word count stays within this range.

<response_format>
Return only this JSON (no extra text, no code fences):
{
	"title": "",
	"reading_time": " min",
	"text": "\\n\\n"
}
</response_format>`,

  proficient_near_native: `Write a Spanish story for language learners at the 'Proficient / Near-Native' proficiency level provided below. Match vocabulary, grammar, and length for that level.

**CRITICAL WORD LIMIT**: Your story must be between 900-1,200 words total. Count words carefully and do not exceed 1,200 words under any circumstances.

<proficiency_level>
{
  "Proficient / Near-Native": {
    "description": "Achieves near-native control of the language, using it with precision and nuance across all domains, including abstract, academic, and professional contexts.",
    "stories": {
      "min_words": 900,
      "max_words": 1200,
      "note": "Complete short stories or novellas. Full literary style with nuance, idioms, and cultural references."
    },
    "vocabulary_size": "10,000–15,000+",
    "tenses_mastered": "All forms and registers of the language, including idiomatic, archaic, and regional variations.",
    "skills": {
      "listening": "Understands virtually all speech, including idioms, cultural references, and subtle humor.",
      "speaking": "Communicates effortlessly with precision, adapting tone and register appropriately.",
      "reading": "Reads and interprets specialized, literary, and technical texts.",
      "writing": "Writes with sophistication, nuance, and stylistic variety for any context."
    },
    "typical_tasks": [
      "Arguing a case in court, using precise technical vocabulary and persuasive rhetoric.",
      "Writing a literary short story with stylistic flair and idiomatic expressions.",
      "Participating in a live radio debate about global economic policy with quick responses.",
      "Translating complex academic texts while preserving nuance and register.",
      "Delivering a keynote speech at an international conference with full rhetorical control.",
      "Explaining subtle humor, double meanings, or cultural references in conversation.",
      "Editing a colleague's academic article for grammar, style, and clarity.",
      "Discussing philosophy or abstract theories with clarity and cultural references.",
      "Reading poetry aloud and commenting on rhythm, symbolism, and historical context.",
      "Adapting speech register from formal academic lecture to casual storytelling seamlessly."
    ]
  }
}
</proficiency_level>

WORD COUNT REQUIREMENT: Write exactly 900-1,200 words. After writing, verify your word count stays within this range.

<response_format>
Return only this JSON (no extra text, no code fences):
{
	"title": "",
	"reading_time": " min",
	"text": "\\n\\n"
}
</response_format>`,
};

export function getStoryPromptForLevel(level: string): string {
  const prompt = LEVEL_PROMPTS[level];

  if (!prompt) {
    throw new Error(`Unknown story level: ${level}. Valid levels: ${Object.keys(LEVEL_PROMPTS).join(', ')}`);
  }

  return prompt;
}
