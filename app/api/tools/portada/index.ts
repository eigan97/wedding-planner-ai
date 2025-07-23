import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { PORTADA_PROMPT } from './prompt';

// Schema para la herramienta portada
export const portadaSchema = z.object({
    nombreNovio: z.string().optional().default('Juan').describe('Nombre del novio'),
    nombreNovia: z.string().optional().default('María').describe('Nombre de la novia'),
    fechaBoda: z.string().optional().default('15 de diciembre de 2024').describe('Fecha de la boda'),
    fraseEspecial: z.string().optional().default('Un amor eterno comienza aquí').describe('Frase especial para la portada'),
    estilo: z.string().optional().default('romantico').describe('Estilo visual de la portada (puede ser: romantico, elegante, rustico, moderno, o cualquier estilo personalizado)')
});

// Función de ejecución
export async function executePortada(args: z.infer<typeof portadaSchema>) {
    const {
        nombreNovio = 'Juan',
        nombreNovia = 'María',
        fechaBoda = '15 de diciembre de 2024',
        fraseEspecial = 'Un amor eterno comienza aquí',
        estilo = 'romantico'
    } = args;

    try {
        // Crear el prompt específico con los datos de la boda
        const userPrompt = `
Crea la sección de portada para la boda de ${nombreNovio} y ${nombreNovia}.

DETALLES DE LA BODA:
- Novio: ${nombreNovio}
- Novia: ${nombreNovia}
- Fecha: ${fechaBoda}
- Frase especial: ${fraseEspecial}
- Estilo: ${estilo}

Genera el HTML para la sección de portada siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: PORTADA_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 2000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executePortada:', error);
        // HTML de fallback en caso de error
        return `
        <section class="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
                 style="background-image: url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');">
            </div>
            
            <div class="absolute inset-0 bg-black opacity-40"></div>
            
            <div class="relative z-10 text-center text-white px-4">
                <h1 class="text-6xl md:text-8xl font-light mb-4 font-serif">
                    ${nombreNovio}
                </h1>
                <div class="text-4xl md:text-6xl font-light mb-4 font-serif">
                    <span class="text-3xl md:text-5xl">&</span>
                </div>
                <h1 class="text-6xl md:text-8xl font-light mb-8 font-serif">
                    ${nombreNovia}
                </h1>
                
                <div class="text-xl md:text-2xl font-light mb-4">
                    ${fechaBoda}
                </div>
                
                ${fraseEspecial ? `<p class="text-lg md:text-xl font-light italic">${fraseEspecial}</p>` : ''}
            </div>
            
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const portadaTool = {
    name: 'portada',
    description: 'Genera la sección de portada del sitio web de boda con nombres de los novios, fecha y diseño elegante',
    parameters: portadaSchema,
    execute: executePortada
}; 