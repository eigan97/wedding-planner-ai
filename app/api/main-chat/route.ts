import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { allTools } from '../tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { message } = await req.json()
    console.log('Main Chat API - message:', message)

    try {
        const result = streamText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'user', content: message }
            ],
            tools: allTools,
            toolChoice: 'auto', // El modelo decide cuándo usar herramientas
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error('Main Chat API Error:', error);
        return new Response(JSON.stringify({
            error: "Internal Server Error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// También permitir GET para verificar que la API está funcionando
export async function GET() {
    return new Response(JSON.stringify({
        message: "Main Chat API está funcionando correctamente",
        apiType: 'main-chat',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
} 