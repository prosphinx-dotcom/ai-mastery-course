// ===== INIT =====
(function(){
  const t = document.querySelector('[data-theme-toggle]');
  if(!t) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  t.innerHTML = isLight
    ?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    :'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
})();

// ===== COURSE DATA =====
const COURSE = {
  weeks: [
    { id: 1, title: 'AI Foundations', days: [1,2,3,4,5,6,7] },
    { id: 2, title: 'Prompt Engineering', days: [8,9,10,11,12,13,14] },
    { id: 3, title: 'Creative & Media AI', days: [15,16,17,18,19,20,21] },
    { id: 4, title: 'Automation & Mastery', days: [22,23,24,25,26,27,28,29,30] },
  ],
  lessons: [
    // === WEEK 1: AI Foundations ===
    {
      day: 1, title: 'What AI Can (and Cannot) Do',
      tool: 'ChatGPT', duration: '12 min', xp: 50,
      outcomes: ['Define AI and generative AI in plain language', 'Identify 5 tasks AI excels at and 5 it struggles with', 'Understand how large language models work at a high level'],
      content: `<p>Artificial intelligence isn't magic — it's pattern recognition at scale. Modern AI systems like ChatGPT, Claude, and Gemini are trained on massive amounts of text data to predict what comes next in a sequence.</p>
<p>Think of it like autocomplete on your phone, but thousands of times more powerful. The AI doesn't "understand" language the way you do — it calculates statistical probabilities of which word should follow which.</p>
<p>This means AI is excellent at: summarising text, translating languages, generating drafts, answering questions from its training data, writing code, and brainstorming ideas.</p>
<p>But AI struggles with: real-time information (it doesn't browse the web by default), mathematical reasoning, understanding context the way humans do, generating truly novel ideas, and knowing when it's wrong.</p>`,
      callout: { type: 'limits', title: 'What AI Cannot Do', text: 'AI hallucinates — it confidently generates plausible-sounding but incorrect information. Always verify facts, especially numbers, dates, and claims about real people or events.' },
      prompts: [
        { label: 'Try This Prompt', text: 'Explain artificial intelligence to a 12-year-old. Use simple language, one analogy, and three examples of what AI can do in everyday life.' },
        { label: 'Follow-Up', text: 'Now explain what AI cannot do well. Give me 5 specific limitations with examples.' }
      ],
      quiz: [
        { q: 'What is generative AI primarily based on?', options: ['Rule-based programming', 'Statistical pattern recognition', 'Human-like consciousness', 'Internet browsing'], correct: 1, explanation: 'Generative AI uses statistical patterns learned from training data to predict and generate new content.' },
        { q: 'Which task would AI struggle with most?', options: ['Summarising a long article', 'Translating English to Spanish', 'Verifying if a news story is true today', 'Writing a product description'], correct: 2, explanation: 'AI models don\'t have real-time access to current information and can\'t independently verify facts.' }
      ],
      practice: { title: 'Your First AI Conversation', desc: 'Open ChatGPT (or any AI assistant). Ask it to explain your job role to someone from a completely different industry. Then ask it to list 3 ways AI could help you in your specific role. Paste your best prompt below.' }
    },
    {
      day: 2, title: 'Your First AI Conversation',
      tool: 'ChatGPT', duration: '15 min', xp: 50,
      outcomes: ['Write your first effective AI prompt', 'Understand the input → output cycle', 'Learn the difference between vague and specific prompts'],
      content: `<p>The way you talk to AI matters enormously. A vague question gets a vague answer. A specific, well-structured question gets a useful, targeted response.</p>
<p>Think of prompting like giving instructions to a very capable but very literal assistant. They'll do exactly what you ask — so you need to be clear about what you want.</p>
<p>The basic formula: <strong>Role + Context + Task + Format</strong>. Tell the AI who to be, what background it needs, what to do, and how to format the output.</p>`,
      callout: { type: 'tip', title: 'Pro Tip', text: 'Start simple, then iterate. Your first prompt doesn\'t need to be perfect. Send it, see the result, then refine. Three rounds of iteration usually gets you something great.' },
      prompts: [
        { label: 'Vague Prompt (Bad)', text: 'Tell me about marketing.' },
        { label: 'Specific Prompt (Good)', text: 'You are a digital marketing expert. I run a small bakery in London. Write 5 Instagram post ideas for this week that would attract local customers. Include caption text and hashtag suggestions for each.' }
      ],
      quiz: [
        { q: 'What makes a prompt effective?', options: ['Using technical jargon', 'Being specific about role, context, task, and format', 'Making it as short as possible', 'Using all caps'], correct: 1, explanation: 'The Role + Context + Task + Format framework helps AI understand exactly what you need.' },
        { q: 'What should you do if the AI output isn\'t right?', options: ['Give up and try a different tool', 'Iterate and refine your prompt', 'Use the exact same prompt again', 'Add more exclamation marks'], correct: 1, explanation: 'Iterating — adjusting your prompt based on the output — is the core skill of working with AI effectively.' }
      ],
      practice: { title: 'Prompt Makeover', desc: 'Take this vague prompt: "Write me an email." Rewrite it into a specific, detailed prompt using the Role + Context + Task + Format framework. Then test it in an AI tool.' }
    },
    {
      day: 3, title: 'AI Tools Landscape',
      tool: 'Perplexity', duration: '15 min', xp: 50,
      outcomes: ['Map the 6 categories of AI tools', 'Know when to use which tool', 'Understand the difference between assistants, search AI, and creative AI'],
      content: `<p>The AI landscape is vast, but it breaks down into clear categories. Knowing which tool to use for which task is one of the most valuable skills you'll develop.</p>
<p><strong>Chat Assistants</strong> (ChatGPT, Claude, Gemini): General-purpose text generation, analysis, brainstorming, writing, coding. Your daily workhorse.</p>
<p><strong>AI Search</strong> (Perplexity, Google AI Overviews): Research with real-time sources and citations. Better than chat for factual questions.</p>
<p><strong>Image Generation</strong> (Midjourney, DALL-E, Ideogram): Create visuals from text descriptions. Marketing, social media, presentations.</p>
<p><strong>Video & Audio</strong> (Sora, ElevenLabs, Kling): Generate videos, voiceovers, music. Content creation at scale.</p>
<p><strong>Coding AI</strong> (GitHub Copilot, Cursor, Replit): Write, debug, and explain code. Even for non-programmers.</p>
<p><strong>Automation</strong> (Zapier AI, Make, custom GPTs): Connect tools, automate workflows, build no-code solutions.</p>`,
      callout: { type: 'tip', title: 'Tool Selection Rule', text: 'If you need facts with sources → use Perplexity. If you need creative writing → use ChatGPT or Claude. If you need images → use Midjourney or DALL-E. Match the tool to the task.' },
      prompts: [
        { label: 'Try in Perplexity', text: 'What are the top 5 AI tools for small business owners in 2026? Compare their pricing and best use cases in a table.' }
      ],
      quiz: [
        { q: 'Which tool is best for research with cited sources?', options: ['ChatGPT', 'Midjourney', 'Perplexity', 'GitHub Copilot'], correct: 2, explanation: 'Perplexity specialises in AI-powered search with real-time sources and citations.' },
        { q: 'What category does DALL-E belong to?', options: ['Chat Assistant', 'AI Search', 'Image Generation', 'Automation'], correct: 2, explanation: 'DALL-E is an image generation tool that creates visuals from text descriptions.' }
      ],
      practice: { title: 'Tool Matching Exercise', desc: 'List 5 tasks from your daily work. For each one, write which AI tool category would be best suited for it and why. Test at least one in a real AI tool.' }
    },
    {
      day: 4, title: 'ChatGPT Deep Dive',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Master ChatGPT\'s interface and settings', 'Use system instructions effectively', 'Understand GPT-4 vs GPT-3.5 differences'],
      content: `<p>ChatGPT by OpenAI is the most widely used AI assistant. Understanding its features beyond basic chatting will multiply your productivity.</p>
<p><strong>Custom Instructions</strong>: Tell ChatGPT about yourself once, and it remembers across all conversations. Set your role, preferences, and output style.</p>
<p><strong>GPT-4 vs 3.5</strong>: GPT-4 is significantly more capable at reasoning, following complex instructions, and producing nuanced output. Use it for important tasks.</p>
<p><strong>Memory</strong>: ChatGPT can remember facts about you across sessions. Tell it your role, industry, and preferences early.</p>
<p><strong>File uploads</strong>: You can upload documents, spreadsheets, images, and code files for analysis.</p>`,
      callout: { type: 'tip', title: 'Power User Tip', text: 'Set your Custom Instructions to include your job role, industry, preferred output format, and any writing style preferences. This transforms every conversation.' },
      prompts: [
        { label: 'Custom Instruction Setup', text: 'I am a General Manager overseeing multiple retail/food service locations in London. I manage teams, operations, and business strategy. When I ask questions, give me practical, actionable advice. Use British English. Format responses with headers, bullet points, and action items.' }
      ],
      quiz: [
        { q: 'What do Custom Instructions do?', options: ['Change the AI model', 'Provide persistent context across all chats', 'Make ChatGPT faster', 'Enable internet access'], correct: 1, explanation: 'Custom Instructions let you set your background and preferences once, and ChatGPT applies them to every conversation.' },
        { q: 'When should you use GPT-4 over GPT-3.5?', options: ['For simple questions', 'For tasks requiring strong reasoning and accuracy', 'Only for coding', 'Never — they\'re identical'], correct: 1, explanation: 'GPT-4 is better at complex reasoning, nuanced instructions, and accuracy-critical tasks.' }
      ],
      practice: { title: 'Set Up Your AI Profile', desc: 'Go to ChatGPT Settings → Custom Instructions. Write a clear profile of who you are, what you do, and how you want responses formatted. Test it with 3 different questions.' }
    },
    {
      day: 5, title: 'Claude & Gemini Compared',
      tool: 'Claude', duration: '12 min', xp: 50,
      outcomes: ['Understand Claude\'s strengths vs ChatGPT', 'Know when to use Gemini over alternatives', 'Compare response quality across tools'],
      content: `<p><strong>Claude</strong> (by Anthropic) excels at long, thoughtful analysis, careful reasoning, and following nuanced instructions. It's often preferred for writing, editing, and complex document work. Its "Constitutional AI" approach makes it more cautious and balanced.</p>
<p><strong>Gemini</strong> (by Google) integrates deeply with Google's ecosystem — Gmail, Docs, Search, YouTube. It's strong at multimodal tasks (understanding images, videos) and real-time information through Google Search integration.</p>
<p>There's no single "best" AI. Each has strengths. The skill is knowing which to reach for.</p>`,
      callout: { type: 'tip', title: 'Quick Decision Guide', text: 'Long documents & careful analysis → Claude. Google ecosystem & multimodal → Gemini. General versatility & plugins → ChatGPT. Research with sources → Perplexity.' },
      prompts: [
        { label: 'Test in Claude', text: 'Analyse the pros and cons of working in retail management vs starting an online business. Structure your response as a decision matrix with weighted criteria.' }
      ],
      quiz: [
        { q: 'What is Claude particularly good at?', options: ['Image generation', 'Long-form analysis and careful reasoning', 'Real-time sports scores', 'Video creation'], correct: 1, explanation: 'Claude is known for thoughtful, nuanced analysis and strong performance on long documents.' },
        { q: 'What gives Gemini a unique advantage?', options: ['It\'s the oldest AI', 'Deep integration with Google services', 'It\'s completely free forever', 'It only works offline'], correct: 1, explanation: 'Gemini\'s integration with Gmail, Docs, Search, and YouTube gives it unique capabilities within the Google ecosystem.' }
      ],
      practice: { title: 'AI Face-Off', desc: 'Ask the same question to ChatGPT and Claude (or Gemini). Compare the responses. Note which was more detailed, more accurate, and better formatted. Write your observations.' }
    },
    {
      day: 6, title: 'AI for Email & Communication',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Draft professional emails 5x faster', 'Use AI for tone adjustment', 'Create email templates for common scenarios'],
      content: `<p>Email is one of the highest-ROI uses for AI. Most professionals spend 2+ hours per day on email. AI can cut that dramatically while improving quality.</p>
<p><strong>Drafting</strong>: Give AI the context, recipient, tone, and goal. It generates a complete draft you can edit.</p>
<p><strong>Tone adjustment</strong>: Paste an angry email and ask AI to rewrite it professionally. Or make a formal email more friendly.</p>
<p><strong>Template creation</strong>: Generate reusable templates for common scenarios (follow-ups, complaints, introductions, scheduling).</p>`,
      callout: { type: 'warning', title: 'Watch Out', text: 'Always review AI-drafted emails before sending. AI may add false details, use the wrong tone for your relationship with the recipient, or miss cultural nuances.' },
      prompts: [
        { label: 'Email Draft', text: 'Write a professional email to my regional manager requesting a meeting to discuss Q2 performance results. Tone: confident but collaborative. Include 3 suggested meeting times next week. Keep it under 150 words.' },
        { label: 'Tone Shift', text: 'Rewrite this email to be more diplomatic and constructive while keeping the core message: [paste your email here]' }
      ],
      quiz: [
        { q: 'What\'s the most important step after AI drafts an email?', options: ['Send it immediately', 'Review and personalise it', 'Add more AI text', 'Delete it and start over'], correct: 1, explanation: 'Always review AI drafts — check for accuracy, tone, and personalise them for the specific recipient and context.' },
        { q: 'Which prompt element is crucial for email drafting?', options: ['Word count only', 'Specifying tone and recipient relationship', 'Using formal language in the prompt', 'Nothing — AI knows automatically'], correct: 1, explanation: 'Tone and recipient context help AI match the right register and formality level for each email.' }
      ],
      practice: { title: 'Email Upgrade', desc: 'Find a recent email you sent that took a long time to write. Create a prompt that would generate a similar email. Test it and compare. Then create 3 reusable email templates for your most common scenarios.' }
    },
    {
      day: 7, title: 'Week 1 Review & Mini-Project',
      tool: 'Any AI Tool', duration: '15 min', xp: 100,
      outcomes: ['Consolidate all Week 1 concepts', 'Complete your first AI mini-project', 'Build confidence with multiple tools'],
      content: `<p>You've covered the foundations. Let's consolidate everything into a practical project that demonstrates your new skills.</p>
<p><strong>This week you learned</strong>: What AI can and can't do, how to write effective prompts, the tool landscape, ChatGPT deep features, Claude & Gemini differences, and AI for email.</p>
<p>Now it's time to put it all together in a real-world task that matters to you.</p>`,
      callout: { type: 'tip', title: 'Mini-Project', text: 'Choose one: (A) Create an "AI Operations Manual" for your team — a 1-page guide on which AI tool to use for which task. (B) Draft a week\'s worth of professional emails using AI for 5 different scenarios you actually face.' },
      prompts: [
        { label: 'Project Option A', text: 'Create a one-page "AI Tools Quick Reference Guide" for a retail management team. Include: tool name, what it\'s best for, a sample prompt for each, and when NOT to use it. Format as a clean table.' },
        { label: 'Project Option B', text: 'I need to write 5 different professional emails this week: (1) a performance review follow-up, (2) a supplier negotiation, (3) a team motivation message, (4) a schedule change announcement, (5) a complaint response to a customer. Draft all 5 with appropriate tone for each.' }
      ],
      quiz: [
        { q: 'What is the basic prompting formula?', options: ['Just ask a question', 'Role + Context + Task + Format', 'Use as many words as possible', 'Only use keywords'], correct: 1, explanation: 'The Role + Context + Task + Format framework gives AI the information it needs to produce targeted, useful output.' },
        { q: 'After 7 days, what\'s the most important skill you\'ve built?', options: ['Memorising AI features', 'Knowing which tool fits which task and iterating prompts', 'Speed typing', 'Avoiding AI entirely'], correct: 1, explanation: 'Tool selection and prompt iteration are the two foundational skills that make everything else possible.' }
      ],
      practice: { title: 'Week 1 Capstone', desc: 'Complete one of the mini-projects above. Save your output — this is the first piece of your AI portfolio. You\'ll reference it again in Week 4.' }
    },

    // === WEEK 2: Prompt Engineering ===
    {
      day: 8, title: 'Prompt Engineering Level 1: Task Formulation',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Master the 5-part prompt structure', 'Write prompts that get it right first time', 'Understand why context length matters'],
      content: `<p>Level 1 prompt engineering is about consistently getting useful output on the first or second try. The framework: <strong>Role → Context → Task → Constraints → Format</strong>.</p>
<p><strong>Role</strong>: Who should the AI be? ("You are a senior marketing strategist...")</p>
<p><strong>Context</strong>: What does it need to know? ("I run a bakery in London targeting young professionals...")</p>
<p><strong>Task</strong>: What exactly should it do? ("Create a 7-day social media content calendar...")</p>
<p><strong>Constraints</strong>: What rules apply? ("Under 200 words per post, no emojis, British English...")</p>
<p><strong>Format</strong>: How should the output look? ("Present as a table with columns: Day, Platform, Content, Hashtags")</p>`,
      callout: { type: 'tip', title: 'The 80/20 Rule', text: 'Spending 2 extra minutes on your prompt saves 20 minutes of back-and-forth revision. Front-load your effort into the prompt, not the editing.' },
      prompts: [
        { label: 'Full Framework Example', text: 'You are a retail operations consultant with 15 years of experience (Role). I manage 4 food service locations in London with 45 total staff (Context). Create a weekly staff scheduling template that accounts for peak hours, staff preferences, and labour cost targets (Task). Maximum 40 hours per employee, ensure at least 2 senior staff per shift (Constraints). Format as a Monday-to-Sunday table with morning/afternoon/evening shifts (Format).' }
      ],
      quiz: [
        { q: 'What are the 5 parts of a Level 1 prompt?', options: ['Who, What, When, Where, Why', 'Role, Context, Task, Constraints, Format', 'Start, Middle, End, Summary, Review', 'Input, Process, Output, Review, Repeat'], correct: 1, explanation: 'Role → Context → Task → Constraints → Format gives AI everything it needs to deliver targeted output.' },
        { q: 'Why add constraints to your prompt?', options: ['To make the prompt longer', 'To limit the AI\'s creativity', 'To prevent unwanted output and set boundaries', 'Constraints aren\'t important'], correct: 2, explanation: 'Constraints prevent the AI from going off-track and ensure the output meets your specific requirements.' }
      ],
      practice: { title: 'Build a 5-Part Prompt', desc: 'Write a prompt for a real task you need done this week. Label each of the 5 parts (Role, Context, Task, Constraints, Format). Test it and refine until you get a useful result.' }
    },
    {
      day: 9, title: 'Prompt Engineering Level 2: System Prompts',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Create reusable system prompts', 'Build a personal prompt library', 'Understand prompt templates vs one-off prompts'],
      content: `<p>System prompts are reusable instruction sets you can use over and over. Instead of writing a new prompt each time, you create a template and fill in the variables.</p>
<p>Think of it like a form letter — the structure stays the same, but the details change each time.</p>
<p><strong>Template example</strong>: "You are a [ROLE]. I need you to [TASK] about [TOPIC]. The audience is [AUDIENCE]. Output format: [FORMAT]. Tone: [TONE]."</p>`,
      callout: { type: 'tip', title: 'Build Your Library', text: 'Create 5 prompt templates you can reuse weekly: one for emails, one for reports, one for brainstorming, one for analysis, and one for content creation. Save them in a document.' },
      prompts: [
        { label: 'Template Builder', text: 'Create 5 reusable prompt templates for a general manager. Each should have [VARIABLES] I can fill in. Categories: (1) Staff communication, (2) Performance analysis, (3) Customer response, (4) Weekly planning, (5) Problem solving. Make each under 100 words with clear variable placeholders.' }
      ],
      quiz: [
        { q: 'What is a system prompt?', options: ['A prompt that breaks the AI', 'A reusable instruction template with variables', 'The AI\'s internal code', 'A prompt you only use once'], correct: 1, explanation: 'System prompts are reusable templates where you swap out specific variables while keeping the instruction structure the same.' }
      ],
      practice: { title: 'Prompt Library', desc: 'Create 3 prompt templates for tasks you do regularly. Use [BRACKETS] for variables. Test each one with real data. Save them — this is the start of your personal AI toolkit.' }
    },
    {
      day: 10, title: 'Prompt Engineering Level 3: Chain & Refine',
      tool: 'Claude', duration: '15 min', xp: 70,
      outcomes: ['Use chain-of-thought prompting', 'Break complex tasks into prompt sequences', 'Master the art of follow-up prompts'],
      content: `<p>Advanced prompting isn't about one perfect prompt — it's about a sequence of prompts that build on each other, like a conversation.</p>
<p><strong>Chain-of-thought</strong>: Ask AI to think step-by-step. "Before answering, list your reasoning steps." This dramatically improves accuracy on complex tasks.</p>
<p><strong>Prompt chaining</strong>: Break a big task into stages. Prompt 1 gathers information. Prompt 2 analyses it. Prompt 3 creates the deliverable.</p>
<p><strong>Refinement</strong>: Use follow-ups like "Make it more concise," "Add more data," "Change the tone to..." to iteratively improve output.</p>`,
      callout: { type: 'tip', title: 'Chain Example', text: 'Step 1: "List all factors that affect employee retention in retail." Step 2: "Now rank them by impact and ease of implementation." Step 3: "Create an action plan for the top 3, with timelines and costs."' },
      prompts: [
        { label: 'Chain-of-Thought', text: 'I need to decide whether to open a 5th store location. Think step-by-step: First, list the key factors to consider. Then, for each factor, rate the risk (1-10) and opportunity (1-10). Finally, give me your recommendation with reasoning.' }
      ],
      quiz: [
        { q: 'What does chain-of-thought prompting do?', options: ['Makes AI respond faster', 'Forces AI to show its reasoning steps, improving accuracy', 'Allows AI to browse the internet', 'Nothing useful'], correct: 1, explanation: 'Chain-of-thought prompting forces the AI to reason step-by-step, which significantly reduces errors on complex problems.' }
      ],
      practice: { title: 'Prompt Chain', desc: 'Take a complex task from your work. Break it into 3-4 sequential prompts. Execute them in order, feeding each output into the next. Document the chain.' }
    },
    {
      day: 11, title: 'AI for Research & Analysis',
      tool: 'Perplexity', duration: '15 min', xp: 60,
      outcomes: ['Use AI for structured research', 'Evaluate AI-generated sources', 'Build a research workflow'],
      content: `<p>AI transforms how you research. Instead of hours of googling, you can get structured, sourced answers in minutes. But you must verify.</p>
<p><strong>Perplexity</strong> is purpose-built for research — it searches the web in real-time and cites every claim with a source link.</p>
<p><strong>Research workflow</strong>: (1) Ask a broad question to map the landscape. (2) Follow up with specific questions about each area. (3) Ask for a structured summary. (4) Verify key claims by checking the source links.</p>`,
      callout: { type: 'warning', title: 'Verify Everything', text: 'Even sourced AI answers can misinterpret their sources. Click through to verify any claim you plan to act on or share with others.' },
      prompts: [
        { label: 'Research Deep Dive', text: 'Research the current state of AI adoption in UK retail businesses. Include: adoption rates, most-used tools, ROI data, common challenges, and predictions for the next 2 years. Cite all sources.' }
      ],
      quiz: [
        { q: 'What makes Perplexity different from ChatGPT for research?', options: ['It\'s faster', 'It searches the web in real-time and cites sources', 'It has a better UI', 'It doesn\'t require an account'], correct: 1, explanation: 'Perplexity specialises in real-time web search with source citations, making it more reliable for factual research.' }
      ],
      practice: { title: 'Research Sprint', desc: 'Pick a topic relevant to your work or interests. Use Perplexity to conduct a 10-minute research sprint. Save the results, including the source links. Verify at least 2 claims by checking the original sources.' }
    },
    {
      day: 12, title: 'AI for Writing & Content',
      tool: 'Claude', duration: '15 min', xp: 60,
      outcomes: ['Generate long-form content with AI', 'Edit and improve existing writing', 'Maintain your voice while using AI'],
      content: `<p>AI is a powerful co-writer, but the key is using it as a tool, not a replacement. The best results come from combining AI's speed with your expertise and voice.</p>
<p><strong>Drafting</strong>: Let AI create the first draft. You provide the structure, key points, and examples. AI fills in the prose.</p>
<p><strong>Editing</strong>: Paste your writing and ask AI to improve clarity, fix grammar, or adjust tone. This is often more valuable than generation.</p>
<p><strong>Voice matching</strong>: Give AI a sample of your writing and ask it to match your style. Or define your style explicitly: "Direct, conversational, uses British English, avoids jargon."</p>`,
      callout: { type: 'tip', title: 'The 70/30 Rule', text: 'Let AI do 70% of the heavy lifting (structure, first draft, research), then invest 30% of your time on personalisation, fact-checking, and adding your unique insights.' },
      prompts: [
        { label: 'Content with Voice', text: 'Write a 500-word LinkedIn post about the importance of adaptability in management. Style: conversational but professional, use real examples, avoid buzzwords. End with a question to drive engagement.' }
      ],
      quiz: [
        { q: 'What\'s the most effective way to use AI for writing?', options: ['Copy-paste output directly', 'Use AI for the draft, then personalise with your expertise', 'Only use AI for grammar checking', 'Never use AI for writing'], correct: 1, explanation: 'The best workflow is letting AI handle the heavy lifting of drafting, then adding your personal touch, expertise, and voice.' }
      ],
      practice: { title: 'Content Co-Creation', desc: 'Write a piece of content for your work or social media. Use AI for the first draft, then edit it to sound like you. Compare the AI draft with your final version.' }
    },
    {
      day: 13, title: 'AI for Data & Spreadsheets',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Use AI to analyse data patterns', 'Generate spreadsheet formulas with AI', 'Create data summaries from raw numbers'],
      content: `<p>You don't need to be a data scientist to analyse data with AI. Upload a spreadsheet or paste data, and AI can find patterns, create formulas, and generate insights.</p>
<p><strong>Formula generation</strong>: Describe what you want in plain English, and AI writes the Excel/Google Sheets formula.</p>
<p><strong>Data analysis</strong>: Upload a CSV or paste a table, and ask AI to identify trends, outliers, and actionable insights.</p>
<p><strong>Visualisation suggestions</strong>: Ask AI what charts would best represent your data and why.</p>`,
      callout: { type: 'warning', title: 'Data Privacy', text: 'Never upload sensitive customer data, personal information, or confidential business data to AI tools. Use anonymised or sample data for practice.' },
      prompts: [
        { label: 'Formula Helper', text: 'I have a Google Sheet with columns: Date, Store Location, Revenue, Staff Count, Customer Count. Write formulas for: (1) Average revenue per customer by location, (2) Best-performing day of the week, (3) Revenue per staff member.' }
      ],
      quiz: [
        { q: 'What should you never upload to AI tools?', options: ['Sample data', 'Anonymised data', 'Sensitive customer or confidential business data', 'Public statistics'], correct: 2, explanation: 'Protecting customer privacy and business confidentiality is essential. Use anonymised or sample data when working with AI.' }
      ],
      practice: { title: 'Data Analysis', desc: 'Create a simple dataset (or use a real one with anonymised data). Ask AI to analyse it: find patterns, suggest improvements, and write 3 spreadsheet formulas you can use.' }
    },
    {
      day: 14, title: 'Week 2 Review & Prompt Portfolio',
      tool: 'Any AI Tool', duration: '15 min', xp: 100,
      outcomes: ['Build your personal prompt portfolio', 'Consolidate all prompt engineering techniques', 'Create a reusable prompt library document'],
      content: `<p>You now have three levels of prompt engineering: task formulation, system prompts, and chain-of-thought reasoning. Time to package them into a portable toolkit.</p>
<p>Your <strong>Prompt Portfolio</strong> should include: 5-10 reusable templates for your most common tasks, 3 chain-of-thought sequences for complex decisions, and notes on which AI tool works best for which task type.</p>`,
      callout: { type: 'tip', title: 'Week 2 Capstone', text: 'Create a "My AI Playbook" document with your best prompts, templates, and workflows. This is your personal toolkit you\'ll use every day.' },
      prompts: [
        { label: 'Portfolio Generator', text: 'Create a "Personal AI Playbook" template for a general manager. Include sections for: (1) Daily prompts I use, (2) Reusable templates with variables, (3) Chain-of-thought sequences for decisions, (4) Tool selection guide, (5) Tips I\'ve learned. Format as a clean document I can print.' }
      ],
      quiz: [
        { q: 'What are the three levels of prompt engineering?', options: ['Easy, Medium, Hard', 'Task Formulation, System Prompts, Chain-of-Thought', 'Asking, Writing, Coding', 'Input, Process, Output'], correct: 1, explanation: 'The three levels build on each other: formulating clear tasks, creating reusable templates, and chaining prompts for complex reasoning.' }
      ],
      practice: { title: 'AI Playbook', desc: 'Compile your best prompts from the past two weeks into a single document. Organise by category. This is your living AI toolkit — you\'ll keep adding to it.' }
    },

    // === WEEK 3: Creative & Media AI ===
    {
      day: 15, title: 'AI Image Generation',
      tool: 'DALL-E', duration: '15 min', xp: 60,
      outcomes: ['Generate professional images with text prompts', 'Understand image generation styles and parameters', 'Create images for social media and presentations'],
      content: `<p>AI image generation has reached a point where you can create professional-quality visuals without any design skills. The key is writing descriptive, specific prompts.</p>
<p><strong>DALL-E</strong> (built into ChatGPT Plus) is the easiest to start with. <strong>Midjourney</strong> produces the most artistic results. <strong>Ideogram</strong> handles text in images best.</p>
<p>Image prompt formula: <strong>Subject + Style + Setting + Mood + Technical details</strong>.</p>`,
      callout: { type: 'limits', title: 'Limitations', text: 'AI image generators still struggle with: hands and fingers, text accuracy, specific brand logos, consistent characters across images, and exact spatial relationships.' },
      prompts: [
        { label: 'Image Prompt', text: 'A modern, minimalist illustration of a team meeting in a bright office space. Flat design style with warm colours. Diverse group of 4 people around a table with laptops and coffee. Clean, professional, suitable for a business presentation. Aspect ratio 16:9.' }
      ],
      quiz: [
        { q: 'What makes a good image generation prompt?', options: ['Just the subject name', 'Subject + Style + Setting + Mood + Technical details', 'One word descriptions', 'Asking for a "nice image"'], correct: 1, explanation: 'Specific prompts with style, setting, mood, and technical details produce far better results than vague descriptions.' }
      ],
      practice: { title: 'Visual Content', desc: 'Generate 3 images for a real project: one for social media, one for a presentation, one for a document. Iterate on each prompt at least twice to improve quality.' }
    },
    {
      day: 16, title: 'AI for Presentations',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Structure presentations with AI', 'Generate slide content and speaker notes', 'Create compelling narratives with AI assistance'],
      content: `<p>AI can't design slides directly, but it can do the hardest parts: structuring your narrative, writing compelling content, and generating speaker notes.</p>
<p><strong>Outline first</strong>: Ask AI to create a presentation structure before writing any content. Share your goal, audience, and time limit.</p>
<p><strong>One idea per slide</strong>: AI tends to overload slides. Explicitly ask for "one key point per slide with a supporting statistic or example."</p>`,
      prompts: [
        { label: 'Presentation Builder', text: 'Create a 10-slide presentation outline about "How AI Can Improve Our Store Operations." Audience: regional management team. Time: 15 minutes. For each slide include: title, one key message, one supporting data point or example, and brief speaker notes.' }
      ],
      quiz: [
        { q: 'What should you ask AI to create first for a presentation?', options: ['The design', 'The speaker notes', 'The outline and structure', 'The animations'], correct: 2, explanation: 'Starting with structure ensures your narrative flows logically before you invest time in content and design.' }
      ],
      practice: { title: 'Presentation Draft', desc: 'Create a full presentation outline for a real upcoming meeting or presentation using AI. Include slide titles, key messages, and speaker notes.' }
    },
    {
      day: 17, title: 'AI Video & Audio Tools',
      tool: 'ElevenLabs', duration: '15 min', xp: 60,
      outcomes: ['Generate voiceovers with AI', 'Understand AI video generation landscape', 'Create multimedia content workflows'],
      content: `<p>AI can now generate realistic voiceovers, music, and even video clips. This opens up content creation possibilities that previously required expensive equipment and skills.</p>
<p><strong>ElevenLabs</strong>: High-quality text-to-speech with natural-sounding voices. Great for presentations, podcasts, and social media content.</p>
<p><strong>Video AI</strong> (Sora, Kling, Runway): Generate short video clips from text descriptions. Still early but improving rapidly.</p>
<p><strong>Music AI</strong> (Suno, Udio): Generate original music tracks for content. Specify genre, mood, and tempo.</p>`,
      prompts: [
        { label: 'Voiceover Script', text: 'Write a 60-second voiceover script for an Instagram Reel about "5 Ways AI Saves Time at Work." Conversational tone, punchy delivery, include a hook in the first 3 seconds. End with a call to action.' }
      ],
      quiz: [
        { q: 'What is ElevenLabs primarily used for?', options: ['Image generation', 'Video editing', 'AI text-to-speech voiceovers', 'Data analysis'], correct: 2, explanation: 'ElevenLabs specialises in generating realistic, natural-sounding voiceovers from text.' }
      ],
      practice: { title: 'Audio Content', desc: 'Write a voiceover script for a 30-60 second piece of content. If you have access to ElevenLabs, generate the audio. If not, record yourself reading the AI-written script.' }
    },
    {
      day: 18, title: 'AI for Social Media',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Create a week of social media content in 15 minutes', 'Generate platform-specific content', 'Build a content calendar with AI'],
      content: `<p>Social media content is one of the most practical daily uses of AI. You can generate a week's worth of posts, captions, and ideas in the time it used to take for one.</p>
<p><strong>Platform awareness</strong>: Each platform has different norms. Instagram = visual + short captions. LinkedIn = professional + longer form. X/Twitter = punchy + concise. TikTok = hook-first + casual.</p>`,
      prompts: [
        { label: 'Content Calendar', text: 'Create a 7-day social media content calendar for an Instagram account focused on AI tips for professionals. For each day include: content theme, caption (under 150 words), 5 relevant hashtags, and best posting time (UK timezone). Mix post types: tips, tools, behind-the-scenes, engagement question.' }
      ],
      quiz: [
        { q: 'Why should you specify the platform in your content prompt?', options: ['It doesn\'t matter', 'Each platform has different content norms and formats', 'To impress the AI', 'Only for video content'], correct: 1, explanation: 'Platform-specific prompting ensures content matches the tone, length, and format that works best on each social network.' }
      ],
      practice: { title: 'Content Batch', desc: 'Generate a full week of social media content for your chosen platform. Edit each post to add your personal voice. Schedule or save them for posting.' }
    },
    {
      day: 19, title: 'AI for Document Creation',
      tool: 'Claude', duration: '15 min', xp: 60,
      outcomes: ['Generate reports and documents with AI', 'Create professional templates', 'Use AI for document review and improvement'],
      content: `<p>AI excels at creating structured documents: reports, proposals, SOPs, training materials, and more. Claude is particularly strong at long-form document work.</p>
<p><strong>The structure-first approach</strong>: Always ask for an outline/structure before the full document. Review and adjust the structure, then have AI fill it in.</p>`,
      prompts: [
        { label: 'SOP Generator', text: 'Create a Standard Operating Procedure document for "Opening a Store in the Morning." Include: document title, purpose, scope, step-by-step procedure with time estimates, safety checklist, quality standards, and space for signatures. Format as a professional document with numbered steps.' }
      ],
      quiz: [
        { q: 'What\'s the best approach for AI document creation?', options: ['Ask for the complete document in one prompt', 'Get the outline first, review it, then fill in sections', 'Only use AI for short documents', 'Copy from templates online'], correct: 1, explanation: 'The structure-first approach lets you shape the document before investing in content, catching issues early.' }
      ],
      practice: { title: 'Document Creation', desc: 'Create a real document you need for work: an SOP, report template, training guide, or proposal. Use the structure-first approach.' }
    },
    {
      day: 20, title: 'Custom GPTs & AI Assistants',
      tool: 'ChatGPT', duration: '15 min', xp: 70,
      outcomes: ['Build a custom GPT for your specific needs', 'Understand how to configure AI assistants', 'Create a no-code AI tool'],
      content: `<p>Custom GPTs let you create specialised AI assistants that are pre-configured for specific tasks. Think of them as AI employees that always know their role.</p>
<p>You can create a Custom GPT for: answering customer FAQs, drafting specific types of content, analysing reports, generating scheduled communications, or any repetitive task.</p>`,
      prompts: [
        { label: 'Custom GPT Instructions', text: 'Help me create instructions for a custom GPT called "Store Manager Assistant." It should: (1) know about UK retail operations, (2) help draft staff schedules, (3) generate performance reports, (4) create customer response templates. Write the system prompt and configuration instructions.' }
      ],
      quiz: [
        { q: 'What is a Custom GPT?', options: ['A new AI model', 'A pre-configured AI assistant for specific tasks', 'A paid upgrade', 'A programming language'], correct: 1, explanation: 'Custom GPTs are specialised AI assistants you create with specific instructions, knowledge, and tools for targeted use cases.' }
      ],
      practice: { title: 'Build Your Assistant', desc: 'Design (and if you have ChatGPT Plus, create) a Custom GPT for your most common work task. Write the system prompt, define its personality, and list what it should know.' }
    },
    {
      day: 21, title: 'Week 3 Review & Content Portfolio',
      tool: 'Any AI Tool', duration: '15 min', xp: 100,
      outcomes: ['Showcase your creative AI skills', 'Build a content portfolio', 'Prepare for automation week'],
      content: `<p>This week you've mastered creative and media AI tools. You can now generate images, write presentations, create social media content, build documents, and even design custom AI assistants.</p>
<p>Time to package your best work into a portfolio that shows what you can do.</p>`,
      callout: { type: 'tip', title: 'Week 3 Capstone', text: 'Create a "Content Creation Kit" — a collection of your best AI-generated assets from this week: 3 images, 1 presentation outline, 1 week of social content, and 1 professional document.' },
      prompts: [
        { label: 'Portfolio Summary', text: 'Create a one-page summary of AI content creation capabilities I\'ve developed. List each skill, the tool used, and one example output for each. Format as a professional portfolio page.' }
      ],
      quiz: [
        { q: 'What\'s the most valuable creative AI skill for professionals?', options: ['Generating random art', 'Creating structured, platform-specific content efficiently', 'Making memes', 'Only using one tool'], correct: 1, explanation: 'The ability to quickly produce targeted, platform-appropriate content is the most practical creative AI skill for professionals.' }
      ],
      practice: { title: 'Creative Portfolio', desc: 'Compile your best creative outputs from this week. Organise them by type. Write a brief description of the prompt and process for each.' }
    },

    // === WEEK 4: Automation & Mastery ===
    {
      day: 22, title: 'AI Workflow Automation',
      tool: 'Zapier', duration: '15 min', xp: 70,
      outcomes: ['Understand no-code automation basics', 'Map your workflow for automation opportunities', 'Build your first automated workflow concept'],
      content: `<p>Automation is where AI becomes truly transformative. Instead of using AI tools one-at-a-time, you connect them into workflows that run automatically.</p>
<p><strong>Zapier</strong> and <strong>Make</strong> are no-code platforms that connect 5,000+ apps. Add AI steps to automatically process, transform, and route information.</p>
<p>Common AI automations: auto-summarise emails → send to Slack, auto-generate social posts from blog articles, auto-categorise customer feedback, auto-create reports from data updates.</p>`,
      prompts: [
        { label: 'Workflow Map', text: 'I\'m a general manager of 4 retail stores. Map out 5 AI-powered automation workflows that would save me time: (1) what triggers the workflow, (2) what AI processes it, (3) what output it creates, (4) estimated time saved per week. Present as a table.' }
      ],
      quiz: [
        { q: 'What do tools like Zapier enable?', options: ['Building websites', 'Connecting apps into automated workflows without code', 'Replacing AI assistants', 'Only email automation'], correct: 1, explanation: 'Zapier and similar tools let you connect thousands of apps into automated workflows without writing any code.' }
      ],
      practice: { title: 'Automation Audit', desc: 'List 5 repetitive tasks in your daily work. For each, design an automation workflow: trigger → AI process → output. Identify which one would save the most time.' }
    },
    {
      day: 23, title: 'AI for Decision Making',
      tool: 'Claude', duration: '15 min', xp: 70,
      outcomes: ['Use AI as a strategic thinking partner', 'Build decision frameworks with AI', 'Avoid common AI decision-making pitfalls'],
      content: `<p>AI isn't just for content creation — it's a powerful thinking partner for complex decisions. The key is using it as a challenger and framework provider, not as the decision maker.</p>
<p><strong>SWOT with AI</strong>: Ask AI to generate a comprehensive SWOT analysis, then challenge each point.</p>
<p><strong>Devil's advocate</strong>: Present your decision and ask AI to argue against it. This reveals blind spots.</p>
<p><strong>Scenario planning</strong>: Ask AI to generate best-case, worst-case, and most-likely scenarios for your options.</p>`,
      callout: { type: 'limits', title: 'AI Decision Limits', text: 'AI can structure your thinking and present options, but it doesn\'t know your specific context, relationships, or risk tolerance. Always apply human judgment to the final decision.' },
      prompts: [
        { label: 'Decision Framework', text: 'I\'m considering expanding from 4 to 5 store locations. Play devil\'s advocate: give me the 5 strongest arguments AGAINST this expansion, with specific risks and data points for each. Then provide a decision framework I can use to evaluate objectively.' }
      ],
      quiz: [
        { q: 'How should you use AI for decisions?', options: ['Let AI make the final decision', 'Use AI as a thinking partner to explore options and challenge assumptions', 'Avoid AI for decisions entirely', 'Only use AI for financial decisions'], correct: 1, explanation: 'AI is best used as a structured thinking partner — it can explore options, challenge assumptions, and build frameworks, but humans make the final call.' }
      ],
      practice: { title: 'Decision Partner', desc: 'Take a real decision you\'re facing. Use AI to: (1) generate a SWOT analysis, (2) play devil\'s advocate, (3) create a scenario plan. Then make your decision using the AI-generated framework.' }
    },
    {
      day: 24, title: 'AI for Learning & Skill Building',
      tool: 'Perplexity', duration: '15 min', xp: 60,
      outcomes: ['Use AI as a personal tutor', 'Create custom learning plans', 'Accelerate skill acquisition with AI'],
      content: `<p>AI is one of the most powerful learning tools ever created. It can explain complex topics at any level, create custom learning plans, quiz you on material, and adapt to your pace.</p>
<p><strong>Feynman Technique with AI</strong>: Explain a concept to AI and ask it to identify gaps in your understanding.</p>
<p><strong>Custom curriculum</strong>: Tell AI your current level, goal, and available time — it builds a personalised learning path.</p>`,
      prompts: [
        { label: 'Personal Tutor', text: 'I want to learn about cryptocurrency trading fundamentals. My current level: complete beginner. Available time: 30 minutes per day for 2 weeks. Create a day-by-day learning plan with specific topics, resources, and practice exercises for each day.' }
      ],
      quiz: [
        { q: 'What is the Feynman Technique?', options: ['A coding method', 'Explaining a concept simply to find gaps in your understanding', 'A type of AI prompt', 'A memory trick'], correct: 1, explanation: 'The Feynman Technique involves explaining a concept in simple terms — if you can\'t explain it simply, you don\'t understand it well enough.' }
      ],
      practice: { title: 'AI Tutor Session', desc: 'Pick a topic you want to learn. Use AI as a tutor: ask it to explain the basics, quiz you, and identify gaps in your understanding. Spend 15 minutes in a learning conversation.' }
    },
    {
      day: 25, title: 'AI Ethics & Responsible Use',
      tool: 'Any AI Tool', duration: '12 min', xp: 50,
      outcomes: ['Identify AI bias and its impacts', 'Understand data privacy with AI tools', 'Apply responsible AI practices in your work'],
      content: `<p>Using AI responsibly isn't optional — it's a core professional skill. As AI becomes more powerful, understanding its biases, limitations, and ethical implications becomes more important.</p>
<p><strong>Bias</strong>: AI reflects the biases in its training data. It may give different recommendations based on names, locations, or demographics.</p>
<p><strong>Privacy</strong>: Anything you type into an AI tool may be used for training. Never share sensitive personal data, trade secrets, or confidential information.</p>
<p><strong>Transparency</strong>: Be honest about AI use. Disclose when content is AI-generated where appropriate.</p>`,
      callout: { type: 'warning', title: 'Key Rule', text: 'Before sharing anything with AI, ask: "Would I be comfortable if this data were public?" If not, don\'t share it.' },
      prompts: [
        { label: 'Ethics Audit', text: 'Review my current AI usage at work and identify potential ethical concerns. I use AI for: drafting emails to staff, creating performance summaries, generating customer responses, and brainstorming strategy. For each, list the ethical risks and mitigation steps.' }
      ],
      quiz: [
        { q: 'What\'s the golden rule for AI data privacy?', options: ['All data is safe with AI', 'Don\'t share anything you wouldn\'t want to be public', 'Only share encrypted data', 'Privacy isn\'t a concern with modern AI'], correct: 1, explanation: 'A practical privacy rule: if you wouldn\'t be comfortable with the data being public, don\'t share it with AI tools.' }
      ],
      practice: { title: 'Ethics Review', desc: 'Audit your own AI usage over the past few weeks. Identify any potential ethical concerns (privacy, bias, transparency) and write guidelines for yourself.' }
    },
    {
      day: 26, title: 'Building AI into Your Daily Routine',
      tool: 'Any AI Tool', duration: '15 min', xp: 70,
      outcomes: ['Design a daily AI-enhanced workflow', 'Identify your highest-ROI AI use cases', 'Build sustainable AI habits'],
      content: `<p>The real value of AI isn't in occasional use — it's in systematic daily integration. The most productive AI users have built it into their routine like email or messaging.</p>
<p><strong>Morning</strong>: AI summarises overnight emails, generates daily priorities, drafts first responses.</p>
<p><strong>Midday</strong>: AI assists with content creation, document drafting, analysis tasks.</p>
<p><strong>Evening</strong>: AI summarises the day, prepares tomorrow's agenda, generates any pending communications.</p>`,
      prompts: [
        { label: 'Daily Workflow', text: 'Design my ideal AI-enhanced daily workflow as a general manager of 4 retail stores. Break it into: morning (7-9am), midday (12-2pm), and evening (5-6pm) AI tasks. For each block, list: what I should use AI for, which tool, and the prompt template.' }
      ],
      quiz: [
        { q: 'What makes AI most valuable in daily work?', options: ['Using it for everything', 'Systematic integration into routine workflows', 'Only using it for big projects', 'Checking it once a week'], correct: 1, explanation: 'Consistent, systematic daily use of AI for the right tasks provides compounding productivity gains over time.' }
      ],
      practice: { title: 'Routine Design', desc: 'Map out your ideal AI-enhanced daily routine. For each time block, list what you\'d use AI for and which tool. Try following this routine for the rest of the week.' }
    },
    {
      day: 27, title: 'AI for Team & Leadership',
      tool: 'ChatGPT', duration: '15 min', xp: 60,
      outcomes: ['Use AI to improve team communication', 'Create training materials with AI', 'Lead AI adoption in your team'],
      content: `<p>As a manager, your AI skills multiply when you help your team adopt AI effectively. This lesson covers how to lead AI adoption without resistance.</p>
<p><strong>Start with quick wins</strong>: Show your team one specific AI use case that saves them 30+ minutes per week. Practical demonstration beats theory.</p>
<p><strong>Create shared prompts</strong>: Build a team prompt library for common tasks. This standardises quality while saving everyone time.</p>`,
      prompts: [
        { label: 'Team Adoption Plan', text: 'Create a 4-week AI adoption plan for a retail management team of 15 people. Most are beginners with AI. Include: week-by-week goals, training topics, practice exercises, success metrics, and how to handle resistance. Focus on practical, immediate time-saving use cases.' }
      ],
      quiz: [
        { q: 'What\'s the best way to introduce AI to a team?', options: ['Mandate everyone use it immediately', 'Start with one practical quick-win that saves visible time', 'Send a long policy document', 'Let everyone figure it out alone'], correct: 1, explanation: 'Quick wins build trust and enthusiasm. Show the team one specific task where AI saves real time, and adoption follows naturally.' }
      ],
      practice: { title: 'Team AI Plan', desc: 'Create an AI adoption plan for your team or a team you work with. Include the first "quick win" demo, a shared prompt library of 5 templates, and a rollout timeline.' }
    },
    {
      day: 28, title: 'AI Side Projects & Monetisation',
      tool: 'ChatGPT', duration: '15 min', xp: 70,
      outcomes: ['Identify AI-powered side income opportunities', 'Build a simple AI-powered service', 'Understand the AI freelancing landscape'],
      content: `<p>Your AI skills are now marketable. There's a growing demand for people who can apply AI tools effectively — even without technical backgrounds.</p>
<p><strong>AI freelancing</strong>: Offer prompt engineering, content creation, automation setup, or AI consulting services.</p>
<p><strong>AI-enhanced products</strong>: Create templates, prompt libraries, courses, or guides that package your AI expertise.</p>
<p><strong>Automation as a service</strong>: Build and sell automated workflows for businesses that don't know how.</p>`,
      prompts: [
        { label: 'Business Model', text: 'Based on my skills (retail management, AI tools proficiency, content creation, prompt engineering), suggest 5 AI-powered side income ideas I could start within 30 days. For each: describe the service, target market, pricing model, and estimated monthly revenue potential. Rank by ease of starting.' }
      ],
      quiz: [
        { q: 'What\'s the fastest path to monetising AI skills?', options: ['Building a complex AI product', 'Offering practical AI services (content, automation, consulting)', 'Waiting for AI certifications', 'Only working in tech companies'], correct: 1, explanation: 'Practical service offerings — content creation, automation setup, consulting — have the lowest barrier to entry and immediate market demand.' }
      ],
      practice: { title: 'Side Project Plan', desc: 'Choose one AI-powered side income idea. Create a one-page business plan: service description, target market, pricing, and 30-day launch plan.' }
    },
    {
      day: 29, title: 'Capstone Project: Build Your AI System',
      tool: 'All Tools', duration: '20 min', xp: 150,
      outcomes: ['Combine all skills into one end-to-end project', 'Build a complete AI-powered workflow', 'Create a portfolio-worthy deliverable'],
      content: `<p>This is your capstone project. You'll combine everything you've learned into one comprehensive AI-powered system that solves a real problem.</p>
<p><strong>Choose your project</strong>:</p>
<ul>
<li>An "AI Operations Manual" for your workplace</li>
<li>A content creation engine (idea → draft → edit → schedule)</li>
<li>A personal AI dashboard (daily briefing, email triage, task planning)</li>
<li>An AI consulting proposal for a real business</li>
</ul>
<p>Use at least 3 different AI tools in your project. Document your process.</p>`,
      callout: { type: 'tip', title: 'Portfolio Piece', text: 'This project should be good enough to show to colleagues, managers, or potential clients. Put real effort into the quality — it\'s proof of your AI capability.' },
      prompts: [
        { label: 'Project Plan', text: 'Help me plan my capstone project. I want to create a complete AI Operations Manual for my retail business (4 stores, 45 staff). It should cover: daily AI workflows, tool recommendations, prompt templates for every department, automation opportunities, and an implementation timeline. Create the project outline and task list.' }
      ],
      quiz: [
        { q: 'What makes a strong capstone project?', options: ['Using only one tool', 'Combining multiple AI tools to solve a real problem', 'Making it as theoretical as possible', 'Keeping it very simple'], correct: 1, explanation: 'A strong capstone demonstrates your ability to integrate multiple tools and techniques to solve a genuine, practical problem.' }
      ],
      practice: { title: 'Capstone Build', desc: 'Execute your capstone project. Use at least 3 AI tools. Document your process, prompts, and outputs. This is your crowning achievement.' }
    },
    {
      day: 30, title: 'Graduation: Your AI Future',
      tool: 'All Tools', duration: '15 min', xp: 200,
      outcomes: ['Review all 30 days of learning', 'Plan your next 90 days of AI growth', 'Earn your certificate of completion'],
      content: `<p>Congratulations — you've completed the 30-Day AI Tools Mastery Program. You've gone from AI beginner to capable practitioner in just 30 days.</p>
<p><strong>What you can now do</strong>: Write expert-level prompts, use 20+ AI tools, create content across all formats, automate workflows, make better decisions with AI, and lead AI adoption in your team.</p>
<p><strong>What's next</strong>: Your AI journey doesn't end here. Technology evolves fast. Stay curious, keep experimenting, and build on these foundations.</p>
<p>Plan your next 90 days: pick a specialisation (coding AI, creative AI, or automation AI) and go deeper. Build one AI-powered project per month. Share your knowledge with others.</p>`,
      callout: { type: 'tip', title: 'Final Step', text: 'Go to the Certificate page and claim your certificate. You\'ve earned it. Share it on LinkedIn, add it to your CV, and be proud of what you\'ve accomplished.' },
      prompts: [
        { label: '90-Day Growth Plan', text: 'I just completed a 30-day AI mastery program. I\'m a general manager interested in: retail operations, cryptocurrency trading, and online business. Create a personalised 90-day growth plan that builds on my AI foundation. Include: weekly focus areas, tools to master, projects to build, and milestones.' }
      ],
      quiz: [
        { q: 'What\'s the most important habit for continued AI growth?', options: ['Watching AI news daily', 'Consistent experimentation and applying AI to real problems', 'Getting more certifications', 'Waiting for AI to improve'], correct: 1, explanation: 'Hands-on practice and applying AI to real problems is how you continue growing. Theory without practice fades quickly.' },
        { q: 'After 30 days, you are now...', options: ['An AI engineer', 'A capable AI practitioner who can apply AI tools to real work', 'Finished learning about AI forever', 'Only qualified to use ChatGPT'], correct: 1, explanation: 'You\'re now a capable practitioner with a strong foundation — ready to specialise, build, and lead AI adoption.' }
      ],
      practice: { title: 'Reflection & Next Steps', desc: 'Write a brief reflection: What was the most valuable thing you learned? How has AI changed your daily work? What will you focus on for the next 90 days? Then claim your certificate.' }
    }
  ]
};

// ===== STATE =====
function saveState() { /* in-memory only inside iframe */ }

let state = {
  completedLessons: [],
  streak: 0,
  lastCompletedDate: null,
  xp: 0,
  currentView: 'hero',
  currentWeek: 1,
  quizAnswers: {},
  userName: 'Learner'
};

// ===== VIEW MANAGEMENT =====
function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
  const el = document.getElementById('view-' + view);
  if (!el) return;
  el.classList.add('view--active');
  state.currentView = view;
  window.scrollTo(0, 0);

  if (view === 'dashboard') renderDashboard();
  if (view === 'certificate') renderCertificate();
  if (view === 'intro') initIntroProgress();
}

// ===== INTRO LESSON READING PROGRESS =====
function initIntroProgress() {
  // Clean up any previous listener
  if (window._introScrollHandler) {
    window.removeEventListener('scroll', window._introScrollHandler);
  }
  window._introScrollHandler = function() {
    const fill = document.getElementById('introProgressFill');
    if (!fill) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    fill.style.width = pct + '%';
  };
  window.addEventListener('scroll', window._introScrollHandler, { passive: true });
}

// ===== DASHBOARD =====
function renderDashboard() {
  const completed = state.completedLessons.length;
  const total = COURSE.lessons.length;
  const pct = Math.round((completed / total) * 100);

  document.getElementById('progressText').textContent = `${completed} of ${total} lessons completed`;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPercent').textContent = pct + '% complete';
  document.getElementById('streakBadge').textContent = `🔥 ${state.streak}-day streak`;
  document.getElementById('xpBadge').textContent = `⭐ ${state.xp} XP`;
  document.getElementById('streakCount').textContent = state.streak;
  document.getElementById('xpCount').textContent = state.xp;

  // Week title
  const week = COURSE.weeks.find(w => w.id === state.currentWeek);
  document.getElementById('currentWeekTitle').textContent = `Week ${week.id}: ${week.title}`;

  // Week tabs
  const tabsEl = document.getElementById('weekTabs');
  tabsEl.innerHTML = COURSE.weeks.map(w => `
    <button class="week-tab ${w.id === state.currentWeek ? 'week-tab--active' : ''}"
            onclick="switchWeek(${w.id})">
      Week ${w.id}: ${w.title}
    </button>
  `).join('');

  // Lesson cards
  const grid = document.getElementById('lessonsGrid');
  const weekLessons = COURSE.lessons.filter(l => week.days.includes(l.day));

  grid.innerHTML = weekLessons.map((lesson, i) => {
    const isCompleted = state.completedLessons.includes(lesson.day);
    const nextLesson = state.completedLessons.length + 1;
    const isCurrent = lesson.day === nextLesson;
    const isLocked = lesson.day > nextLesson;

    let numClass = 'lesson-card__number--pending';
    let cardClass = '';
    let icon = '';

    if (isCompleted) {
      numClass = 'lesson-card__number--completed';
      cardClass = 'lesson-card--completed';
      icon = '✓';
    } else if (isCurrent) {
      numClass = 'lesson-card__number--current';
      icon = '▶';
    } else if (isLocked) {
      cardClass = 'lesson-card--locked';
      icon = '🔒';
    }

    return `
      <div class="lesson-card ${cardClass} animate-in"
           onclick="${isLocked ? '' : `openLesson(${lesson.day})`}"
           style="animation-delay: ${i * 0.04}s">
        <div class="lesson-card__number ${numClass}">
          ${icon || lesson.day}
        </div>
        <div class="lesson-card__content">
          <div class="lesson-card__title">${lesson.title}</div>
          <div class="lesson-card__meta">
            <span>${lesson.duration}</span>
            <span>·</span>
            <span>${lesson.xp} XP</span>
            <span class="lesson-card__tool">${lesson.tool}</span>
          </div>
        </div>
        <div class="lesson-card__arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    `;
  }).join('');
}

function switchWeek(weekId) {
  state.currentWeek = weekId;
  renderDashboard();
}

// ===== LESSON VIEW =====
function openLesson(day) {
  const lesson = COURSE.lessons.find(l => l.day === day);
  if (!lesson) return;

  const container = document.getElementById('lessonContent');
  const isCompleted = state.completedLessons.includes(day);

  container.innerHTML = `
    <div class="lesson-view__header">
      <div class="lesson-view__day">Day ${lesson.day} of 30</div>
      <h1 class="lesson-view__title">${lesson.title}</h1>
      <div class="lesson-view__meta">
        <span class="lesson-view__meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${lesson.duration}
        </span>
        <span class="lesson-view__meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ${lesson.xp} XP
        </span>
        <span class="lesson-view__meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>
          ${lesson.tool}
        </span>
      </div>
    </div>

    <!-- Learning Outcomes -->
    <div class="lesson-section">
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        What You'll Learn
      </h3>
      <ul>
        ${lesson.outcomes.map(o => `<li>${o}</li>`).join('')}
      </ul>
    </div>

    <!-- Study Material -->
    <div class="lesson-section">
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Study Material
      </h3>
      ${lesson.content}
      ${lesson.callout ? `
        <div class="callout callout--${lesson.callout.type}">
          <div class="callout__title">${lesson.callout.title}</div>
          <p>${lesson.callout.text}</p>
        </div>
      ` : ''}
    </div>

    <!-- Prompts to Try -->
    ${lesson.prompts ? `
    <div class="lesson-section">
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Prompts to Try
      </h3>
      ${lesson.prompts.map(p => `
        <div class="prompt-box">
          <span class="prompt-box__label">${p.label}</span>
          <button class="prompt-box__copy" onclick="copyPrompt(this, \`${p.text.replace(/`/g, '\\`').replace(/"/g, '&quot;')}\`)">Copy</button>
          ${p.text}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Quiz -->
    ${lesson.quiz ? `
    <div class="quiz" id="quiz-section">
      <h3 style="font-family: var(--font-display); font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Knowledge Check
      </h3>
      ${lesson.quiz.map((q, qi) => `
        <div class="quiz__question">
          <span class="quiz__question-num">Q${qi + 1}.</span>
          <span>${q.q}</span>
        </div>
        <div class="quiz__options" id="quiz-options-${day}-${qi}">
          ${q.options.map((opt, oi) => `
            <div class="quiz__option" onclick="answerQuiz(${day}, ${qi}, ${oi})" id="quiz-opt-${day}-${qi}-${oi}">
              <div class="quiz__radio"></div>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
        <div class="quiz__feedback" id="quiz-feedback-${day}-${qi}"></div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Practice -->
    ${lesson.practice ? `
    <div class="practice-area">
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Hands-On Practice
      </h3>
      <p class="practice-area__desc">${lesson.practice.desc}</p>
      <textarea placeholder="Write your notes, prompts, or reflections here..."></textarea>
    </div>
    ` : ''}

    <!-- Complete Button -->
    <div class="lesson-complete">
      <div>
        <div style="font-weight: 600;">${isCompleted ? '✅ Lesson Completed' : 'Ready to finish?'}</div>
        <div class="lesson-complete__xp">+${lesson.xp} XP</div>
      </div>
      <button class="btn ${isCompleted ? 'btn--outline' : 'btn--primary'}"
              onclick="${isCompleted ? `showView('dashboard')` : `completeLesson(${day})`}">
        ${isCompleted ? 'Back to Dashboard' : 'Complete Lesson ✓'}
      </button>
    </div>
  `;

  // Restore quiz answers
  if (state.quizAnswers[day]) {
    for (const key in state.quizAnswers[day]) {
      const [qi, oi] = key.split('-').map(Number);
      highlightQuizAnswer(day, qi, oi);
    }
  }

  showView('lesson');
}

// ===== QUIZ =====
function answerQuiz(day, qIndex, optIndex) {
  const lesson = COURSE.lessons.find(l => l.day === day);
  const question = lesson.quiz[qIndex];
  const isCorrect = optIndex === question.correct;
  const key = `${qIndex}-${optIndex}`;

  // Already answered
  if (state.quizAnswers[day] && Object.keys(state.quizAnswers[day]).some(k => k.startsWith(qIndex + '-'))) return;

  if (!state.quizAnswers[day]) state.quizAnswers[day] = {};
  state.quizAnswers[day][key] = true;

  highlightQuizAnswer(day, qIndex, optIndex);
}

function highlightQuizAnswer(day, qIndex, optIndex) {
  const lesson = COURSE.lessons.find(l => l.day === day);
  const question = lesson.quiz[qIndex];
  const isCorrect = optIndex === question.correct;

  // Reset all options for this question
  const options = document.querySelectorAll(`#quiz-options-${day}-${qIndex} .quiz__option`);
  options.forEach(o => {
    o.classList.remove('quiz__option--selected', 'quiz__option--correct', 'quiz__option--wrong');
    o.onclick = null; // disable further clicks
  });

  const selectedEl = document.getElementById(`quiz-opt-${day}-${qIndex}-${optIndex}`);
  const correctEl = document.getElementById(`quiz-opt-${day}-${qIndex}-${question.correct}`);

  if (isCorrect) {
    selectedEl.classList.add('quiz__option--correct');
  } else {
    selectedEl.classList.add('quiz__option--wrong');
    correctEl.classList.add('quiz__option--correct');
  }

  const feedbackEl = document.getElementById(`quiz-feedback-${day}-${qIndex}`);
  feedbackEl.className = 'quiz__feedback ' + (isCorrect ? 'quiz__feedback--correct' : 'quiz__feedback--wrong');
  feedbackEl.innerHTML = isCorrect
    ? `✅ Correct! ${question.explanation}`
    : `❌ Not quite. ${question.explanation}`;
}

// ===== COMPLETE LESSON =====
function completeLesson(day) {
  if (state.completedLessons.includes(day)) return;

  const lesson = COURSE.lessons.find(l => l.day === day);
  state.completedLessons.push(day);
  state.xp += lesson.xp;

  // Streak logic
  const today = new Date().toDateString();
  if (state.lastCompletedDate !== today) {
    if (state.lastCompletedDate) {
      const last = new Date(state.lastCompletedDate);
      const diff = Math.floor((new Date(today) - last) / (1000 * 60 * 60 * 24));
      state.streak = diff <= 1 ? state.streak + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastCompletedDate = today;
  }

  // Update nav
  document.getElementById('streakCount').textContent = state.streak;
  document.getElementById('xpCount').textContent = state.xp;

  // Auto-advance week
  const nextDay = day + 1;
  if (nextDay <= 30) {
    const nextWeek = COURSE.weeks.find(w => w.days.includes(nextDay));
    if (nextWeek) state.currentWeek = nextWeek.id;
  }

  // Persist progress
  saveState();

  // Show toast
  showToast('🎉', `Lesson ${day} Complete!`, `+${lesson.xp} XP earned`);

  // Re-render lesson as completed
  openLesson(day);

  // Check milestones
  setTimeout(() => {
    if (state.completedLessons.length === 7) showToast('🏆', 'Week 1 Complete!', 'You\'ve mastered AI Foundations');
    if (state.completedLessons.length === 14) showToast('🏆', 'Week 2 Complete!', 'Prompt Engineering unlocked');
    if (state.completedLessons.length === 21) showToast('🏆', 'Week 3 Complete!', 'Creative AI mastered');
    if (state.completedLessons.length === 30) showToast('🎓', 'Course Complete!', 'Claim your certificate →');
  }, 2000);
}

// ===== COPY PROMPT =====
function copyPrompt(btn, text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    }).catch(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    });
  } else {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  }
}

// ===== TOAST =====
function showToast(icon, text, sub) {
  const toast = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastText').textContent = text;
  document.getElementById('toastSub').textContent = sub;
  toast.classList.add('toast--visible');
  setTimeout(() => toast.classList.remove('toast--visible'), 3500);
}

// ===== CERTIFICATE =====
function renderCertificate() {
  const completed = state.completedLessons.length;
  const total = COURSE.lessons.length;
  const isComplete = completed >= total;

  document.getElementById('certStatus').textContent = isComplete
    ? 'Congratulations! You\'ve completed all 30 lessons. Generate your certificate below.'
    : `Complete all ${total} lessons to unlock your certificate. (${completed}/${total} done)`;

  document.getElementById('certBtn').disabled = !isComplete;
  document.getElementById('certDate').textContent = new Date().toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function generateCert() {
  const name = document.getElementById('certNameInput').value.trim();
  if (!name) {
    document.getElementById('certNameInput').style.borderColor = 'var(--color-error)';
    return;
  }

  document.getElementById('certName').textContent = name;
  state.userName = name;
  document.getElementById('userName').textContent = name.split(' ')[0];
  saveState();

  showToast('🎓', 'Certificate Generated!', 'Congratulations, ' + name.split(' ')[0] + '!');

  // Open printable certificate
  const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const certHTML = `<!DOCTYPE html><html><head><title>AI Mastery Certificate — Pro Sphinx</title>
<style>
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,700,800&f[]=satoshi@400,500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#060a14;font-family:'Satoshi',sans-serif}
.cert{width:800px;background:#0c1220;padding:64px;border:3px solid #1a8fff;border-radius:16px;text-align:center;position:relative;overflow:hidden;box-shadow:0 0 60px rgba(26,143,255,0.15)}
.cert::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,#1a8fff,#38d8e0)}
.cert h1{font-family:'Cabinet Grotesk',sans-serif;font-size:14px;text-transform:uppercase;letter-spacing:3px;color:#1a8fff;margin-bottom:32px}
.cert h2{font-family:'Cabinet Grotesk',sans-serif;font-size:28px;color:#e0e8f0;margin-bottom:8px}
.cert .name{font-family:'Cabinet Grotesk',sans-serif;font-size:42px;font-weight:800;background:linear-gradient(135deg,#1a8fff,#38d8e0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:24px 0}
.cert p{color:#7a8ca4;font-size:15px;line-height:1.6;margin-bottom:8px}
.cert .course{font-weight:700;font-size:20px;color:#e0e8f0;margin:16px 0}
.cert .date{margin-top:32px;color:#455570;font-size:13px}
.cert .id{font-family:monospace;color:#455570;font-size:11px;margin-top:8px}
@media print{body{background:#060a14}.cert{border:2px solid #1a8fff;box-shadow:none}}
</style></head><body>
<div class="cert">
<h1>AI Mastery Program by Pro Sphinx</h1>
<h2>Certificate of Completion</h2>
<p>This certifies that</p>
<div class="name">${name}</div>
<p>has successfully completed the</p>
<div class="course">30-Day AI Tools Mastery Program</div>
<p>Covering 20+ AI tools across prompting, content creation,<br>research, automation, and deployment.</p>
<div class="date">${today}</div>
<div class="id">ID: AIM-${Date.now().toString(36).toUpperCase()}</div>
</div>
<script>setTimeout(()=>window.print(),500)<\/script>
</body></html>`;

  const w = window.open('', '_blank');
  if (w) { w.document.open(); w.document.write(certHTML); w.document.close(); }
}

// Name input listener
document.getElementById('certNameInput').addEventListener('input', function() {
  this.style.borderColor = '';
});

// ===== INIT =====
// Pre-render dashboard so it's ready when user unlocks access
document.addEventListener('DOMContentLoaded', function() {
  try { renderDashboard(); } catch(e) {}
  // If user already has access (cookie set), go straight to dashboard
  if (typeof hasAccess !== 'undefined' && hasAccess) {
    showView('dashboard');
  }
});
