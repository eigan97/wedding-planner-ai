'use client'
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Send, Bot, User, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BasicInfoForm from "@/components/chat-forms/basic-info-form";
import EventDetailsForm from "@/components/chat-forms/event-details-form";
import CoupleStoryForm from "@/components/chat-forms/couple-story-form";
import FinalizeForm from "@/components/chat-forms/finalize-form";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
    component?: string;
    componentProps?: any;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentTool, setCurrentTool] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Función para scroll suave al final
    const scrollToBottom = (smooth = true) => {
        const attemptScroll = () => {
            if (scrollAreaRef.current) {
                // Buscar el elemento scrollable dentro del ScrollArea
                const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
                if (scrollElement) {
                    const scrollHeight = scrollElement.scrollHeight;
                    const clientHeight = scrollElement.clientHeight;
                    const maxScrollTop = scrollHeight - clientHeight;

                    // Solo hacer scroll si no estamos ya en el fondo
                    const currentScrollTop = scrollElement.scrollTop;
                    const isAtBottom = Math.abs(currentScrollTop - maxScrollTop) < 10;

                    if (!isAtBottom) {
                        if (smooth) {
                            // Agregar clase para transición suave
                            scrollElement.classList.add('scroll-smooth-viewport');

                            // Usar scrollTo con behavior smooth para una transición más natural
                            scrollElement.scrollTo({
                                top: maxScrollTop,
                                behavior: 'smooth'
                            });

                            // Remover la clase después de la transición
                            setTimeout(() => {
                                scrollElement.classList.remove('scroll-smooth-viewport');
                            }, 500);
                        } else {
                            scrollElement.scrollTop = maxScrollTop;
                        }
                    }
                    return true;
                }
            }
            return false;
        };

        // Intentar scroll inmediatamente
        if (!attemptScroll()) {
            // Si falla, intentar después de un pequeño delay
            setTimeout(attemptScroll, 50);
        }
    };

    // Mensaje inicial automático
    useEffect(() => {
        const initialMessage: Message = {
            id: "initial",
            content: "¡Hola! Soy tu asistente especializado en crear sitios web de bodas. Te ayudo a recolectar toda la información necesaria para crear tu sitio web personalizado. ¿Te gustaría comenzar?",
            role: "assistant",
            timestamp: new Date(),
        };
        setMessages([initialMessage]);
    }, []);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (messages.length > 0) {
            // Scroll suave para nuevos mensajes con delay más largo
            const timeoutId = setTimeout(() => scrollToBottom(true), 200);
            return () => clearTimeout(timeoutId);
        }
    }, [messages, isLoading]);

    // Scroll adicional cuando termina la carga
    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            const timeoutId = setTimeout(() => scrollToBottom(true), 400);
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading, messages.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input.trim(),
            role: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Scroll suave cuando el usuario envía un mensaje
        setTimeout(() => scrollToBottom(true), 150);

        try {
            // Detectar si el usuario quiere comenzar
            const userInput = input.trim().toLowerCase();
            const wantsToStart = userInput.includes('sí') ||
                userInput.includes('si') ||
                userInput.includes('empezar') ||
                userInput.includes('comenzar') ||
                userInput.includes('iniciar') ||
                userInput.includes('listo') ||
                userInput.includes('ok') ||
                userInput.includes('okay') ||
                userInput.includes('perfecto') ||
                userInput.includes('claro');

            if (wantsToStart) {
                // Llamar directamente a la primera herramienta
                handleToolCall('basic-info');
            } else {
                // Usar el endpoint de wedding-info para respuestas conversacionales
                const response = await fetch("/api/wedding-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: [...messages, userMessage].map(msg => ({
                            role: msg.role,
                            content: msg.content,
                        })),
                    }),
                });

                const data = await response.json();

                const assistantContent = data.message || "Lo siento, no pude procesar tu solicitud.";

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: assistantContent,
                    role: "assistant",
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "Lo siento, ocurrió un error al procesar tu mensaje.",
                role: "assistant",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Scroll suave cuando termina la carga
            setTimeout(() => scrollToBottom(true), 100);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleToolCall = async (toolName: string) => {
        console.log('handleToolCall called with:', toolName);
        setCurrentTool(toolName);
        // No establecer isLoading aquí para evitar conflictos

        try {
            const response = await fetch(`/api/tools/${toolName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: "start" }),
            });

            const data = await response.json();
            console.log('Tool call response:', data);

            if (data.success) {
                const toolMessage: Message = {
                    id: Date.now().toString(),
                    content: data.message,
                    role: "assistant",
                    timestamp: new Date(),
                    component: data.component,
                    componentProps: data
                };

                console.log('Adding tool message:', toolMessage);
                setMessages(prev => [...prev, toolMessage]);
                setIsLoading(false); // Establecer isLoading false aquí

                // Scroll suave cuando se agrega un mensaje de herramienta
                setTimeout(() => scrollToBottom(true), 250);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error calling tool:', error);
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (toolName: string, formData: any) => {
        setIsLoading(true);
        console.log('Submitting form for tool:', toolName, 'with data:', formData);

        try {
            const response = await fetch(`/api/tools/${toolName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "submit",
                    ...formData
                }),
            });

            const data = await response.json();
            console.log('Tool response:', data);

            if (data.success) {
                const responseMessage: Message = {
                    id: Date.now().toString(),
                    content: data.message,
                    role: "assistant",
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, responseMessage]);
                setCurrentTool(null);

                // Scroll suave cuando se agrega una respuesta
                setTimeout(() => scrollToBottom(true), 250);

                // Si hay siguiente herramienta, la llamamos automáticamente
                if (data.nextTool) {
                    console.log('Next tool detected:', data.nextTool);
                    // Llamar inmediatamente sin setTimeout
                    setTimeout(() => {
                        console.log('Calling next tool after delay:', data.nextTool);
                        handleToolCall(data.nextTool);
                    }, 500);
                } else {
                    console.log('No next tool specified');
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsLoading(false);
        }
    };

    const handleFormCancel = () => {
        setCurrentTool(null);
        const cancelMessage: Message = {
            id: Date.now().toString(),
            content: "Entendido, hemos cancelado esta sección. ¿Te gustaría continuar con otra parte o tienes alguna pregunta?",
            role: "assistant",
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, cancelMessage]);

        // Scroll suave cuando se cancela
        setTimeout(() => scrollToBottom(true), 250);
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            <Card className="h-full flex flex-col border-0 rounded-none shadow-none">

                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full px-6 py-2 scroll-smooth" ref={scrollAreaRef}>
                        <div className="space-y-1">

                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                        } animate-slide-in`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {message.role === "assistant" && (
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-primary-foreground" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="max-w-[70%] animate-fade-in">
                                        {message.component ? (
                                            // Renderizar componente específico
                                            <div className="mt-2 animate-scale-in">
                                                {message.component === "basic-info-form" && (
                                                    <BasicInfoForm
                                                        onSubmit={(data) => handleFormSubmit('basic-info', data)}
                                                        onCancel={handleFormCancel}
                                                    />
                                                )}
                                                {message.component === "event-details-form" && (
                                                    <EventDetailsForm
                                                        onSubmit={(data) => handleFormSubmit('event-details', data)}
                                                        onCancel={handleFormCancel}
                                                    />
                                                )}
                                                {message.component === "couple-story-form" && (
                                                    <CoupleStoryForm
                                                        onSubmit={(data) => handleFormSubmit('couple-story', data)}
                                                        onCancel={handleFormCancel}
                                                    />
                                                )}
                                                {message.component === "finalize-form" && (
                                                    <FinalizeForm
                                                        onSubmit={(data) => handleFormSubmit('finalize', data)}
                                                        onCancel={handleFormCancel}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            // Renderizar mensaje normal
                                            <Card className={`p-2 animate-slide-in ${message.role === "user"
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card"
                                                }`}>
                                                <CardContent className="p-1.5">
                                                    <p className="text-sm whitespace-pre-wrap leading-tight">{message.content}</p>
                                                    <p className={`text-xs mt-2 ${message.role === "user"
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                        }`}>
                                                        {message.timestamp.toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {message.role === "user" && (
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start animate-fade-in">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                    </div>
                                    <Card className="max-w-[35%] p-2">
                                        <CardContent className="p-1.5">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="border-t bg-card p-4">
                    <div className="flex flex-col gap-3 w-full">
                        <form onSubmit={handleSubmit} className="flex gap-3 w-full">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                size="icon"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
} 