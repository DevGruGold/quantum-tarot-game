import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface BirthDateFormProps {
  onBirthDateSubmit: (date: string) => void;
  birthDate: string;
}

const BirthDateForm = ({ onBirthDateSubmit, birthDate }: BirthDateFormProps) => {
  const { toast } = useToast();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    onBirthDateSubmit(date);
    
    if (date) {
      toast({
        title: "Birth date received",
        description: "Your astrological energies will be incorporated into the reading.",
      });
    }
  };

  return (
    <Card className="p-6 mb-8 bg-black/40 backdrop-blur-lg border-purple-500/20">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-purple-300">Enter Your Birth Date</h3>
        <p className="text-sm text-purple-200/80">
          For an accurate reading that aligns with your astrological energies
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Label htmlFor="birthdate" className="text-purple-200">
          Birth Date
        </Label>
        <Input
          type="date"
          id="birthdate"
          value={birthDate}
          onChange={handleDateChange}
          className="w-full max-w-xs bg-black/30 border-purple-500/30 text-purple-100"
        />
      </div>
    </Card>
  );
};

export default BirthDateForm;