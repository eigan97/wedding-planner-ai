import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { ITINERARIO_PROMPT } from './prompt';

// Schema para la herramienta itinerario
export const itinerarioSchema = z.object({
    eventos: z.array(z.object({
        hora: z.string().optional().default('15:00').describe('Hora del evento'),
        titulo: z.string().optional().default('Ceremonia').describe('Título del evento'),
        descripcion: z.string().optional().default('Descripción del evento').describe('Descripción del evento'),
        icono: z.string().optional().default('💒').describe('Icono del evento (emoji o clase)')
    })).optional().default([
        {
            hora: '15:00',
            titulo: 'Ceremonia',
            descripcion: 'La ceremonia se llevará a cabo en el jardín principal',
            icono: '💒'
        },
        {
            hora: '17:00',
            titulo: 'Cóctel de Bienvenida',
            descripcion: 'Cóctel de bienvenida con bebidas y aperitivos',
            icono: '🥂'
        },
        {
            hora: '19:00',
            titulo: 'Cena',
            descripcion: 'Cena elegante con música en vivo',
            icono: '🍽️'
        },
        {
            hora: '21:00',
            titulo: 'Baile',
            descripcion: '¡Es hora de bailar y celebrar!',
            icono: '💃'
        }
    ]).describe('Array de eventos del día de la boda'),
    estilo: z.enum(['timeline', 'cards', 'list']).optional().default('timeline').describe('Estilo de presentación del itinerario')
});

// Función de ejecución
export async function executeItinerario(args: z.infer<typeof itinerarioSchema>) {
    const {
        eventos = [
            {
                hora: '15:00',
                titulo: 'Ceremonia',
                descripcion: 'La ceremonia se llevará a cabo en el jardín principal',
                icono: '💒'
            },
            {
                hora: '17:00',
                titulo: 'Cóctel de Bienvenida',
                descripcion: 'Cóctel de bienvenida con bebidas y aperitivos',
                icono: '🥂'
            },
            {
                hora: '19:00',
                titulo: 'Cena',
                descripcion: 'Cena elegante con música en vivo',
                icono: '🍽️'
            },
            {
                hora: '21:00',
                titulo: 'Baile',
                descripcion: '¡Es hora de bailar y celebrar!',
                icono: '💃'
            }
        ],
        estilo = 'timeline'
    } = args;

    try {
        // Crear el prompt específico con los datos del itinerario
        const userPrompt = `
Crea la sección de "Itinerario del Evento" para la boda.

DETALLES DEL ITINERARIO:
- Estilo de presentación: ${estilo}
- Número de eventos: ${eventos.length}

EVENTOS DEL DÍA:
${eventos.map((evento, index) => `
${index + 1}. ${evento.titulo}
   - Hora: ${evento.hora}
   - Descripción: ${evento.descripcion}
   - Icono: ${evento.icono}
`).join('\n')}

Genera el HTML para la sección de itinerario siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: ITINERARIO_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeItinerario:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl md:text-5xl font-light text-center mb-16 text-gray-800">
                    ⏰ Itinerario del Evento
                </h2>
                
                <div class="max-w-4xl mx-auto">
                    <div class="relative">
                        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 to-pink-300"></div>
                        
                        ${eventos.map((evento, index) => `
                            <div class="relative flex items-center mb-8">
                                <div class="absolute left-0 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-rose-200 flex items-center justify-center z-10">
                                    <span class="text-2xl">${evento.icono}</span>
                                </div>
                                
                                <div class="ml-20 bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex-1">
                                    <div class="flex items-center justify-between mb-2">
                                        <h3 class="text-xl font-semibold text-gray-800">${evento.titulo}</h3>
                                        <span class="text-lg font-medium text-rose-500">${evento.hora}</span>
                                    </div>
                                    <p class="text-gray-600 leading-relaxed">${evento.descripcion}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const itinerarioTool = {
    name: 'itinerario',
    description: 'Genera el itinerario del evento con horarios y actividades',
    parameters: itinerarioSchema,
    execute: executeItinerario
}; 