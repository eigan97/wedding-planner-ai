import { z } from 'zod';

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

    const iconosPorDefecto = ['💒', '🥂', '🍽️', '💃', '🎂', '🎉', '💝', '🌙'];

    if (estilo === 'timeline') {
        return `
        <section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl md:text-5xl font-light text-center mb-16 text-gray-800">
                    ⏰ Itinerario del Evento
                </h2>
                
                <div class="max-w-4xl mx-auto">
                    <div class="relative">
                        <!-- Línea vertical -->
                        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 to-pink-300"></div>
                        
                        ${eventos.map((evento, index) => `
                            <div class="relative flex items-center mb-8">
                                <!-- Icono y círculo -->
                                <div class="absolute left-0 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-rose-200 flex items-center justify-center z-10">
                                    <span class="text-2xl">${evento.icono || iconosPorDefecto[index % iconosPorDefecto.length]}</span>
                                </div>
                                
                                <!-- Contenido -->
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

    if (estilo === 'cards') {
        return `
        <section class="py-20 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl md:text-5xl font-light text-center mb-16 text-gray-800">
                    ⏰ Itinerario del Evento
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    ${eventos.map((evento, index) => `
                        <div class="bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl p-6 shadow-lg border border-rose-100 transform hover:scale-105 transition-transform duration-300">
                            <div class="text-center mb-4">
                                <div class="text-4xl mb-2">${evento.icono || iconosPorDefecto[index % iconosPorDefecto.length]}</div>
                                <div class="text-2xl font-bold text-rose-500">${evento.hora}</div>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-800 text-center mb-3">${evento.titulo}</h3>
                            <p class="text-gray-600 text-center leading-relaxed">${evento.descripcion}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        `;
    }

    // Estilo list por defecto
    return `
    <section class="py-20 bg-gradient-to-br from-rose-50 to-pink-100">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl md:text-5xl font-light text-center mb-16 text-gray-800">
                ⏰ Itinerario del Evento
            </h2>
            
            <div class="max-w-3xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    ${eventos.map((evento, index) => `
                        <div class="flex items-center p-6 ${index !== eventos.length - 1 ? 'border-b border-gray-100' : ''}">
                            <div class="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                                <span class="text-xl">${evento.icono || iconosPorDefecto[index % iconosPorDefecto.length]}</span>
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-1">
                                    <h3 class="text-lg font-semibold text-gray-800">${evento.titulo}</h3>
                                    <span class="text-sm font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">${evento.hora}</span>
                                </div>
                                <p class="text-gray-600">${evento.descripcion}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>
    `;
}

// Configuración de la herramienta
export const itinerarioTool = {
    name: 'itinerario',
    description: 'Genera el itinerario del evento con horarios y actividades',
    parameters: itinerarioSchema,
    execute: executeItinerario
}; 