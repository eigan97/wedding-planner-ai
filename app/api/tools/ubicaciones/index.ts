import { z } from 'zod';

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

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'ceremonia': return '💒';
            case 'recepcion': return '🍽️';
            case 'ambos': return '🎉';
            default: return '📍';
        }
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'ceremonia': return 'bg-blue-100 text-blue-700';
            case 'recepcion': return 'bg-green-100 text-green-700';
            case 'ambos': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

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
                                <span class="px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(lugar.tipo)}">
                                    ${getTipoIcon(lugar.tipo)} ${lugar.tipo.charAt(0).toUpperCase() + lugar.tipo.slice(1)}
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
            
            ${mostrarMapa ? `
                <div class="mt-12 max-w-4xl mx-auto">
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="p-6 border-b border-gray-100">
                            <h3 class="text-xl font-semibold text-gray-800">🗺️ Mapa General</h3>
                            <p class="text-gray-600">Ubicación de todos los lugares del evento</p>
                        </div>
                        <div class="h-96">
                            <iframe 
                                src="https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${lugares[0]?.coordenadas || '19.4326,-99.1332'}&zoom=13" 
                                width="100%" 
                                height="100%" 
                                style="border:0;" 
                                allowfullscreen="" 
                                loading="lazy" 
                                referrerpolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    </section>
    `;
}

// Configuración de la herramienta
export const ubicacionesTool = {
    name: 'ubicaciones',
    description: 'Genera la sección de ubicaciones con mapas y direcciones',
    parameters: ubicacionesSchema,
    execute: executeUbicaciones
}; 