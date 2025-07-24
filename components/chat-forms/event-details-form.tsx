'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

interface EventDetailsFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function EventDetailsForm({ onSubmit, onCancel }: EventDetailsFormProps) {
    const [formData, setFormData] = useState({
        tipoCeremonia: '',
        lugarCeremonia: '',
        direccionCeremonia: '',
        lugarRecepcion: '',
        direccionRecepcion: '',
        temaBoda: '',
        coloresBoda: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="max-w-2xl mx-auto py-2">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Detalles del Evento</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tipo de ceremonia</label>
                            <Input
                                value={formData.tipoCeremonia}
                                onChange={(e) => setFormData(prev => ({ ...prev, tipoCeremonia: e.target.value }))}
                                placeholder="Ej: Civil, Religiosa, Mixta"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Lugar de la ceremonia</label>
                            <Input
                                value={formData.lugarCeremonia}
                                onChange={(e) => setFormData(prev => ({ ...prev, lugarCeremonia: e.target.value }))}
                                placeholder="Ej: Iglesia de San José"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Dirección de la ceremonia</label>
                        <Textarea
                            value={formData.direccionCeremonia}
                            onChange={(e) => setFormData(prev => ({ ...prev, direccionCeremonia: e.target.value }))}
                            placeholder="Dirección completa"
                            rows={2}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Lugar de la recepción</label>
                            <Input
                                value={formData.lugarRecepcion}
                                onChange={(e) => setFormData(prev => ({ ...prev, lugarRecepcion: e.target.value }))}
                                placeholder="Ej: Salón de Eventos Las Palmas"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tema de la boda</label>
                            <Input
                                value={formData.temaBoda}
                                onChange={(e) => setFormData(prev => ({ ...prev, temaBoda: e.target.value }))}
                                placeholder="Ej: Minimalista, Rústico, Elegante"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Dirección de la recepción</label>
                        <Textarea
                            value={formData.direccionRecepcion}
                            onChange={(e) => setFormData(prev => ({ ...prev, direccionRecepcion: e.target.value }))}
                            placeholder="Dirección completa"
                            rows={2}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Paleta de colores</label>
                        <Input
                            value={formData.coloresBoda}
                            onChange={(e) => setFormData(prev => ({ ...prev, coloresBoda: e.target.value }))}
                            placeholder="Ej: Blanco, Dorado y Rosa"
                            required
                        />
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