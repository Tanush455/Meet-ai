'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationProps {
    title: string;
    description: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function ConfirmationDialogBox({ title, description, isOpen, onOpenChange, onConfirm }: ConfirmationProps) {
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

interface EditMeetingProps {
    title: string;
    description: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (updatedName: string) => void;
    currentName: string;
}

export function EditMeetingDialogBox({ title, description, isOpen, onOpenChange, onConfirm, currentName }: EditMeetingProps) {
    const [meetingName, setMeetingName] = useState(currentName);

    const handleConfirm = () => {
        onConfirm(meetingName);
        onOpenChange(false);
    };

    const handleCancel = () => {
        setMeetingName(currentName); // Reset to original value
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
                            value={meetingName}
                            onChange={(e) => setMeetingName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter meeting name"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={!meetingName.trim()}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
