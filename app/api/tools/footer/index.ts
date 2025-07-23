import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { FOOTER_PROMPT } from './prompt';

// Schema para la herramienta footer
export const footerSchema = z.object({
    nombreNovio: z.string().optional().default('Juan').describe('Nombre del novio'),
    nombreNovia: z.string().optional().default('María').describe('Nombre de la novia'),
    fechaBoda: z.string().optional().default('15 de diciembre de 2024').describe('Fecha de la boda'),
    redesSociales: z.array(z.object({
        nombre: z.string().optional().default('Instagram').describe('Nombre de la red social'),
        url: z.string().optional().default('https://instagram.com').describe('URL de la red social'),
        icono: z.string().optional().default('📷').describe('Icono de la red social')
    })).optional().default([
        { nombre: 'Instagram', url: 'https://instagram.com', icono: '📷' },
        { nombre: 'Facebook', url: 'https://facebook.com', icono: '📘' },
        { nombre: 'WhatsApp', url: 'https://wa.me/1234567890', icono: '📱' }
    ]).describe('Array de redes sociales'),
    contacto: z.object({
        email: z.string().optional().default('boda@ejemplo.com').describe('Email de contacto'),
        telefono: z.string().optional().default('+52 55 1234 5678').describe('Teléfono de contacto'),
        direccion: z.string().optional().default('Ciudad de México, México').describe('Dirección del evento')
    }).optional().default({
        email: 'boda@ejemplo.com',
        telefono: '+52 55 1234 5678',
        direccion: 'Ciudad de México, México'
    }).describe('Información de contacto'),
    mensaje: z.string().optional().default('Gracias por ser parte de nuestro día especial').describe('Mensaje de agradecimiento'),
    estilo: z.enum(['elegant', 'minimal', 'romantic', 'modern']).optional().default('elegant').describe('Estilo visual del footer')
});

// Función de ejecución
export async function executeFooter(args: z.infer<typeof footerSchema>) {
    const {
        nombreNovio = 'Juan',
        nombreNovia = 'María',
        fechaBoda = '15 de diciembre de 2024',
        redesSociales = [
            { nombre: 'Instagram', url: 'https://instagram.com', icono: '📷' },
            { nombre: 'Facebook', url: 'https://facebook.com', icono: '📘' },
            { nombre: 'WhatsApp', url: 'https://wa.me/1234567890', icono: '📱' }
        ],
        contacto = {
            email: 'boda@ejemplo.com',
            telefono: '+52 55 1234 5678',
            direccion: 'Ciudad de México, México'
        },
        mensaje = 'Gracias por ser parte de nuestro día especial',
        estilo = 'elegant'
    } = args;

    try {
        // Crear el prompt específico con los datos del footer
        const userPrompt = `
Crea la sección de "Footer" para la boda.

DETALLES DEL FOOTER:
- Novio: ${nombreNovio}
- Novia: ${nombreNovia}
- Fecha de la boda: ${fechaBoda}
- Estilo: ${estilo}

INFORMACIÓN DE CONTACTO:
- Email: ${contacto.email}
- Teléfono: ${contacto.telefono}
- Dirección: ${contacto.direccion}

REDES SOCIALES:
${redesSociales.map((red, index) => `
${index + 1}. ${red.nombre}
   - URL: ${red.url}
   - Icono: ${red.icono}
`).join('\n')}

IMPORTANTE: Genera una frase especial y emotiva para el footer basada en los nombres de los novios y el estilo de la boda. Esta frase debe ser romántica, personalizada y apropiada para el estilo seleccionado.

Genera el HTML para la sección de footer incluyendo esta frase especial generada dinámicamente.
`;

        // Llamada a OpenAI
        const result = await generateText({
            model: openai('gpt-4o'),
            messages: [
                { role: 'system', content: FOOTER_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            maxTokens: 3000,
            temperature: 0.7
        });

        // Limpiar la respuesta eliminando backticks si los hay
        let cleanedResult = result.text.trim();

        // Eliminar backticks al inicio y final si existen
        if (cleanedResult.startsWith('```')) {
            cleanedResult = cleanedResult.replace(/^```(html)?\s*/, '');
        }
        if (cleanedResult.endsWith('```')) {
            cleanedResult = cleanedResult.replace(/\s*```$/, '');
        }

        return cleanedResult;

    } catch (error) {
        console.error('Error en executeFooter:', error);
        // HTML de fallback en caso de error
        return `
        <footer class="bg-gray-900 text-white py-16">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <!-- Información de la boda -->
                    <div class="text-center md:text-left">
                        <h3 class="text-2xl font-light mb-4">
                            ${nombreNovio} & ${nombreNovia}
                        </h3>
                        <p class="text-gray-300 mb-2">${fechaBoda}</p>
                        <p class="text-gray-400 text-sm">Gracias por ser parte de nuestro día especial</p>
                    </div>
                    
                    <!-- Información de contacto -->
                    <div class="text-center">
                        <h4 class="text-lg font-medium mb-4">📞 Contacto</h4>
                        <div class="space-y-2 text-gray-300">
                            <p>
                                <a href="mailto:${contacto.email}" class="hover:text-white transition-colors">
                                    ✉️ ${contacto.email}
                                </a>
                            </p>
                            <p>
                                <a href="tel:${contacto.telefono}" class="hover:text-white transition-colors">
                                    📞 ${contacto.telefono}
                                </a>
                            </p>
                            <p class="text-sm">📍 ${contacto.direccion}</p>
                        </div>
                    </div>
                    
                    <!-- Redes sociales -->
                    <div class="text-center md:text-right">
                        <h4 class="text-lg font-medium mb-4">🌐 Síguenos</h4>
                        <div class="flex justify-center md:justify-end space-x-4">
                            ${redesSociales.map(red => `
                                <a href="${red.url}" 
                                   target="_blank" 
                                   class="text-2xl hover:text-rose-400 transition-colors duration-300"
                                   title="${red.nombre}">
                                    ${red.icono}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Línea divisoria -->
                <div class="border-t border-gray-700 mt-8 pt-8">
                    <div class="text-center text-gray-400 text-sm">
                        <p>💕 ${nombreNovio} & ${nombreNovia} - Unidos por el amor</p>
                        <p class="mt-2">© 2024 - Todos los derechos reservados</p>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}

// Configuración de la herramienta
export const footerTool = {
    name: 'footer',
    description: 'Genera la sección de footer con información de contacto y redes sociales',
    parameters: footerSchema,
    execute: executeFooter
};