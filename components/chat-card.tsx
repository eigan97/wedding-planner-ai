'use client'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export function ChatCard() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        status,
        error
    } = useChat({ api: "/api/chat" });

    // Última respuesta del asistente
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");

    return (
        <Card className="w-full max-w-4xl mx-auto h-[500px] flex flex-col">
            <CardHeader>
                <CardTitle>Chat y Resultado</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 gap-4 overflow-hidden">
                {/* Chat (izquierda) */}
                <div className="flex flex-col flex-1 border-r pr-4 h-full">
                    <ScrollArea className="flex-1 h-0 mb-2">
                        <div className="flex flex-col gap-2">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`text-sm rounded px-3 py-2 w-fit ${msg.role === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted text-muted-foreground self-start'}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {(status === 'submitted' || status === 'streaming') && (
                                <div className="text-xs text-muted-foreground italic">El asistente está escribiendo...</div>
                            )}
                            {error && (
                                <div className="text-xs text-destructive mt-2">{error.message || 'Ocurrió un error.'}</div>
                            )}
                        </div>
                    </ScrollArea>
                    <form
                        className="flex gap-2 mt-2"
                        onSubmit={e => {
                            handleSubmit(e);
                        }}
                    >
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1"
                            disabled={status !== 'ready'}
                        />
                        <Button type="submit" disabled={status !== 'ready' || !input.trim()} size="icon">
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
                {/* Resultado (derecha) */}
                <div className="flex-1 flex flex-col h-full">
                    <div className="font-semibold mb-2">Resultado</div>
                    <div className="flex-1 bg-muted rounded p-4 overflow-auto">
                        {lastAssistantMsg ? (
                            <span>{lastAssistantMsg.content}</span>
                        ) : (
                            <span className="text-muted-foreground">Aquí aparecerá la respuesta del asistente.</span>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-end text-xs text-muted-foreground">
                Interfaz tipo v0.dev usando shadcn/ui y useChat
            </CardFooter>
        </Card>
    );
}

