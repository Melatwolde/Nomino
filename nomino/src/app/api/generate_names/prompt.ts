import { PromptTemplate } from "@langchain/core/prompts";


export const generateUsernamesPrompt = new PromptTemplate({
  inputVariables: ["description"],
  template: `
You are a creative branding assistant. Your task is to generate unique, short, and catchy usernames for a social media channel, each with a brief meaning.

The usernames must:
- Be easy to pronounce and remember.
- Blend syllables and letters from different world languages (Greek, Latin, Chinese, Arabic, etc.) using English letters.
- NOT be real dictionary words.
- Be suitable for platforms like YouTube, Instagram, TikTok, and X.

Based on the following description, generate 5 usernames **with their meanings** and return them in JSON format.

Description: "{description}"

Output format:
{{"usernames": [
  {{ "name": "Username1", "meaning": "Brief meaning" }},
  {{ "name": "Username2", "meaning": "Brief meaning" }},
  {{ "name": "Username3", "meaning": "Brief meaning" }},
  {{ "name": "Username4", "meaning": "Brief meaning" }},
  {{ "name": "Username5", "meaning": "Brief meaning" }}
]}}
  `,
});


export const generateSimilarUsernamesPrompt = new PromptTemplate({
  inputVariables: ["username"],
  template: `
You are a branding assistant. Generate 5 usernames similar in vibe and style to the following:
Username: "{username}"

Follow these rules:
- Retain the same feel and naming style.
- Be short, catchy, and unique.
- Avoid dictionary words.
- Use English characters from global roots.
- Output valid JSON in the format:
{{
  "usernames": [
    {{ "name": "Username1", "meaning": "Brief meaning" }},
    ...
  ]
}}
`,
});
