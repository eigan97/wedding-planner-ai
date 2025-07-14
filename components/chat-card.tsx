'use client'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export function ChatCard() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);
    const [input, setInput] = useState("");
    const [resultado, setResultado] = useState<string | null>(null);
    const [status, setStatus] = useState<"ready" | "loading">("ready");
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<'code' | 'preview'>('code');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setStatus("loading");
        setError(null);
        setMessages(msgs => [...msgs, { role: "user", content: input }]);
        const currentMessages = [...messages, { role: "user", content: input }];
        setInput("");
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: currentMessages, previousResult: resultado }),
            });
            const data = await res.json();
            if (data.shortMsg) {
                setMessages(msgs => [...msgs, { role: "assistant", content: data.shortMsg }]);
            }
            if (data.codeBlock) {
                setResultado(data.codeBlock);
            }
        } catch (err) {
            setError("Ocurrió un error.");
        } finally {
            setStatus("ready");
        }
    };

    const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");

    return (
        <Card className="w-[100vw] h-[100vh] max-w-none max-h-none flex flex-col">
            <CardHeader>
                <CardTitle>Chat y Resultado</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 gap-4 overflow-hidden">
                {/* Chat (izquierda) */}
                <div className="flex flex-col border-r pr-4 h-full" style={{ width: '30%' }}>
                    <ScrollArea className="flex-1 h-0 mb-2">
                        <div className="flex flex-col gap-2">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`text-sm rounded px-3 py-2 w-fit ${msg.role === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted text-muted-foreground self-start'}`}>
                                    {msg.content}
                                </div>
                            ))}
                            {status === 'loading' && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground italic self-start">
                                    <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    El asistente está escribiendo...
                                </div>
                            )}
                            {error && (
                                <div className="text-xs text-destructive mt-2">{error}</div>
                            )}
                        </div>
                    </ScrollArea>
                    <form className="flex gap-2 mt-2" onSubmit={handleSubmit}>
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
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
                <div className="flex flex-col h-full" style={{ width: '70%' }}>
                    <div className="font-semibold mb-2">Resultado</div>
                    <div className="flex-1 bg-muted rounded p-4 overflow-auto">
                        {resultado ? (
                            <>
                                {/* Tabs solo si hay resultado */}
                                <div className="flex gap-2 mb-2">
                                    <button
                                        className={`px-3 py-1 rounded text-xs font-medium transition ${tab === 'code' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-muted-foreground/20'}`}
                                        onClick={() => setTab('code')}
                                        type="button"
                                    >
                                        Código
                                    </button>
                                    <button
                                        className={`px-3 py-1 rounded text-xs font-medium transition ${tab === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-muted-foreground/20'}`}
                                        onClick={() => setTab('preview')}
                                        type="button"
                                    >
                                        Previsualización
                                    </button>
                                </div>
                                {tab === 'code' ? (
                                    <>
                                        <pre className="whitespace-pre-wrap text-xs mb-4"><code>{resultado}</code></pre>
                                        <button
                                            type="button"
                                            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition text-xs"
                                            onClick={() => {
                                                const blob = new Blob([resultado], { type: 'text/html' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = 'plantilla.html';
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                            }}
                                        >
                                            Descargar HTML
                                        </button>
                                    </>
                                ) : (
                                    <iframe
                                        srcDoc={resultado}
                                        title="Previsualización HTML"
                                        className="w-full h-full min-h-[300px] border rounded bg-white"
                                    />
                                )}
                            </>
                        ) : lastAssistantMsg ? (
                            <span>{lastAssistantMsg.content}</span>
                        ) : (
                            <span className="text-muted-foreground">Aquí aparecerá la respuesta del asistente.</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

