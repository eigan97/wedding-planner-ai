import { z } from 'zod';

// Schema para la herramienta portada
export const portadaSchema = z.object({
    nombreNovio: z.string().optional().default('Juan').describe('Nombre del novio'),
    nombreNovia: z.string().optional().default('María').describe('Nombre de la novia'),
    fechaBoda: z.string().optional().default('15 de diciembre de 2024').describe('Fecha de la boda'),
    fraseEspecial: z.string().optional().default('Un amor eterno comienza aquí').describe('Frase especial para la portada'),
    estilo: z.enum(['romantico', 'elegante', 'rustico', 'moderno']).optional().default('romantico').describe('Estilo visual de la portada')
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

    const estilos = {
        romantico: {
            colors: 'bg-gradient-to-br from-rose-50 to-pink-100',
            font: 'font-serif',
            accent: 'text-rose-600'
        },
        elegante: {
            colors: 'bg-gradient-to-br from-slate-50 to-gray-100',
            font: 'font-sans',
            accent: 'text-slate-600'
        },
        rustico: {
            colors: 'bg-gradient-to-br from-amber-50 to-orange-100',
            font: 'font-serif',
            accent: 'text-amber-700'
        },
        moderno: {
            colors: 'bg-gradient-to-br from-blue-50 to-indigo-100',
            font: 'font-sans',
            accent: 'text-blue-600'
        }
    };

    const selectedStyle = estilos[estilo];

    return `
    <section class="min-h-screen relative flex items-center justify-center ${selectedStyle.colors} overflow-hidden">
        <!-- Imagen de fondo -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
             style="background-image: url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');">
        </div>
        
        <!-- Overlay oscuro -->
        <div class="absolute inset-0 bg-black opacity-40"></div>
        
        <!-- Contenido principal -->
        <div class="relative z-10 text-center text-white px-4">
            <h1 class="text-6xl md:text-8xl font-light mb-4 ${selectedStyle.font}">
                ${nombreNovio}
            </h1>
            <div class="text-4xl md:text-6xl font-light mb-4 ${selectedStyle.font}">
                <span class="text-3xl md:text-5xl">&</span>
            </div>
            <h1 class="text-6xl md:text-8xl font-light mb-8 ${selectedStyle.font}">
                ${nombreNovia}
            </h1>
            
            <div class="text-xl md:text-2xl font-light mb-4">
                ${fechaBoda}
            </div>
            
            ${fraseEspecial ? `<p class="text-lg md:text-xl font-light italic">${fraseEspecial}</p>` : ''}
        </div>
        
        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
    </section>
    `;
}

// Configuración de la herramienta
export const portadaTool = {
    name: 'portada',
    description: 'Genera la sección de portada del sitio web de boda con nombres de los novios, fecha y diseño elegante',
    parameters: portadaSchema,
    execute: executePortada
}; 