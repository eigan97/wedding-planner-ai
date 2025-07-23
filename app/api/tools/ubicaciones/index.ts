import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { UBICACIONES_PROMPT } from './prompt';

// Schema para la herramienta ubicaciones
export const ubicacionesSchema = z.object({
    lugares: z.array(z.object({
        nombre: z.string().optional().default('Jardín Principal').describe('Nombre del lugar'),
        direccion: z.string().optional().default('Av. de la Amistad 123, Ciudad de México').describe('Dirección completa'),
        coordenadas: z.string().optional().default('19.4326,-99.1332').describe('Coordenadas GPS (lat,lng)'),
        descripcion: z.string().optional().default('Un hermoso jardín en el corazón de la ciudad').describe('Descripción del lugar'),
        imagen: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen del lugar'),
        tipo: z.enum(['ceremonia', 'recepcion', 'ambos']).optional().default('ceremonia').describe('Tipo de evento en este lugar'),
        horario: z.string().optional().default('15:00 - 23:00').describe('Horario del evento'),
        instrucciones: z.string().optional().default('Estacionamiento disponible en el lugar').describe('Instrucciones adicionales'),
        mostrarMapa: z.boolean().optional().default(true).describe('Mostrar mapa de Google Maps')
    })).optional().default([
        {
            nombre: 'Jardín Principal',
            direccion: 'Av. de la Amistad 123, Ciudad de México',
            coordenadas: '19.4326,-99.1332',
            descripcion: 'Un hermoso jardín en el corazón de la ciudad',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            tipo: 'ceremonia',
            horario: '15:00 - 16:00',
            instrucciones: 'Estacionamiento disponible en el lugar',
            mostrarMapa: true
        },
        {
            nombre: 'Salón de Eventos Elegance',
            direccion: 'Calle de la Fiesta 456, Ciudad de México',
            coordenadas: '19.4326,-99.1332',
            descripcion: 'Un elegante salón para la recepción y cena',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            tipo: 'recepcion',
            horario: '17:00 - 23:00',
            instrucciones: 'Servicio de valet parking disponible',
            mostrarMapa: true
        }
    ]).describe('Array de lugares del evento'),
    mostrarMapa: z.boolean().optional().default(true).describe('Mostrar mapa general de Google Maps')
});

// Función de ejecución
export async function executeUbicaciones(args: z.infer<typeof ubicacionesSchema>) {
    const {
        lugares = [
            {
                nombre: 'Jardín Principal',
                direccion: 'Av. de la Amistad 123, Ciudad de México',
                coordenadas: '19.4326,-99.1332',
                descripcion: 'Un hermoso jardín en el corazón de la ciudad',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                tipo: 'ceremonia',
                horario: '15:00 - 16:00',
                instrucciones: 'Estacionamiento disponible en el lugar',
                mostrarMapa: true
            },
            {
                nombre: 'Salón de Eventos Elegance',
                direccion: 'Calle de la Fiesta 456, Ciudad de México',
                coordenadas: '19.4326,-99.1332',
                descripcion: 'Un elegante salón para la recepción y cena',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                tipo: 'recepcion',
                horario: '17:00 - 23:00',
                instrucciones: 'Servicio de valet parking disponible',
                mostrarMapa: true
            }
        ],
        mostrarMapa = true
    } = args;

    try {
        // Crear el prompt específico con los datos de las ubicaciones
        const userPrompt = `
Crea la sección de "Ubicaciones" para la boda.

DETALLES DE LAS UBICACIONES:
- Mostrar mapa general: ${mostrarMapa}
- Número de lugares: ${lugares.length}

LUGARES DEL EVENTO:
${lugares.map((lugar, index) => `
${index + 1}. ${lugar.nombre}
   - Dirección: ${lugar.direccion}
   - Coordenadas: ${lugar.coordenadas}
   - Descripción: ${lugar.descripcion}
   - Tipo: ${lugar.tipo}
   - Horario: ${lugar.horario}
   - Instrucciones: ${lugar.instrucciones}
   - Imagen: ${lugar.imagen}
`).join('\n')}

Genera el HTML para la sección de ubicaciones siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: UBICACIONES_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeUbicaciones:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        📍 Ubicaciones
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Los lugares donde celebraremos nuestro amor
                    </p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    ${lugares.map((lugar, index) => `
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <div class="relative h-48 overflow-hidden">
                                <img src="${lugar.imagen}" 
                                     alt="${lugar.nombre}" 
                                     class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                                <div class="absolute top-4 left-4">
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                        ${lugar.tipo === 'ceremonia' ? '💒' : lugar.tipo === 'recepcion' ? '🍽️' : '🎉'} ${lugar.tipo.charAt(0).toUpperCase() + lugar.tipo.slice(1)}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="p-6">
                                <h3 class="text-2xl font-semibold text-gray-800 mb-3">${lugar.nombre}</h3>
                                <p class="text-gray-600 mb-4 leading-relaxed">${lugar.descripcion}</p>
                                
                                <div class="space-y-3">
                                    <div class="flex items-start">
                                        <span class="text-gray-400 mr-3 mt-1">📍</span>
                                        <div>
                                            <div class="font-medium text-gray-800">${lugar.direccion}</div>
                                            ${lugar.mostrarMapa ? `
                                                <a href="https://maps.google.com/?q=${lugar.coordenadas}" 
                                                   target="_blank" 
                                                   class="text-blue-500 hover:text-blue-600 text-sm">
                                                    Ver en Google Maps →
                                                </a>
                                            ` : ''}
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <span class="text-gray-400 mr-3">⏰</span>
                                        <span class="text-gray-700">${lugar.horario}</span>
                                    </div>
                                    
                                    <div class="flex items-start">
                                        <span class="text-gray-400 mr-3 mt-1">ℹ️</span>
                                        <span class="text-gray-700 text-sm">${lugar.instrucciones}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const ubicacionesTool = {
    name: 'ubicaciones',
    description: 'Genera la sección de ubicaciones con mapas y direcciones',
    parameters: ubicacionesSchema,
    execute: executeUbicaciones
}; 