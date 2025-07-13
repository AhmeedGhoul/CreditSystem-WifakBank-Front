import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
    mode: "single";
    selected: Date | undefined;
    onSelect: (date?: Date) => void;
    initialFocus?: boolean;
}

export function Calendar({ selected, onSelect }: CalendarProps) {
    return (
        <div className="p-2 bg-white dark:bg-black rounded shadow-md">
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={onSelect}
                captionLayout="dropdown"
                fromYear={2000}
                toYear={new Date().getFullYear()}
            />
        </div>
    );
}
