'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Función para resaltar sintaxis HTML básica
function highlightHTML(html: string): string {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)([^&]*?)(&gt;)/g,
            '<span class="text-blue-400">$1</span><span class="text-yellow-400">$2</span><span class="text-gray-300">$3</span><span class="text-blue-400">$4</span>')
        .replace(/(class|id|src|alt|href|onclick)=/g, '<span class="text-green-400">$1</span>=')
        .replace(/(["'])([^"']*)\1/g, '<span class="text-orange-400">$1$2$1</span>')
        .replace(/(\d+)/g, '<span class="text-purple-400">$1</span>');
}

export default function WeddingAgentsDemo() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [message, setMessage] = useState('');
    const [toolResults, setToolResults] = useState<Array<{ name: string, success: boolean }>>([]);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [showCopyNotification, setShowCopyNotification] = useState(false);

    const isHtml = result.trimStart().startsWith('<!DOCTYPE html>') || result.trimStart().startsWith('<html');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        setResult('');
        setToolResults([]);
        setActiveTab('preview');

        try {
            const response = await fetch('/api/wedding-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: message }]
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.html) {
                setResult(data.html);
                setToolResults(data.toolResults || []);
                if (data.toolResults && data.toolResults.some((tr: any) => !tr.success)) {
                    setActiveTab('code');
                }
            } else if (data.error) {
                setResult(`Error: ${data.error}`);
                setToolResults([]);
            } else if (data.message) {
                setResult(`Mensaje: ${data.message}`);
                setToolResults([]);
            } else {
                setResult('No se generó HTML válido. Respuesta: ' + JSON.stringify(data, null, 2));
                setToolResults([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setResult(`Error al procesar la solicitud: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setShowCopyNotification(true);
            setTimeout(() => setShowCopyNotification(false), 2000);
        } catch (error) {
            console.error('Error al copiar:', error);
        }
    };

    const examples = [
        {
            title: '🎭 Sitio Web Completo',
            description: 'Genera un sitio web completo de boda',
            message: 'Crea un sitio web completo para la boda de Javier y Juliana el 21 de noviembre de 2025. Incluye portada, historia, itinerario, ubicaciones, RSVP, hospedaje, mesa de regalos, galería, cuenta regresiva y footer en ese orden'
        },
        {
            title: '🏠 Portada Simple',
            description: 'Genera solo la sección de portada',
            message: 'Crea la portada para la boda de Juan y María el 15 de diciembre de 2024 con estilo romántico'
        },
        {
            title: '⏳ Cuenta Regresiva',
            description: 'Genera el contador hacia la fecha',
            message: 'Crea la cuenta regresiva para la boda de Ana y Carlos el 20 de junio de 2024'
        },
        {
            title: '💌 Nuestra Historia',
            description: 'Crea la sección de historia de la pareja',
            message: 'Genera la sección de nuestra historia con momentos importantes: primer encuentro en 2018, primer viaje en 2019, compromiso en 2021'
        },
        {
            title: '⏰ Itinerario del Evento',
            description: 'Crea el itinerario con horarios',
            message: 'Crea el itinerario para nuestra boda: ceremonia a las 4pm, cóctel a las 5pm, cena a las 7pm, baile a las 9pm'
        },
        {
            title: '✅ Formulario RSVP',
            description: 'Genera el formulario de confirmación',
            message: 'Crea el formulario RSVP con opciones de menú: carne, pescado, vegetariano. Fecha límite 1 de noviembre'
        },
        {
            title: '📸 Galería de Fotos',
            description: 'Genera la sección de galería de fotos',
            message: 'Crea la galería de fotos con estas fotos: foto1.jpg, foto2.jpg, foto3.jpg. Títulos: "Primer encuentro", "Viaje juntos", "Compromiso"'
        },

        {
            title: '🧪 Prueba Valores por Defecto',
            description: 'Prueba agentes sin parámetros',
            message: 'Crea una portada, galería y cuenta regresiva usando valores por defecto'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br p-8">
            {showCopyNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    ✅ Código copiado al portapapeles
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
                        🎭 Agentes de Boda
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Sistema modular de agentes especializados para crear sitios web de bodas
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Panel de entrada */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>💬 Chat con Agentes</CardTitle>
                                <CardDescription>
                                    Escribe tu solicitud y los agentes especializados generarán las secciones correspondientes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Describe lo que necesitas para tu sitio web de boda..."
                                            className="w-full"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading || !message.trim()}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Procesando con agentes...</span>
                                            </div>
                                        ) : (
                                            <span>✨ Generar con Agentes</span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>🚀 Ejemplos Rápidos</CardTitle>
                                <CardDescription>
                                    Haz clic en un ejemplo para probar los agentes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {examples.map((example, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="w-full text-left justify-start h-auto p-4"
                                            onClick={() => setMessage(example.message)}
                                            disabled={isLoading}
                                        >
                                            <div>
                                                <div className="font-medium">{example.title}</div>
                                                <div className="text-sm text-gray-500">{example.description}</div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel de resultado */}
                    <div>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>🎨 Resultado</CardTitle>
                                <CardDescription>
                                    HTML generado por los agentes especializados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {result ? (
                                    <div className="space-y-4">
                                        {/* Indicador de agentes ejecutados */}
                                        {toolResults.length > 0 && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-800 mb-2">🤖 Agentes Ejecutados</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {toolResults.map((tool, index) => (
                                                        <span
                                                            key={index}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${tool.success
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}
                                                        >
                                                            {tool.success ? '✅' : '❌'} {tool.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tabs siempre visibles */}
                                        <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
                                            <div className="bg-gray-50 px-4 py-2 border-b">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => setActiveTab('preview')}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'preview'
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                            }`}
                                                        disabled={!isHtml}
                                                    >
                                                        🎨 Vista Previa
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTab('code')}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'code'
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        📄 Código HTML
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-0">
                                                {activeTab === 'preview' ? (
                                                    isHtml ? (
                                                        <div className="relative">
                                                            <iframe
                                                                srcDoc={result}
                                                                className="w-full h-96 border-0"
                                                                title="Vista previa del sitio web"
                                                            />
                                                            <div className="absolute top-2 right-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const newWindow = window.open('', '_blank');
                                                                        if (newWindow) {
                                                                            newWindow.document.write(result);
                                                                            newWindow.document.close();
                                                                        }
                                                                    }}
                                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                                                                >
                                                                    🔗 Abrir en Nueva Ventana
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 text-center text-gray-500">
                                                            <div className="text-4xl mb-4">📄</div>
                                                            <p>No hay HTML válido para mostrar en vista previa</p>
                                                            <p className="text-sm">Cambia a la pestaña "Código HTML" para ver el contenido</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-medium text-gray-700">📄 Código HTML Generado</h4>
                                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                                    {result.length} caracteres
                                                                </span>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => {
                                                                        const blob = new Blob([result], { type: 'text/html' });
                                                                        const url = URL.createObjectURL(blob);
                                                                        const a = document.createElement('a');
                                                                        a.href = url;
                                                                        a.download = 'sitio-web-boda.html';
                                                                        a.click();
                                                                        URL.revokeObjectURL(url);
                                                                    }}
                                                                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                                                >
                                                                    💾 Descargar
                                                                </button>
                                                                <button
                                                                    onClick={handleCopyCode}
                                                                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                                >
                                                                    📋 Copiar
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                                                            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                                    <span className="text-gray-300 text-sm ml-2">sitio-web-boda.html</span>
                                                                </div>
                                                            </div>
                                                            <div className="p-4 max-h-96 overflow-y-auto">
                                                                <pre className="text-sm leading-relaxed">
                                                                    <code
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: highlightHTML(result)
                                                                        }}
                                                                    />
                                                                </pre>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <h5 className="font-medium text-blue-800 mb-2">💡 Información del Código</h5>
                                                            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                                                                <div>
                                                                    <strong>Líneas:</strong> {result.split('\n').length}
                                                                </div>
                                                                <div>
                                                                    <strong>Secciones:</strong> {(result.match(/<section/g) || []).length}
                                                                </div>
                                                                <div>
                                                                    <strong>Scripts:</strong> {(result.match(/<script/g) || []).length}
                                                                </div>
                                                                <div>
                                                                    <strong>Estilos:</strong> {(result.match(/class=/g) || []).length}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-12">
                                        <div className="text-4xl mb-4">🎭</div>
                                        <p>Los agentes están listos para ayudarte</p>
                                        <p className="text-sm">Escribe tu solicitud o usa un ejemplo</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Información sobre agentes */}
                <div className="mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>🤖 Agentes Disponibles</CardTitle>
                            <CardDescription>
                                Cada agente está especializado en una sección específica del sitio web
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: 'Portada', icon: '🏠', desc: 'Sección principal con nombres y fecha' },
                                    { name: 'Nuestra Historia', icon: '💌', desc: 'Timeline de momentos importantes' },
                                    { name: 'Itinerario', icon: '⏰', desc: 'Horarios y actividades del evento' },
                                    { name: 'Ubicaciones', icon: '📍', desc: 'Mapas y direcciones de los lugares' },
                                    { name: 'RSVP', icon: '✅', desc: 'Formulario de confirmación de asistencia' },
                                    { name: 'Hospedaje', icon: '🏨', desc: 'Hoteles recomendados cercanos' },
                                    { name: 'Mesa de Regalos', icon: '🎁', desc: 'Opciones de regalos y transferencias' },
                                    { name: 'Galería', icon: '📸', desc: 'Galería de fotos con diferentes estilos' },
                                    { name: 'Cuenta Regresiva', icon: '⏳', desc: 'Contador hacia la fecha del evento' },
                                    { name: 'Footer', icon: '🪪', desc: 'Pie de página con contacto y redes' }
                                ].map((agent, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="text-2xl">{agent.icon}</span>
                                        <div>
                                            <div className="font-medium">{agent.name}</div>
                                            <div className="text-sm text-gray-500">{agent.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 