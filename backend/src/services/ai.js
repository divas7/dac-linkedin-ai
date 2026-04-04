const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

export async function generateLinkedInPost(theme) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing from the environment variables.');
  }

  const systemPrompt = `
You are an expert LinkedIn ghostwriter. Write a highly engaging, professional LinkedIn post about the theme provided by the user.
The output MUST be in valid JSON format with exactly three keys: "hook", "content", and "imagePrompt".
"hook": A punchy, single-sentence opening that grabs attention.
"content": The rest of the professional, insightful post (2-3 short paragraphs). No hashtags.
"imagePrompt": A vivid, abstract art prompt for a high-quality LinkedIn background image. It must be photorealistic or digital-art style - NOT charts or data. Focus on metaphors: e.g. for Startups write 'glowing rocket launch at night city skyline cinematic', for Technology write 'futuristic circuit board neon blue glow abstract', for Finance write 'gold coins waterfall dark luxury background'. Make it visually stunning, 8-10 words.
Respond ONLY with the RAW JSON object. Do not include markdown codeblocks (no \`\`\`json).
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Write a LinkedIn post about: "${theme}"` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Groq API Error: ${errData}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      hook: result.hook || 'Here is an insightful thought on this topic...',
      content: result.content || 'Content generation failed parsing.',
      imagePrompt: result.imagePrompt || 'professional corporate background'
    };
  } catch (error) {
    console.error('Groq Generation Error:', error);
    throw new Error(`Generation failed: ${error.message}`);
  }
}
