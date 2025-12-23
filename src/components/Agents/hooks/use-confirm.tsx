"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Props {
    title: string;
    description: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function ConfirmationDialogBox({ title, description, isOpen, onOpenChange, onConfirm }: Props) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface EditProps {
    title: string;
    description: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (updatedName: string, updatedInstructions: string) => void;
    currentName: string;
    currentInstructions: string;
}

export function EditDialogBox({ title, description, isOpen, onOpenChange, onConfirm, currentName, currentInstructions }: EditProps) {
    const [agentName, setAgentName] = useState(currentName);
    const [agentInstructions, setAgentInstructions] = useState(currentInstructions);

    const handleConfirm = () => {
        onConfirm(agentName, agentInstructions);
        onOpenChange(false);
    };

    const handleCancel = () => {
        setAgentName(currentName); // Reset to original value
        setAgentInstructions(currentInstructions); // Reset to original value
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter agent name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="instructions" className="text-right">
                            Instructions
                        </Label>
                        <Textarea
                            id="instructions"
                            value={agentInstructions}
                            onChange={(e) => setAgentInstructions(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter agent instructions"
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={!agentName.trim() || !agentInstructions.trim()}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}