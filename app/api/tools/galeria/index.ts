import { z } from 'zod';

// Schema para la herramienta galeria
export const galeriaSchema = z.object({
    titulo: z.string().optional().default('📸 Galería de Fotos').describe('Título de la sección'),
    subtitulo: z.string().optional().default('Momentos especiales de nuestra historia juntos').describe('Subtítulo o descripción'),
    fotos: z.array(z.object({
        url: z.string().optional().default('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80').describe('URL de la imagen'),
        alt: z.string().optional().default('Foto de la galería').describe('Texto alternativo de la imagen'),
        titulo: z.string().optional().default('Momentos especiales').describe('Título de la foto'),
        descripcion: z.string().optional().default('Descripción de la foto').describe('Descripción de la foto')
    })).optional().default([
        {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            alt: 'Primer encuentro',
            titulo: 'Primer Encuentro',
            descripcion: 'El día que todo comenzó'
        },
        {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            alt: 'Viaje juntos',
            titulo: 'Viaje Juntos',
            descripcion: 'Nuestro primer viaje como pareja'
        },
        {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            alt: 'Compromiso',
            titulo: 'El Compromiso',
            descripcion: 'El momento más especial'
        }
    ]).describe('Array de fotos para la galería'),
    estilo: z.enum(['grid', 'masonry', 'carousel']).optional().default('grid').describe('Estilo de presentación de la galería'),
    columnas: z.number().optional().default(3).describe('Número de columnas para el grid (2-4)')
});

// Función de ejecución
export async function executeGaleria(args: z.infer<typeof galeriaSchema>) {
    try {
        const {
            titulo = '📸 Galería de Fotos',
            subtitulo = 'Momentos especiales de nuestra historia juntos',
            fotos = [
                {
                    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    alt: 'Primer encuentro',
                    titulo: 'Primer Encuentro',
                    descripcion: 'El día que todo comenzó'
                },
                {
                    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    alt: 'Viaje juntos',
                    titulo: 'Viaje Juntos',
                    descripcion: 'Nuestro primer viaje como pareja'
                },
                {
                    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    alt: 'Compromiso',
                    titulo: 'El Compromiso',
                    descripcion: 'El momento más especial'
                }
            ],
            estilo = 'grid',
            columnas = 3
        } = args;

        // Validar que fotos sea un array válido
        if (!Array.isArray(fotos) || fotos.length === 0) {
            return `
            <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
                <div class="container mx-auto px-4">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                            ${titulo}
                        </h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                            ${subtitulo}
                        </p>
                    </div>
                    <div class="text-center text-gray-500">
                        <p>📸 Galería de fotos disponible próximamente</p>
                    </div>
                </div>
            </section>
            `;
        }

        if (estilo === 'grid') {
            const gridCols = columnas === 2 ? 'md:grid-cols-2' :
                columnas === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                    'md:grid-cols-2 lg:grid-cols-3';

            return `
            <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
                <div class="container mx-auto px-4">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                            ${titulo}
                        </h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                            ${subtitulo}
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 ${gridCols} gap-6 max-w-7xl mx-auto">
                        ${fotos.map((foto, index) => `
                            <div class="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300">
                                <img src="${foto.url}" 
                                     alt="${foto.alt || foto.titulo || 'Foto de la galería'}" 
                                     class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                     onclick="openLightbox(${index})">
                                
                                <!-- Overlay con información -->
                                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300 flex items-end">
                                    <div class="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black opacity-50 rounded-t-lg">
                                        ${foto.titulo ? `<h3 class="text-lg font-semibold mb-1">${foto.titulo}</h3>` : ''}
                                        ${foto.descripcion ? `<p class="text-sm">${foto.descripcion}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Lightbox -->
                <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 hidden z-50 flex items-center justify-center">
                    <div class="relative max-w-4xl max-h-full p-4">
                        <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10">
                            ✕
                        </button>
                        <img id="lightbox-img" src="" alt="" class="max-w-full max-h-full object-contain">
                        <div id="lightbox-info" class="text-white text-center mt-4"></div>
                    </div>
                </div>
                
                <script>
                    function openLightbox(index) {
                        const foto = ${JSON.stringify(fotos)}[index];
                        document.getElementById('lightbox-img').src = foto.url;
                        document.getElementById('lightbox-img').alt = foto.alt || foto.titulo || 'Foto de la galería';
                        
                        let info = '';
                        if (foto.titulo) info += '<h3 class="text-xl font-semibold mb-2">' + foto.titulo + '</h3>';
                        if (foto.descripcion) info += '<p class="text-gray-300">' + foto.descripcion + '</p>';
                        document.getElementById('lightbox-info').innerHTML = info;
                        
                        document.getElementById('lightbox').classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                    
                    function closeLightbox() {
                        document.getElementById('lightbox').classList.add('hidden');
                        document.body.style.overflow = 'auto';
                    }
                    
                    // Cerrar lightbox con ESC
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape') {
                            closeLightbox();
                        }
                    });
                    
                    // Cerrar lightbox al hacer clic fuera de la imagen
                    document.getElementById('lightbox').addEventListener('click', function(e) {
                        if (e.target === this) {
                            closeLightbox();
                        }
                    });
                </script>
            </section>
            `;
        }

        if (estilo === 'masonry') {
            return `
            <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
                <div class="container mx-auto px-4">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                            ${titulo}
                        </h2>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                            ${subtitulo}
                        </p>
                    </div>
                    
                    <div class="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
                        ${fotos.map((foto, index) => `
                            <div class="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer mb-6 break-inside-avoid transform hover:scale-105 transition-transform duration-300">
                                <img src="${foto.url}" 
                                     alt="${foto.alt || foto.titulo || 'Foto de la galería'}" 
                                     class="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                     onclick="openLightbox(${index})">
                                
                                <!-- Overlay con información -->
                                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300 flex items-end">
                                    <div class="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        ${foto.titulo ? `<h3 class="text-lg font-semibold mb-1">${foto.titulo}</h3>` : ''}
                                        ${foto.descripcion ? `<p class="text-sm">${foto.descripcion}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Lightbox -->
                <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 hidden z-50 flex items-center justify-center">
                    <div class="relative max-w-4xl max-h-full p-4">
                        <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10">
                            ✕
                        </button>
                        <img id="lightbox-img" src="" alt="" class="max-w-full max-h-full object-contain">
                        <div id="lightbox-info" class="text-white text-center mt-4"></div>
                    </div>
                </div>
                
                <script>
                    function openLightbox(index) {
                        const foto = ${JSON.stringify(fotos)}[index];
                        document.getElementById('lightbox-img').src = foto.url;
                        document.getElementById('lightbox-img').alt = foto.alt || foto.titulo || 'Foto de la galería';
                        
                        let info = '';
                        if (foto.titulo) info += '<h3 class="text-xl font-semibold mb-2">' + foto.titulo + '</h3>';
                        if (foto.descripcion) info += '<p class="text-gray-300">' + foto.descripcion + '</p>';
                        document.getElementById('lightbox-info').innerHTML = info;
                        
                        document.getElementById('lightbox').classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }
                    
                    function closeLightbox() {
                        document.getElementById('lightbox').classList.add('hidden');
                        document.body.style.overflow = 'auto';
                    }
                    
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape') {
                            closeLightbox();
                        }
                    });
                    
                    document.getElementById('lightbox').addEventListener('click', function(e) {
                        if (e.target === this) {
                            closeLightbox();
                        }
                    });
                </script>
            </section>
            `;
        }

        // Estilo carousel por defecto
        return `
        <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        ${titulo}
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        ${subtitulo}
                    </p>
                </div>
                
                <div class="max-w-6xl mx-auto">
                    <div class="relative">
                        <div id="carousel" class="flex overflow-hidden rounded-xl shadow-2xl">
                            ${fotos.map((foto, index) => `
                                <div class="carousel-slide w-full flex-shrink-0 ${index === 0 ? 'block' : 'hidden'}">
                                    <div class="relative">
                                        <img src="${foto.url}" 
                                             alt="${foto.alt || foto.titulo || 'Foto de la galería'}" 
                                             class="w-full h-96 md:h-[500px] object-cover">
                                        
                                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                                            ${foto.titulo ? `<h3 class="text-2xl font-semibold mb-2">${foto.titulo}</h3>` : ''}
                                            ${foto.descripcion ? `<p class="text-lg">${foto.descripcion}</p>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Controles del carousel -->
                        <button onclick="prevSlide()" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black opacity-20 text-white p-3 rounded-full hover:opacity-40 transition-colors">
                            ‹
                        </button>
                        <button onclick="nextSlide()" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black opacity-20 text-white p-3 rounded-full hover:opacity-40 transition-colors">
                            ›
                        </button>
                        
                        <!-- Indicadores -->
                        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            ${fotos.map((_, index) => `
                                <button onclick="goToSlide(${index})" class="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-75 transition-colors indicator ${index === 0 ? 'opacity-100' : ''}"></button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                let currentSlide = 0;
                const slides = document.querySelectorAll('.carousel-slide');
                const indicators = document.querySelectorAll('.indicator');
                
                function showSlide(index) {
                    slides.forEach(slide => slide.classList.add('hidden'));
                    indicators.forEach(indicator => indicator.classList.remove('opacity-100'));
                    
                    slides[index].classList.remove('hidden');
                    indicators[index].classList.add('opacity-100');
                    currentSlide = index;
                }
                
                function nextSlide() {
                    const next = (currentSlide + 1) % slides.length;
                    showSlide(next);
                }
                
                function prevSlide() {
                    const prev = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(prev);
                }
                
                function goToSlide(index) {
                    showSlide(index);
                }
                
                // Auto-play
                setInterval(nextSlide, 5000);
            </script>
        </section>
        `;
    } catch (error) {
        console.error('Error en executeGaleria:', error);
        return `
        <section class="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
            <div class="container mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        📸 Galería de Fotos
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        Momentos especiales de nuestra historia juntos
                    </p>
                </div>
                <div class="text-center text-gray-500">
                    <p>📸 Galería de fotos disponible próximamente</p>
                </div>
            </div>
        </section>
        `;
    }
}

// Configuración de la herramienta
export const galeriaTool = {
    name: 'galeria',
    description: 'Genera la sección de galería de fotos con diferentes estilos de presentación',
    parameters: galeriaSchema,
    execute: executeGaleria
}; 