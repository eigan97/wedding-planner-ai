import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { MESA_REGALOS_PROMPT } from './prompt';

// Schema para la herramienta mesa de regalos
export const mesaRegalosSchema = z.object({
    regalos: z.array(z.object({
        nombre: z.string().optional().default('Juego de Sábanas').describe('Nombre del regalo'),
        descripcion: z.string().optional().default('Sábanas de algodón egipcio de alta calidad').describe('Descripción del regalo'),
        precio: z.string().optional().default('$150').describe('Precio del regalo'),
        categoria: z.string().optional().default('🏠 Hogar').describe('Categoría del regalo'),
        imagen: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen del regalo'),
        enlaceCompra: z.string().optional().default('https://tienda.com/regalo').describe('Enlace para comprar el regalo'),
        disponible: z.boolean().optional().default(true).describe('Si el regalo está disponible')
    })).optional().default([
        {
            nombre: 'Juego de Sábanas',
            descripcion: 'Sábanas de algodón egipcio de alta calidad',
            precio: '$150',
            categoria: '🏠 Hogar',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            enlaceCompra: 'https://tienda.com/regalo',
            disponible: true
        },
        {
            nombre: 'Contribución para Luna de Miel',
            descripcion: 'Ayúdanos a hacer realidad nuestro viaje de ensueño',
            precio: 'Cualquier monto',
            categoria: '✈️ Viaje',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            enlaceCompra: 'https://paypal.com/contribucion',
            disponible: true
        }
    ]).describe('Array de regalos disponibles'),
    mensaje: z.string().optional().default('Tu presencia es nuestro mejor regalo, pero si deseas hacernos un obsequio, aquí tienes algunas opciones que nos encantarían').describe('Mensaje sobre los regalos'),
    estilo: z.string().optional().default('minimalista').describe('Estilo de presentación de los regalos (puede ser: minimalista, cards, list, grid, o cualquier estilo personalizado)')
});

// Función de ejecución
export async function executeMesaRegalos(args: z.infer<typeof mesaRegalosSchema>) {
    const {
        regalos = [
            {
                nombre: 'Juego de Sábanas',
                descripcion: 'Sábanas de algodón egipcio de alta calidad',
                precio: '$150',
                categoria: '🏠 Hogar',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                enlaceCompra: 'https://tienda.com/regalo',
                disponible: true
            },
            {
                nombre: 'Contribución para Luna de Miel',
                descripcion: 'Ayúdanos a hacer realidad nuestro viaje de ensueño',
                precio: 'Cualquier monto',
                categoria: '✈️ Viaje',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                enlaceCompra: 'https://paypal.com/contribucion',
                disponible: true
            }
        ],
        mensaje = 'Tu presencia es nuestro mejor regalo, pero si deseas hacernos un obsequio, aquí tienes algunas opciones que nos encantarían',
        estilo = 'minimalista'
    } = args;

    try {
        // Crear el prompt específico con los datos de la mesa de regalos
        const userPrompt = `
Crea la sección de "Mesa de Regalos" para la boda.

DETALLES DE LA MESA DE REGALOS:
- Mensaje: ${mensaje}
- Estilo de presentación: ${estilo}
- Número de regalos: ${regalos.length}

REGALOS DISPONIBLES:
${regalos.map((regalo, index) => `
${index + 1}. ${regalo.nombre}
   - Descripción: ${regalo.descripcion}
   - Precio: ${regalo.precio}
   - Categoría: ${regalo.categoria}
   - Disponible: ${regalo.disponible ? 'Sí' : 'No'}
   - Enlace: ${regalo.enlaceCompra}
   - Imagen: ${regalo.imagen}
`).join('\n')}

Genera el HTML para la sección de mesa de regalos siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: MESA_REGALOS_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeMesaRegalos:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-amber-50 to-orange-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        🎁 Mesa de Regalos
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        ${mensaje}
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    ${regalos.map((regalo, index) => `
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <div class="relative h-48 overflow-hidden">
                                <img src="${regalo.imagen}" 
                                     alt="${regalo.nombre}" 
                                     class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                                <div class="absolute top-4 left-4">
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                                        ${regalo.categoria}
                                    </span>
                                </div>
                                ${!regalo.disponible ? `
                                    <div class="absolute top-4 right-4">
                                        <span class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                            Agotado
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="p-6">
                                <h3 class="text-xl font-semibold text-gray-800 mb-2">${regalo.nombre}</h3>
                                <p class="text-gray-600 mb-4 leading-relaxed">${regalo.descripcion}</p>
                                
                                <div class="flex items-center justify-between mb-6">
                                    <span class="text-2xl font-bold text-amber-600">${regalo.precio}</span>
                                    ${regalo.disponible ? `
                                        <span class="text-green-600 text-sm font-medium">✓ Disponible</span>
                                    ` : `
                                        <span class="text-red-600 text-sm font-medium">✗ Agotado</span>
                                    `}
                                </div>
                                
                                ${regalo.disponible ? `
                                    <a href="${regalo.enlaceCompra}" 
                                       target="_blank" 
                                       class="block w-full bg-amber-500 hover:bg-amber-600 text-white text-center font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                                        🎁 Comprar Regalo
                                    </a>
                                ` : `
                                    <button disabled class="block w-full bg-gray-300 text-gray-500 text-center font-medium py-3 px-6 rounded-lg cursor-not-allowed">
                                        🎁 Agotado
                                    </button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-12">
                    <p class="text-gray-600 italic">
                        💝 Tu presencia es nuestro mejor regalo
                    </p>
                </div>
            </div>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const mesaRegalosTool = {
    name: 'mesa_regalos',
    description: 'Genera la sección de mesa de regalos con opciones de obsequios',
    parameters: mesaRegalosSchema,
    execute: executeMesaRegalos
}; 