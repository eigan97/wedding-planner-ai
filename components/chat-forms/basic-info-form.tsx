'use client'
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface BasicInfoFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function BasicInfoForm({ onSubmit, onCancel }: BasicInfoFormProps) {
    const [formData, setFormData] = useState({
        novioNombre: '',
        noviaNombre: '',
        fechaBoda: '',
        horaBoda: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="max-w-2xl mx-auto py-2">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold">Información Básica</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Nombre del novio</label>
                            <Input
                                value={formData.novioNombre}
                                onChange={(e) => setFormData(prev => ({ ...prev, novioNombre: e.target.value }))}
                                placeholder="Ej: Juan Carlos García"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Nombre de la novia</label>
                            <Input
                                value={formData.noviaNombre}
                                onChange={(e) => setFormData(prev => ({ ...prev, noviaNombre: e.target.value }))}
                                placeholder="Ej: María Elena Rodríguez"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Fecha de la boda</label>
                            <Input
                                type="date"
                                value={formData.fechaBoda}
                                onChange={(e) => setFormData(prev => ({ ...prev, fechaBoda: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Hora de inicio</label>
                            <Input
                                type="time"
                                value={formData.horaBoda}
                                onChange={(e) => setFormData(prev => ({ ...prev, horaBoda: e.target.value }))}
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