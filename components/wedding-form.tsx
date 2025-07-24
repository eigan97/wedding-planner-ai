'use client'
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface WeddingFormData {
    novioNombre: string;
    noviaNombre: string;
    fechaBoda: string;
    horaBoda: string;
}

export default function WeddingForm() {
    const [formData, setFormData] = useState<WeddingFormData>({
        novioNombre: '',
        noviaNombre: '',
        fechaBoda: '',
        horaBoda: ''
    });

    const handleInputChange = (field: keyof WeddingFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        // Aquí puedes enviar los datos a tu API
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Información de la Boda</h1>
                <p className="text-muted-foreground">Completa los datos básicos para tu sitio web</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Información Básica
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="novioNombre" className="text-sm font-medium">
                                Nombre completo del novio
                            </label>
                            <Input
                                id="novioNombre"
                                value={formData.novioNombre}
                                onChange={(e) => handleInputChange('novioNombre', e.target.value)}
                                placeholder="Ej: Juan Carlos García"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="noviaNombre" className="text-sm font-medium">
                                Nombre completo de la novia
                            </label>
                            <Input
                                id="noviaNombre"
                                value={formData.noviaNombre}
                                onChange={(e) => handleInputChange('noviaNombre', e.target.value)}
                                placeholder="Ej: María Elena Rodríguez"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="fechaBoda" className="text-sm font-medium">
                                Fecha de la boda
                            </label>
                            <Input
                                id="fechaBoda"
                                type="date"
                                value={formData.fechaBoda}
                                onChange={(e) => handleInputChange('fechaBoda', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="horaBoda" className="text-sm font-medium">
                                Hora de inicio del evento
                            </label>
                            <Input
                                id="horaBoda"
                                type="time"
                                value={formData.horaBoda}
                                onChange={(e) => handleInputChange('horaBoda', e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center">
                    <Button type="submit" size="lg" className="px-8">
                        Generar Sitio Web
                    </Button>
                </div>
            </form>
        </div>
    );
} 