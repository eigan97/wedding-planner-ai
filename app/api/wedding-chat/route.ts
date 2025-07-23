import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { executeTool } from '../tools';
import { SYSTEM_PROMPT_WEDDING_AGENTS } from '@/app/prompts/system';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, previousResult } = await req.json()
    console.log('Wedding Chat API - messages:', messages)

    try {
        const systemMessages = [
            { role: 'system', content: SYSTEM_PROMPT_WEDDING_AGENTS },
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
            maxSteps: 10, // Permitir más pasos para usar múltiples agentes
        });

        // Procesar la respuesta para extraer llamadas a herramientas
        const content = result.text;
        console.log('Respuesta del modelo:', content);

        // Buscar llamadas a herramientas en el texto
        const toolCalls = extractToolCalls(content);

        if (toolCalls.length > 0) {
            // Ejecutar todas las herramientas
            const toolResults = await Promise.all(
                toolCalls.map(async (toolCall) => {
                    try {
                        console.log(`Ejecutando herramienta: ${toolCall.name} con args:`, toolCall.args);
                        const result = await executeTool(toolCall.name, toolCall.args);
                        console.log(`Herramienta ${toolCall.name} ejecutada exitosamente`);
                        return { name: toolCall.name, result };
                    } catch (error) {
                        console.error(`Error ejecutando herramienta ${toolCall.name}:`, error);
                        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                        console.error(`Detalles del error para ${toolCall.name}:`, errorMessage);
                        return { name: toolCall.name, result: `Error: ${errorMessage}` };
                    }
                })
            );

            // Combinar todos los resultados en un HTML completo
            const combinedHTML = combineToolResults(toolResults);

            return new Response(JSON.stringify({
                html: combinedHTML,
                toolResults: toolResults.map(tr => ({ name: tr.name, success: !tr.result.startsWith('Error') }))
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            // Si no hay llamadas a herramientas, devolver el texto del modelo
            return new Response(JSON.stringify({
                html: content,
                message: "No se detectaron llamadas a herramientas específicas"
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

    } catch (error) {
        console.error('Wedding Chat API Error:', error);
        return new Response(JSON.stringify({
            error: "Internal Server Error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// Función para extraer llamadas a herramientas del texto
function extractToolCalls(content: string) {
    const toolCalls = [];

    // Buscar patrones como "usar herramienta X con parámetros Y"
    const toolPatterns = [
        /usar\s+(?:la\s+)?herramienta\s+(\w+)\s+con\s+(?:los\s+)?parámetros?\s*:\s*({[\s\S]*?})/gi,
        /ejecutar\s+(?:la\s+)?herramienta\s+(\w+)\s+con\s+(?:los\s+)?parámetros?\s*:\s*({[\s\S]*?})/gi,
        /herramienta\s+(\w+)\s*:\s*({[\s\S]*?})/gi
    ];

    for (const pattern of toolPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            try {
                const toolName = match[1];
                const argsString = match[2];

                // Limpiar el JSON string
                const cleanArgsString = argsString
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                const args = JSON.parse(cleanArgsString);

                // Verificar que es una herramienta válida
                const validTools = ['portada', 'nuestra_historia', 'itinerario', 'ubicaciones', 'rsvp', 'hospedaje', 'mesa_regalos', 'galeria', 'cuenta_regresiva', 'footer'];
                if (validTools.includes(toolName)) {
                    toolCalls.push({ name: toolName, args });
                    console.log(`Tool call found: ${toolName}`, args);
                }
            } catch (e) {
                console.log('Error parsing tool call:', match[0], e);
            }
        }
    }

    return toolCalls;
}

// Función para combinar los resultados de las herramientas
function combineToolResults(toolResults: Array<{ name: string, result: string }>) {
    const htmlParts = [];

    // Agregar estructura HTML básica
    htmlParts.push(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitio Web de Boda</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .prose { max-width: none; }
    </style>
</head>
<body>
    `);

    // Agregar cada sección generada por las herramientas
    toolResults.forEach(({ name, result }) => {
        if (!result.startsWith('Error')) {
            // Limpiar backticks del resultado
            let cleanResult = result;

            // Remover ```html al inicio
            cleanResult = cleanResult.replace(/^```html\s*/i, '');

            // Remover ``` al final
            cleanResult = cleanResult.replace(/\s*```$/i, '');

            // Remover ``` al inicio (sin html)
            cleanResult = cleanResult.replace(/^```\s*/i, '');

            // Remover ``` al final
            cleanResult = cleanResult.replace(/\s*```$/i, '');

            // Limpiar espacios extra al inicio y final
            cleanResult = cleanResult.trim();

            htmlParts.push(cleanResult);
        }
    });

    // Cerrar HTML
    htmlParts.push(`
</body>
</html>
    `);

    return htmlParts.join('\n');
}

// También permitir GET para verificar que la API está funcionando
export async function GET() {
    return new Response(JSON.stringify({
        message: "Wedding Chat API está funcionando correctamente",
        apiType: 'wedding-chat',
        availableTools: ['portada', 'nuestra_historia', 'itinerario', 'ubicaciones', 'rsvp', 'hospedaje', 'mesa_regalos', 'galeria', 'cuenta_regresiva', 'footer'],
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
} 