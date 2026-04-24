const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(answers) {
  const {
    skills = [],
    interests = [],
    time = 'Unknown',
    budget = 'Unknown',
    audience = 'Unknown',
    goal = 'Unknown',
    style = 'Unknown',
  } = answers;

  return `You are a practical online business advisor. Based on the user profile below, generate exactly 6 specific, actionable online income opportunities. Return ONLY valid JSON — no markdown fences, no preamble.

User Profile:
- Skills: ${skills.join(', ') || 'None listed / complete beginner'}
- Interests: ${interests.join(', ') || 'General'}
- Time available per week: ${time}
- Startup budget: ${budget}
- Target audience: ${audience}
- Income goal: ${goal}
- Work style: ${style}

Return this EXACT JSON structure:
{
  "summary": "One sentence describing this person's strongest angle for earning online",
  "ideas": [
    {
      "title": "Specific idea name (e.g. 'Notion Template Shop for HR Professionals')",
      "category": "Digital Products | Freelance Services | Content | SaaS | Consulting | E-commerce | Affiliate",
      "blurb": "One sentence — what it is and why it fits this person",
      "incomeMin": 800,
      "incomeMax": 3500,
      "incomeUnit": "month",
      "timeToFirstDollar": "e.g. 2–4 weeks",
      "startupCost": "e.g. $0–$50",
      "hoursPerWeek": "e.g. 8–12 hrs/week",
      "feasibilityScore": 82,
      "earningScore": 65,
      "revenueModel": "Detailed explanation of exactly how money is made (pricing, platforms, conversion)",
      "requiredSkills": "List 2–4 skills needed; note which they already have vs need to learn",
      "firstSteps": [
        "Concrete step 1 — specific enough to do today",
        "Concrete step 2",
        "Concrete step 3",
        "Concrete step 4"
      ],
      "pitfall": "The #1 mistake beginners make with this specific model",
      "example": "Real-world style example: 'A [person like them] launched X and hit $Y/month in Z weeks by doing...' "
    }
  ]
}

Hard rules:
- If budget is $0, only suggest free-start models (no paid ads, no inventory)
- If time < 5 hrs/week, prioritize passive or semi-automated models
- Income ranges must be achievable within 6 months for a motivated beginner
- Rank ideas from most feasible to least feasible
- Always include at least one idea with $0 startup cost
- All firstSteps must be executable immediately with no prerequisites`;
}

async function generateIdeas(answers) {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildPrompt(answers) }],
  });

  const raw = message.content.map(c => c.text || '').join('').trim();
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);

  if (!parsed.ideas || !Array.isArray(parsed.ideas)) {
    throw new Error('Invalid response structure from AI');
  }

  return parsed;
}

module.exports = { generateIdeas };
