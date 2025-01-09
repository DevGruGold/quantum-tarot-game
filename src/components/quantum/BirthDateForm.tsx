import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import LanguageSelector from './LanguageSelector';

interface BirthDateFormProps {
  onBirthDateSubmit: (date: string, secondDate?: string) => void;
  birthDate: string;
  secondBirthDate?: string;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const BirthDateForm = ({ 
  onBirthDateSubmit, 
  birthDate, 
  secondBirthDate,
  language, 
  onLanguageChange 
}: BirthDateFormProps) => {
  const { toast } = useToast();

  const handleDateChange = (date: string, isSecondPerson: boolean = false) => {
    onBirthDateSubmit(isSecondPerson ? birthDate : date, isSecondPerson ? date : secondBirthDate);
    
    if (date) {
      toast({
        title: language === 'en' ? "Birth date received" : "Fecha de nacimiento recibida",
        description: language === 'en' 
          ? `${isSecondPerson ? "Second person's" : "Your"} astrological energies will be incorporated into the reading.`
          : `Las energías astrológicas ${isSecondPerson ? "de la segunda persona" : "tuyas"} serán incorporadas en la lectura.`,
      });
    }
  };

  return (
    <Card className="p-6 mb-8 bg-black/40 backdrop-blur-lg border-purple-500/20">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-purple-300">
          {language === 'en' ? "Enter Birth Date(s)" : "Ingresa Fecha(s) de Nacimiento"}
        </h3>
        <p className="text-sm text-purple-200/80">
          {language === 'en' 
            ? "For an accurate reading that aligns with your astrological energies"
            : "Para una lectura precisa que se alinee con tus energías astrológicas"}
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
        <div className="flex flex-col gap-2">
          <Label htmlFor="birthdate" className="text-purple-200">
            {language === 'en' ? "Your Birth Date" : "Tu Fecha de Nacimiento"}
          </Label>
          <Input
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full max-w-xs bg-black/30 border-purple-500/30 text-purple-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="secondBirthdate" className="text-purple-200">
            {language === 'en' ? "Second Person's Birth Date (Optional)" : "Fecha de Nacimiento de Segunda Persona (Opcional)"}
          </Label>
          <Input
            type="date"
            id="secondBirthdate"
            value={secondBirthDate}
            onChange={(e) => handleDateChange(e.target.value, true)}
            className="w-full max-w-xs bg-black/30 border-purple-500/30 text-purple-100"
          />
        </div>
        <LanguageSelector 
          language={language} 
          onLanguageChange={onLanguageChange}
        />
      </div>
    </Card>
  );
};

export default BirthDateForm;