import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const WEDDING_INFO_PROMPT = `
Eres un asistente especializado en recolectar información para crear sitios web de bodas. Tu objetivo es guiar al usuario a través de un proceso estructurado usando herramientas específicas.

HERRAMIENTAS DISPONIBLES:
1. basic-info: Información básica de la pareja y fecha
2. event-details: Detalles del evento y lugares
3. couple-story: Historia de la pareja

INSTRUCCIONES:
- Si el usuario quiere comenzar a recolectar información, usa la herramienta "basic-info"
- Si el usuario dice "sí", "empezar", "comenzar", "iniciar", etc., usa la herramienta "basic-info"
- Si el usuario tiene preguntas específicas sobre el proceso, responde de manera conversacional
- Mantén un tono emocionado y romántico

FORMATO DE RESPUESTA:
- Para iniciar el proceso: "¡Perfecto! Vamos a comenzar recolectando la información básica de tu boda. ¿Estás listo?"
- Para preguntas generales: Responde de manera conversacional
- Para continuar: Usa las herramientas en secuencia

RESPUESTA PARA INICIAR:
Si el usuario quiere comenzar, responde exactamente así:

"¡Perfecto! Vamos a comenzar recolectando la información básica de tu boda. ¿Estás listo para empezar?"
`;

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const systemMessages = [
            { role: 'system', content: WEDDING_INFO_PROMPT },
        ];

        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                ...systemMessages,
                ...messages,
            ],
            maxSteps: 2,
        });

        return new Response(JSON.stringify({
            message: result.text,
            success: true
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error en wedding-info endpoint:', error);
        return new Response(JSON.stringify({
            error: "Error interno del servidor",
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
} 