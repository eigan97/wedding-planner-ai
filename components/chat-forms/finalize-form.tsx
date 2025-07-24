'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface FinalizeFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function FinalizeForm({ onSubmit, onCancel }: FinalizeFormProps) {
    const [generateWebsite, setGenerateWebsite] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ generateWebsite });
    };

    return (
        <Card className="max-w-2xl mx-auto py-2">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Finalizar y Generar Sitio Web</h3>
                </div>

                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Has completado toda la información necesaria para crear tu sitio web de boda personalizado.
                        Con todos los datos que me has proporcionado, puedo generar una página web hermosa y funcional
                        que refleje perfectamente tu estilo y personalidad como pareja.
                    </p>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                checked={generateWebsite}
                                onChange={(e) => setGenerateWebsite(e.target.checked)}
                                className="rounded w-4 h-4"
                            />
                            <span className="text-sm font-medium">Sí, generar mi sitio web ahora</span>
                        </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="submit"
                            size="sm"
                            className="flex-1"
                            disabled={!generateWebsite}
                        >
                            Generar Sitio Web
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 