import { z } from 'zod';

// Schema para la herramienta nuestra historia
export const nuestraHistoriaSchema = z.object({
    momentos: z.array(z.object({
        fecha: z.string().optional().default('2020-01-01').describe('Fecha del momento'),
        titulo: z.string().optional().default('Momentos especiales').describe('Título del momento'),
        descripcion: z.string().optional().default('Descripción del momento especial').describe('Descripción del momento'),
        imagen: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen del momento'),
        estilo: z.enum(['timeline', 'cards', 'story']).optional().default('timeline').describe('Estilo de presentación')
    })).optional().default([
        {
            fecha: '2020-01-01',
            titulo: 'Primer Encuentro',
            descripcion: 'El día que nuestros caminos se cruzaron por primera vez',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            estilo: 'timeline'
        },
        {
            fecha: '2021-06-15',
            titulo: 'Primer Viaje Juntos',
            descripcion: 'Nuestro primer viaje juntos, lleno de aventuras y risas',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            estilo: 'timeline'
        },
        {
            fecha: '2023-12-25',
            titulo: 'El Compromiso',
            descripcion: 'El momento más especial cuando decidimos unir nuestras vidas para siempre',
            imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            estilo: 'timeline'
        }
    ]).describe('Array de momentos importantes en la relación'),
    estilo: z.enum(['timeline', 'cards', 'story']).optional().default('timeline').describe('Estilo de presentación de la historia')
});

// Función de ejecución
export async function executeNuestraHistoria(args: z.infer<typeof nuestraHistoriaSchema>) {
    const {
        momentos = [
            {
                fecha: '2020-01-01',
                titulo: 'Primer Encuentro',
                descripcion: 'El día que nuestros caminos se cruzaron por primera vez',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                estilo: 'timeline'
            },
            {
                fecha: '2021-06-15',
                titulo: 'Primer Viaje Juntos',
                descripcion: 'Nuestro primer viaje juntos, lleno de aventuras y risas',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                estilo: 'timeline'
            },
            {
                fecha: '2023-12-25',
                titulo: 'El Compromiso',
                descripcion: 'El momento más especial cuando decidimos unir nuestras vidas para siempre',
                imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                estilo: 'timeline'
            }
        ],
        estilo = 'timeline'
    } = args;

    if (estilo === 'timeline') {
        return `
        <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        💌 Nuestra Historia
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Cada momento ha sido un paso hacia nuestro amor eterno
                    </p>
                </div>
                
                <div class="max-w-4xl mx-auto">
                    <div class="relative">
                        <!-- Línea de tiempo -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full"></div>
                        
                        ${momentos.map((momento, index) => `
                            <div class="relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}">
                                <!-- Punto en la línea de tiempo -->
                                <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                                
                                <!-- Contenido -->
                                <div class="w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}">
                                    <div class="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                                        <div class="text-rose-500 font-semibold mb-2">${momento.fecha}</div>
                                        <h3 class="text-xl font-semibold mb-3 text-gray-800">${momento.titulo}</h3>
                                        <p class="text-gray-600 leading-relaxed">${momento.descripcion}</p>
                                    </div>
                                </div>
                                
                                <!-- Imagen -->
                                <div class="w-5/12 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}">
                                    <div class="relative overflow-hidden rounded-lg shadow-lg">
                                        <img src="${momento.imagen}" 
                                             alt="${momento.titulo}" 
                                             class="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500">
                                        <div class="absolute inset-0 bg-black opacity-5"></div>
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

    // Estilo cards por defecto
    return `
    <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                    💌 Nuestra Historia
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Cada momento ha sido un paso hacia nuestro amor eterno
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                ${momentos.map((momento, index) => `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <div class="relative h-48 overflow-hidden">
                            <img src="${momento.imagen}" 
                                 alt="${momento.titulo}" 
                                 class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                            <div class="absolute bottom-4 left-4 text-white">
                                <div class="text-sm opacity-90">${momento.fecha}</div>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-semibold mb-3 text-gray-800">${momento.titulo}</h3>
                            <p class="text-gray-600 leading-relaxed">${momento.descripcion}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
}

// Configuración de la herramienta
export const nuestraHistoriaTool = {
    name: 'nuestra_historia',
    description: 'Genera la sección de nuestra historia con momentos importantes de la relación',
    parameters: nuestraHistoriaSchema,
    execute: executeNuestraHistoria
}; 