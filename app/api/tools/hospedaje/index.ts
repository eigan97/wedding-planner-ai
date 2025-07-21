import { z } from 'zod';

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
        estilo: z.enum(['cards', 'list', 'grid']).optional().default('cards').describe('Estilo de presentación')
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
            nombre: 'Hotel Boutique La Rosa',
            direccion: 'Av. de las Flores 321, Ciudad de México',
            distancia: '3 km',
            precio: '$150 - $200 por noche',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            descripcion: 'Un encantador hotel boutique con un ambiente romántico',
            enlaceReserva: 'https://hotelboutiquelarosa.com/reservas',
            telefono: '555-9876-543',
            caracteristicas: ['WiFi gratuito', 'Estacionamiento', 'Spa'],
            estilo: 'cards'
        }
    ]).describe('Array de hoteles recomendados'),
    titulo: z.string().optional().default('🏨 Hospedaje Recomendado').describe('Título de la sección'),
    subtitulo: z.string().optional().default('Aquí tienes algunas opciones de hospedaje cercanas al evento').describe('Subtítulo de la sección'),
    estilo: z.enum(['cards', 'list', 'grid']).optional().default('cards').describe('Estilo de presentación general')
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
                estilo: 'cards'
            },
            {
                nombre: 'Hotel Boutique La Rosa',
                direccion: 'Av. de las Flores 321, Ciudad de México',
                distancia: '3 km',
                precio: '$150 - $200 por noche',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                descripcion: 'Un encantador hotel boutique con un ambiente romántico',
                enlaceReserva: 'https://hotelboutiquelarosa.com/reservas',
                telefono: '555-9876-543',
                caracteristicas: ['WiFi gratuito', 'Estacionamiento', 'Spa'],
                estilo: 'cards'
            }
        ],
        titulo = '🏨 Hospedaje Recomendado',
        subtitulo = 'Aquí tienes algunas opciones de hospedaje cercanas al evento',
        estilo = 'cards'
    } = args;

    if (estilo === 'cards') {
        return `
        <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        ${titulo}
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        ${subtitulo}
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    ${hoteles.map((hotel, index) => `
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <div class="relative h-48 overflow-hidden">
                                <img src="${hotel.imagen}" 
                                     alt="${hotel.nombre}" 
                                     class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                                <div class="absolute top-4 right-4">
                                    <span class="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        📍 ${hotel.distancia}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="p-6">
                                <h3 class="text-xl font-semibold text-gray-800 mb-2">${hotel.nombre}</h3>
                                <p class="text-gray-600 mb-4 leading-relaxed">${hotel.descripcion}</p>
                                
                                <div class="space-y-3 mb-6">
                                    <div class="flex items-center">
                                        <span class="text-gray-400 mr-3">📍</span>
                                        <span class="text-gray-700 text-sm">${hotel.direccion}</span>
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
                                
                                ${hotel.caracteristicas && hotel.caracteristicas.length > 0 ? `
                                    <div class="mb-6">
                                        <h4 class="text-sm font-medium text-gray-700 mb-2">✨ Características:</h4>
                                        <div class="flex flex-wrap gap-2">
                                            ${hotel.caracteristicas.map(caracteristica => `
                                                <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                                    ${caracteristica}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <div class="flex gap-3">
                                    <a href="${hotel.enlaceReserva}" 
                                       target="_blank" 
                                       class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors">
                                        🏨 Reservar
                                    </a>
                                    <a href="tel:${hotel.telefono}" 
                                       class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                                        📞 Llamar
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        `;
    }

    // Estilo list por defecto
    return `
    <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                    ${titulo}
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    ${subtitulo}
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    ${hoteles.map((hotel, index) => `
                        <div class="flex flex-col md:flex-row items-start p-6 ${index !== hoteles.length - 1 ? 'border-b border-gray-100' : ''}">
                            <div class="w-full md:w-48 h-32 md:h-24 overflow-hidden rounded-lg mb-4 md:mb-0 md:mr-6">
                                <img src="${hotel.imagen}" 
                                     alt="${hotel.nombre}" 
                                     class="w-full h-full object-cover">
                            </div>
                            
                            <div class="flex-1">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 class="text-xl font-semibold text-gray-800 mb-1">${hotel.nombre}</h3>
                                        <p class="text-gray-600 text-sm mb-2">${hotel.descripcion}</p>
                                    </div>
                                    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        📍 ${hotel.distancia}
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                                    <div>
                                        <span class="text-gray-500">📍 Dirección:</span>
                                        <div class="text-gray-700">${hotel.direccion}</div>
                                    </div>
                                    <div>
                                        <span class="text-gray-500">💰 Precio:</span>
                                        <div class="text-gray-700 font-medium">${hotel.precio}</div>
                                    </div>
                                    <div>
                                        <span class="text-gray-500">📞 Teléfono:</span>
                                        <div class="text-gray-700">${hotel.telefono}</div>
                                    </div>
                                </div>
                                
                                ${hotel.caracteristicas && hotel.caracteristicas.length > 0 ? `
                                    <div class="mb-4">
                                        <span class="text-gray-500 text-sm">✨ Características:</span>
                                        <div class="flex flex-wrap gap-2 mt-1">
                                            ${hotel.caracteristicas.map(caracteristica => `
                                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                    ${caracteristica}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <div class="flex gap-3">
                                    <a href="${hotel.enlaceReserva}" 
                                       target="_blank" 
                                       class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                        🏨 Reservar
                                    </a>
                                    <a href="tel:${hotel.telefono}" 
                                       class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                                        📞 Llamar
                                    </a>
                                </div>
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
export const hospedajeTool = {
    name: 'hospedaje',
    description: 'Genera la sección de hoteles recomendados para el evento',
    parameters: hospedajeSchema,
    execute: executeHospedaje
}; 