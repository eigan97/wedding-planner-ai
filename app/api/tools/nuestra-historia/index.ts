import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NUESTRA_HISTORIA_PROMPT } from './prompt';

// Schema para la herramienta nuestra historia
export const nuestraHistoriaSchema = z.object({
    momentos: z.array(z.object({
        fecha: z.string().optional().default('2020-01-01').describe('Fecha del momento'),
        titulo: z.string().optional().default('Momentos especiales').describe('Título del momento'),
        descripcion: z.string().optional().default('Descripción del momento especial').describe('Descripción del momento'),
        imagen: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen del momento'),
        estilo: z.string().optional().default('minimalista').describe('Estilo de presentación (puede ser: minimalista, timeline, cards, story, o cualquier estilo personalizado)')
    })).optional().default([
        { fecha: '2020-01-01', titulo: 'Primer Encuentro', descripcion: 'El día que nuestros caminos se cruzaron por primera vez', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', estilo: 'minimalista' },
        { fecha: '2021-06-15', titulo: 'Primer Viaje Juntos', descripcion: 'Nuestro primer viaje juntos, lleno de aventuras y risas', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', estilo: 'minimalista' },
        { fecha: '2023-12-25', titulo: 'El Compromiso', descripcion: 'El momento más especial cuando decidimos unir nuestras vidas para siempre', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', estilo: 'minimalista' }
    ]).describe('Array de momentos importantes en la relación'),
    estilo: z.string().optional().default('minimalista').describe('Estilo de presentación de la historia (puede ser: minimalista, timeline, cards, story, o cualquier estilo personalizado)')
});

// Función de ejecución
export async function executeNuestraHistoria(args: z.infer<typeof nuestraHistoriaSchema>) {
    const {
        momentos = [
            { fecha: '2020-01-01', titulo: 'Primer Encuentro', descripcion: 'El día que nuestros caminos se cruzaron por primera vez', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', estilo: 'minimalista' },
            { fecha: '2021-06-15', titulo: 'Primer Viaje Juntos', descripcion: 'Nuestro primer viaje juntos, lleno de aventuras y risas', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', estilo: 'minimalista' },
            { fecha: '2023-12-25', titulo: 'El Compromiso', descripcion: 'El momento más especial cuando decidimos unir nuestras vidas para siempre', imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', estilo: 'minimalista' }
        ],
        estilo = 'minimalista'
    } = args;

    try {
        // Crear el prompt específico con los datos de la historia
        const userPrompt = `
Crea la sección de "Nuestra Historia" para la boda.

DETALLES DE LA HISTORIA:
- Estilo de presentación: ${estilo}
- Número de momentos: ${momentos.length}

MOMENTOS IMPORTANTES:
${momentos.map((momento, index) => `
${index + 1}. ${momento.titulo}
   - Fecha: ${momento.fecha}
   - Descripción: ${momento.descripcion}
   - Imagen: ${momento.imagen}
`).join('\n')}

Genera el HTML para la sección de nuestra historia siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: NUESTRA_HISTORIA_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeNuestraHistoria:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        💕 Nuestra Historia
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Los momentos especiales que han marcado nuestro camino juntos
                    </p>
                </div>
                
                <div class="max-w-4xl mx-auto">
                    <div class="relative">
                        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 to-pink-300"></div>
                        
                        ${momentos.map((momento, index) => `
                            <div class="relative flex items-center mb-8">
                                <div class="absolute left-0 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-rose-200 flex items-center justify-center z-10">
                                    <span class="text-2xl">💕</span>
                                </div>
                                
                                <div class="ml-20 bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex-1">
                                    <div class="flex items-center justify-between mb-2">
                                        <h3 class="text-xl font-semibold text-gray-800">${momento.titulo}</h3>
                                        <span class="text-lg font-medium text-rose-500">${momento.fecha}</span>
                                    </div>
                                    <p class="text-gray-600 leading-relaxed">${momento.descripcion}</p>
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
export const nuestraHistoriaTool = {
    name: 'nuestra_historia',
    description: 'Genera la sección de nuestra historia con momentos importantes de la relación',
    parameters: nuestraHistoriaSchema,
    execute: executeNuestraHistoria
}; 