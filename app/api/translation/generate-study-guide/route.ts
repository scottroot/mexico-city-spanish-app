import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { mistakes, translationDirection, customFocus } = await request.json();

    if (!mistakes || mistakes.length === 0) {
      return NextResponse.json({ studyGuide: null });
    }

    const direction = translationDirection === 'en_to_es'
      ? 'English to Spanish'
      : 'Spanish to English';

    // Format mistakes for the prompt
    const mistakesText = mistakes.map((m: any, i: number) =>
      `${i + 1}. Original: "${m.question}"\n` +
      `   Your answer: "${m.userAnswer}"\n` +
      `   Correct answer: "${m.correctAnswer || 'N/A'}"\n` +
      `   Feedback: ${m.feedback.replace(/<[^>]*>/g, '')}\n`
    ).join('\n');

    const prompt = `You are a helpful Spanish language tutor. A student just completed a ${direction} translation quiz${customFocus ? ` focused on: ${customFocus}` : ''}.

Based on their mistakes below, create a concise study guide (3-5 key takeaways) that:
- Identifies common patterns in their errors
- Provides quick tips to remember the correct translations
- Highlights grammar/vocabulary concepts they should review
- Is encouraging and actionable

Keep it brief (under 200 words) and use bullet points or numbered lists.

Student's Mistakes:
${mistakesText}

Generate a personalized study guide:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a supportive Spanish language tutor creating personalized study guides.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const studyGuide = completion.choices[0].message.content;

    return NextResponse.json({
      studyGuide,
      tokenUsage: completion.usage
    });

  } catch (error) {
    console.error('Error generating study guide:', error);
    return NextResponse.json(
      { error: 'Failed to generate study guide' },
      { status: 500 }
    );
  }
}
