import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { GALERIA_PROMPT } from './prompt';

// Schema para la herramienta galería
export const galeriaSchema = z.object({
    fotos: z.array(z.object({
        url: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen'),
        titulo: z.string().optional().default('Momentos especiales').describe('Título de la foto'),
        descripcion: z.string().optional().default('Descripción de la foto').describe('Descripción de la foto'),
        categoria: z.string().optional().default('💕 Pareja').describe('Categoría de la foto'),
        alt: z.string().optional().default('Foto de la boda').describe('Texto alternativo para accesibilidad')
    })).optional().default([
        {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            titulo: 'Nuestro Primer Encuentro',
            descripcion: 'El día que todo comenzó',
            categoria: '💕 Pareja',
            alt: 'Foto de la pareja'
        },
        {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            titulo: 'El Compromiso',
            descripcion: 'El momento más especial',
            categoria: '💒 Ceremonia',
            alt: 'Foto del compromiso'
        },
        {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            titulo: 'Celebración',
            descripcion: 'Momentos de alegría',
            categoria: '🎉 Celebración',
            alt: 'Foto de celebración'
        }
    ]).describe('Array de fotos para la galería'),
    estilo: z.string().optional().default('minimalista').describe('Estilo de presentación de la galería (puede ser: minimalista, masonry, grid, carousel, gallery, o cualquier estilo personalizado)'),
    mostrarCategorias: z.boolean().optional().default(true).describe('Mostrar filtros por categorías')
});

// Función de ejecución
export async function executeGaleria(args: z.infer<typeof galeriaSchema>) {
    const {
        fotos = [
            {
                url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                titulo: 'Nuestro Primer Encuentro',
                descripcion: 'El día que todo comenzó',
                categoria: '💕 Pareja',
                alt: 'Foto de la pareja'
            },
            {
                url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                titulo: 'El Compromiso',
                descripcion: 'El momento más especial',
                categoria: '💒 Ceremonia',
                alt: 'Foto del compromiso'
            },
            {
                url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                titulo: 'Celebración',
                descripcion: 'Momentos de alegría',
                categoria: '🎉 Celebración',
                alt: 'Foto de celebración'
            }
        ],
        estilo = 'minimalista',
        mostrarCategorias = true
    } = args;

    try {
        // Crear el prompt específico con los datos de la galería
        const userPrompt = `
Crea la sección de "Galería de Fotos" para la boda.

DETALLES DE LA GALERÍA:
- Estilo de presentación: ${estilo}
- Mostrar categorías: ${mostrarCategorias}
- Número de fotos: ${fotos.length}

FOTOS DE LA GALERÍA:
${fotos.map((foto, index) => `
${index + 1}. ${foto.titulo}
   - Descripción: ${foto.descripcion}
   - Categoría: ${foto.categoria}
   - URL: ${foto.url}
   - Alt: ${foto.alt}
`).join('\n')}

Genera el HTML para la sección de galería siguiendo las especificaciones del prompt.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: GALERIA_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        return result.text;

    } catch (error) {
        console.error('Error en executeGaleria:', error);
        // HTML de fallback en caso de error
        return `
        <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        📸 Galería de Fotos
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Momentos especiales que hemos compartido juntos
                    </p>
                </div>
                
                ${mostrarCategorias ? `
                    <div class="flex justify-center mb-8">
                        <div class="flex flex-wrap gap-2">
                            <button class="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                                Todas
                            </button>
                            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                                💕 Pareja
                            </button>
                            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                                💒 Ceremonia
                            </button>
                            <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                                🎉 Celebración
                            </button>
                        </div>
                    </div>
                ` : ''}
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    ${fotos.map((foto, index) => `
                        <div class="group relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer" 
                             onclick="openLightbox(${index})">
                            <img src="${foto.url}" 
                                 alt="${foto.alt}" 
                                 class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
                            
                            <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                            
                            <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 class="text-lg font-semibold mb-1">${foto.titulo}</h3>
                                <p class="text-sm opacity-90">${foto.descripcion}</p>
                                <span class="inline-block mt-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">
                                    ${foto.categoria}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Lightbox -->
            <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 hidden z-50 flex items-center justify-center">
                <div class="relative max-w-4xl max-h-full p-4">
                    <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
                        ✕
                    </button>
                    <img id="lightbox-img" src="" alt="" class="max-w-full max-h-full object-contain">
                    <div class="absolute bottom-4 left-4 text-white">
                        <h3 id="lightbox-title" class="text-xl font-semibold"></h3>
                        <p id="lightbox-desc" class="text-sm opacity-90"></p>
                    </div>
                </div>
            </div>
            
            <script>
                const fotos = ${JSON.stringify(fotos)};
                
                function openLightbox(index) {
                    const lightbox = document.getElementById('lightbox');
                    const img = document.getElementById('lightbox-img');
                    const title = document.getElementById('lightbox-title');
                    const desc = document.getElementById('lightbox-desc');
                    
                    img.src = fotos[index].url;
                    img.alt = fotos[index].alt;
                    title.textContent = fotos[index].titulo;
                    desc.textContent = fotos[index].descripcion;
                    
                    lightbox.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
                
                function closeLightbox() {
                    document.getElementById('lightbox').classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
                
                // Cerrar con ESC
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                    }
                });
                
                // Cerrar con click fuera de la imagen
                document.getElementById('lightbox').addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeLightbox();
                    }
                });
            </script>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const galeriaTool = {
    name: 'galeria',
    description: 'Genera la sección de galería de fotos con lightbox interactivo',
    parameters: galeriaSchema,
    execute: executeGaleria
}; 