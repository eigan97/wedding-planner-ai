import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { SYSTEM_PROMPT_CHAT, SYSTEM_PROMPT_GUARDRAILS } from '@/app/prompts/system';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, previousResult } = await req.json()
  console.log(messages, 'messages')
  try {
    const systemMessages = [
      { role: 'system', content: SYSTEM_PROMPT_GUARDRAILS },
      { role: 'system', content: SYSTEM_PROMPT_CHAT },
    ];
    if (previousResult) {
      systemMessages.push({
        role: 'system',
        content: `Este es el HTML generado anteriormente para la boda. Si el usuario pide cambios, modifícalo en base a este código:
\n\n${previousResult}`
      });
    }
    const result = await generateText({
      model: openai('gpt-4o'),
      messages: [
        ...systemMessages,
        ...messages,
      ],
      maxSteps: 3,
    });

    // Parsear la respuesta para extraer bloque de código y mensaje breve
    const content = result.text;
    console.log('Respuesta cruda del modelo:', content);
    // Regex más flexible para aceptar ``` o ```html
    const codeRegex = /```(?:html)?\n([\s\S]*?)```/m;
    const match = content.match(codeRegex);
    let codeBlock = null;
    let shortMsg = null;
    if (match) {
      codeBlock = match[1].trim();
      shortMsg = content.replace(codeRegex, '').trim();
    } else {
      shortMsg = content.trim();
    }

    return new Response(JSON.stringify({ codeBlock, shortMsg }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}