import { NextResponse } from 'next/server';

// Placeholder for OpenAI integration - would use OpenAI SDK here
export async function POST(req: Request) {
  try {
    const { name, company, title, notes } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
       // Return a semi-personalized fallback if no API key
       const fallback = `Hi ${name},\n\nI was looking into ${company} and noticed your work as ${title}. ${notes ? `I specifically liked the note about: ${notes}` : ''}\n\nI think ONLI could be a massive help for your team. Would you be open to a quick chat?\n\nBest,\nThe ONLI Team`;
       return NextResponse.json({ body: fallback, isFallback: true });
    }

    // Actual OpenAI call would go here
    // const response = await openai.chat.completions.create(...)
    
    return NextResponse.json({ 
      body: "This is an AI-generated draft placeholder (requires OpenAI key configuration).",
      success: true 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
