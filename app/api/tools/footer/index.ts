import { z } from 'zod';

// Schema para la herramienta footer
export const footerSchema = z.object({
    nombreNovio: z.string().describe('Nombre del novio').optional().default('Juan'),
    nombreNovia: z.string().describe('Nombre de la novia').optional().default('Juliana'),
    redesSociales: z.array(z.object({
        nombre: z.string().describe('Nombre de la red social'),
        url: z.string().describe('URL del perfil'),
        icono: z.string().optional().describe('Icono de la red social')
    })).optional().describe('Array de redes sociales'),
    contacto: z.object({
        telefono: z.string().optional().describe('Número de teléfono'),
        email: z.string().optional().describe('Email de contacto'),
        direccion: z.string().optional().describe('Dirección de contacto')
    }).optional().describe('Información de contacto'),
    mensaje: z.string().optional().describe('Mensaje romántico o frase especial'),
    creditos: z.string().optional().describe('Créditos o información adicional'),
    estilo: z.enum(['elegante', 'moderno', 'romantico']).optional().describe('Estilo del footer')
});

// Función de ejecución
export async function executeFooter(args: z.infer<typeof footerSchema>) {
    const {
        nombreNovio,
        nombreNovia,
        redesSociales = [],
        contacto = {},
        mensaje = 'Gracias por ser parte de nuestro día especial',
        creditos = 'Hecho con ❤️ para nuestro gran día',
        estilo = 'elegante'
    } = args;

    const estilos = {
        elegante: {
            bg: 'bg-gradient-to-br from-gray-900 to-slate-800',
            text: 'text-gray-300',
            accent: 'text-rose-400',
            border: 'border-gray-700'
        },
        moderno: {
            bg: 'bg-gradient-to-br from-slate-900 to-gray-900',
            text: 'text-gray-300',
            accent: 'text-blue-400',
            border: 'border-slate-700'
        },
        romantico: {
            bg: 'bg-gradient-to-br from-rose-900 to-pink-800',
            text: 'text-rose-100',
            accent: 'text-pink-300',
            border: 'border-rose-700'
        }
    };

    const selectedStyle = estilos[estilo];

    const iconosRedes: Record<string, string> = {
        facebook: '📘',
        instagram: '📷',
        twitter: '🐦',
        whatsapp: '📱',
        email: '📧',
        phone: '📞'
    };

    return `
    <footer class="${selectedStyle.bg} text-white">
        <div class="container mx-auto px-4 py-16">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <!-- Nombres de los novios -->
                <div class="text-center md:text-left">
                    <h3 class="text-2xl font-light mb-4 ${selectedStyle.accent}">
                        ${nombreNovio} & ${nombreNovia}
                    </h3>
                    <p class="${selectedStyle.text} leading-relaxed">
                        ${mensaje}
                    </p>
                </div>
                
                <!-- Información de contacto -->
                ${contacto.telefono || contacto.email || contacto.direccion ? `
                    <div class="text-center">
                        <h4 class="text-lg font-semibold mb-4 ${selectedStyle.accent}">Contacto</h4>
                        <div class="space-y-2 ${selectedStyle.text}">
                            ${contacto.telefono ? `
                                <div class="flex items-center justify-center gap-2">
                                    <span>📞</span>
                                    <a href="tel:${contacto.telefono}" class="hover:${selectedStyle.accent} transition-colors">
                                        ${contacto.telefono}
                                    </a>
                                </div>
                            ` : ''}
                            
                            ${contacto.email ? `
                                <div class="flex items-center justify-center gap-2">
                                    <span>📧</span>
                                    <a href="mailto:${contacto.email}" class="hover:${selectedStyle.accent} transition-colors">
                                        ${contacto.email}
                                    </a>
                                </div>
                            ` : ''}
                            
                            ${contacto.direccion ? `
                                <div class="flex items-center justify-center gap-2">
                                    <span>📍</span>
                                    <span>${contacto.direccion}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Redes sociales -->
                ${redesSociales.length > 0 ? `
                    <div class="text-center md:text-right">
                        <h4 class="text-lg font-semibold mb-4 ${selectedStyle.accent}">Síguenos</h4>
                        <div class="flex justify-center md:justify-end gap-4">
                            ${redesSociales.map(red => `
                                <a href="${red.url}" 
                                   target="_blank" 
                                   class="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-110"
                                   title="${red.nombre}">
                                    <span class="text-lg">${red.icono || iconosRedes[red.nombre.toLowerCase()] || '🔗'}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Línea divisoria -->
            <div class="border-t ${selectedStyle.border} mt-12 pt-8">
                <div class="text-center ${selectedStyle.text}">
                    <p class="text-sm">
                        ${creditos}
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Decoración de fondo -->
        <div class="absolute inset-0 opacity-5">
            <div class="absolute top-10 left-10 text-6xl">💕</div>
            <div class="absolute top-20 right-20 text-4xl">💒</div>
            <div class="absolute bottom-20 left-20 text-5xl">💝</div>
            <div class="absolute bottom-10 right-10 text-6xl">💕</div>
        </div>
    </footer>
    `;
}

// Configuración de la herramienta
export const footerTool = {
    name: 'footer',
    description: 'Genera la sección de footer con información de contacto y redes sociales',
    parameters: footerSchema,
    execute: executeFooter
}; 