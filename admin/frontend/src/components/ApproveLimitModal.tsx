import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ApproveLimitModalProps {
    credit: any;
    onClose: () => void;
    onConfirm: (limit: number) => void;
}

export function ApproveLimitModal({
    credit,
    onClose,
    onConfirm,
}: ApproveLimitModalProps) {
    const [limit, setLimit] = useState("");

    const handleConfirm = () => {
        if (!limit || Number(limit) <= 0) {
            toast({
                title: "Valor inválido",
                description: "Informe um limite válido",
                variant: "destructive",
            });
            return;
        }

        onConfirm(Number(limit));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Definir limite</h2>

                <Input
                    type="number"
                    placeholder="Ex: 1000"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm}>
                        Definir limite
                    </Button>
                </div>
            </div>
        </div>
    );
}
