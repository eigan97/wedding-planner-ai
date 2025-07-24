'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

interface CoupleStoryFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function CoupleStoryForm({ onSubmit, onCancel }: CoupleStoryFormProps) {
    const [formData, setFormData] = useState({
        comoSeConocieron: '',
        momentoEspecial1: '',
        momentoEspecial2: '',
        momentoEspecial3: '',
        propuestaMatrimonio: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="max-w-2xl mx-auto py-2">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Camera className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold">Historia de la Pareja</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">¿Cómo se conocieron?</label>
                        <Textarea
                            value={formData.comoSeConocieron}
                            onChange={(e) => setFormData(prev => ({ ...prev, comoSeConocieron: e.target.value }))}
                            placeholder="Cuenta la historia de cómo se conocieron..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Momento especial 1</label>
                            <Textarea
                                value={formData.momentoEspecial1}
                                onChange={(e) => setFormData(prev => ({ ...prev, momentoEspecial1: e.target.value }))}
                                placeholder="Ej: Nuestro primer viaje juntos"
                                rows={2}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Momento especial 2</label>
                            <Textarea
                                value={formData.momentoEspecial2}
                                onChange={(e) => setFormData(prev => ({ ...prev, momentoEspecial2: e.target.value }))}
                                placeholder="Ej: Cuando compramos nuestra primera casa"
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Momento especial 3</label>
                            <Textarea
                                value={formData.momentoEspecial3}
                                onChange={(e) => setFormData(prev => ({ ...prev, momentoEspecial3: e.target.value }))}
                                placeholder="Ej: Otro momento importante en nuestra relación"
                                rows={2}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">La propuesta de matrimonio</label>
                            <Textarea
                                value={formData.propuestaMatrimonio}
                                onChange={(e) => setFormData(prev => ({ ...prev, propuestaMatrimonio: e.target.value }))}
                                placeholder="Cuenta cómo fue la propuesta..."
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" size="sm" className="flex-1">
                            Guardar
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 