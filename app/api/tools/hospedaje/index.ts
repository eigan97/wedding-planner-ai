import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { HOSPEDAJE_PROMPT } from './prompt';

// Schema para la herramienta hospedaje
export const hospedajeSchema = z.object({
    hoteles: z.array(z.object({
        nombre: z.string().optional().default('Hotel Central').describe('Nombre del hotel'),
        direccion: z.string().optional().default('Calle Principal 789, Ciudad de México').describe('Dirección del hotel'),
        distancia: z.string().optional().default('5 km').describe('Distancia al evento'),
        precio: z.string().optional().default('$100 - $150 por noche').describe('Rango de precios'),
        imagen: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen del hotel'),
        descripcion: z.string().optional().default('Un hotel cómodo y céntrico con todas las comodidades').describe('Descripción del hotel'),
        enlaceReserva: z.string().optional().default('https://hotelcentral.com/reservas').describe('Enlace para hacer reserva'),
        telefono: z.string().optional().default('555-1234-567').describe('Teléfono del hotel'),
        caracteristicas: z.array(z.string()).optional().default(['WiFi gratuito', 'Desayuno incluido', 'Piscina']).describe('Características del hotel'),
        estilo: z.string().optional().default('minimalista').describe('Estilo de presentación (puede ser: minimalista, cards, list, grid, o cualquier estilo personalizado)')
    })).optional().default([
        {
            nombre: 'Hotel Central',
            direccion: 'Calle Principal 789, Ciudad de México',
            distancia: '5 km',
            precio: '$100 - $150 por noche',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            descripcion: 'Un hotel cómodo y céntrico con todas las comodidades',
            enlaceReserva: 'https://hotelcentral.com/reservas',
            telefono: '555-1234-567',
            caracteristicas: ['WiFi gratuito', 'Desayuno incluido', 'Piscina'],
            estilo: 'cards'
        },
        {
            nombre: 'Hotel Elegance',
            direccion: 'Av. de la Fiesta 456, Ciudad de México',
            distancia: '3 km',
            precio: '$150 - $200 por noche',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            descripcion: 'Un hotel de lujo con servicio de primera clase',
            enlaceReserva: 'https://hotelelegance.com/reservas',
            telefono: '555-9876-543',
            caracteristicas: ['WiFi gratuito', 'Desayuno incluido', 'Piscina', 'Spa', 'Restaurante'],
            estilo: 'cards'
        }
    ]).describe('Array de hoteles recomendados'),
    estilo: z.string().optional().default('minimalista').describe('Estilo de presentación de los hoteles (puede ser: minimalista, cards, list, grid, o cualquier estilo personalizado)')
});

// Función de ejecución
export async function executeHospedaje(args: z.infer<typeof hospedajeSchema>) {
    const {
        hoteles = [
            {
                nombre: 'Hotel Central',
                direccion: 'Calle Principal 789, Ciudad de México',
                distancia: '5 km',
                precio: '$100 - $150 por noche',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                descripcion: 'Un hotel cómodo y céntrico con todas las comodidades',
                enlaceReserva: 'https://hotelcentral.com/reservas',
                telefono: '555-1234-567',
                caracteristicas: ['WiFi gratuito', 'Desayuno incluido', 'Piscina'],
                estilo: 'minimalista'
            },
            {
                nombre: 'Hotel Elegance',
                direccion: 'Av. de la Fiesta 456, Ciudad de México',
                distancia: '3 km',
                precio: '$150 - $200 por noche',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                descripcion: 'Un hotel de lujo con servicio de primera clase',
                enlaceReserva: 'https://hotelelegance.com/reservas',
                telefono: '555-9876-543',
                caracteristicas: ['WiFi gratuito', 'Desayuno incluido', 'Piscina', 'Spa', 'Restaurante'],
                estilo: 'minimalista'
            }
        ],
        estilo = 'minimalista'
    } = args;

    try {
        // Crear el prompt específico con los datos de hospedaje
        const userPrompt = `
Crea la sección de "Opciones de Hospedaje" para la boda.

DETALLES DEL HOSPEDAJE:
- Estilo de presentación: ${estilo}
- Número de hoteles: ${hoteles.length}

HOTELES RECOMENDADOS:
${hoteles.map((hotel, index) => `
${index + 1}. ${hotel.nombre}
   - Dirección: ${hotel.direccion}
   - Distancia: ${hotel.distancia}
   - Precio: ${hotel.precio}
   - Descripción: ${hotel.descripcion}
   - Teléfono: ${hotel.telefono}
   - Enlace de reserva: ${hotel.enlaceReserva}
   - Características: ${hotel.caracteristicas.join(', ')}
   - Imagen: ${hotel.imagen}
`).join('\n')}

Genera el HTML para la sección de hospedaje siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: HOSPEDAJE_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeHospedaje:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        🏨 Opciones de Hospedaje
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Hoteles recomendados cerca del evento para tu comodidad
                    </p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    ${hoteles.map((hotel, index) => `
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <div class="relative h-48 overflow-hidden">
                                <img src="${hotel.imagen}" 
                                     alt="${hotel.nombre}" 
                                     class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                                <div class="absolute top-4 right-4">
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                        ${hotel.distancia}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="p-6">
                                <h3 class="text-2xl font-semibold text-gray-800 mb-2">${hotel.nombre}</h3>
                                <p class="text-gray-600 mb-4 leading-relaxed">${hotel.descripcion}</p>
                                
                                <div class="space-y-3 mb-6">
                                    <div class="flex items-center">
                                        <span class="text-gray-400 mr-3">📍</span>
                                        <span class="text-gray-700">${hotel.direccion}</span>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <span class="text-gray-400 mr-3">💰</span>
                                        <span class="text-gray-700 font-medium">${hotel.precio}</span>
                                    </div>
                                    
                                    <div class="flex items-center">
                                        <span class="text-gray-400 mr-3">📞</span>
                                        <span class="text-gray-700">${hotel.telefono}</span>
                                    </div>
                                </div>
                                
                                <div class="mb-6">
                                    <h4 class="text-sm font-medium text-gray-700 mb-2">Características:</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${hotel.caracteristicas.map(caracteristica => `
                                            <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                ${caracteristica}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <a href="${hotel.enlaceReserva}" 
                                   target="_blank" 
                                   class="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                                    🏨 Reservar Ahora
                                </a>
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
export const hospedajeTool = {
    name: 'hospedaje',
    description: 'Genera la sección de opciones de hospedaje con hoteles recomendados',
    parameters: hospedajeSchema,
    execute: executeHospedaje
}; 