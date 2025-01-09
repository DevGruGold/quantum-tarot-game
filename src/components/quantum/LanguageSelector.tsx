import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (value: string) => void;
}

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="language" className="text-purple-200">
        Language / Idioma
      </Label>
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger id="language" className="w-full max-w-xs bg-black/30 border-purple-500/30 text-purple-100">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;