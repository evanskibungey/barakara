
'use client';

import { useState } from 'react';
import { PRICING_TIERS, type TierName } from '@/lib/pricing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calculator, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TierConfig = {
  baseFee: number;
  memberFee: number;
  transactionFeePercent: number;
};

export function PricingEditor() {
  const [tiers, setTiers] = useState<Record<TierName, TierConfig>>(() => {
    const initialTiers: Partial<Record<TierName, TierConfig>> = {};
    for (const key in PRICING_TIERS) {
        const tierName = key as TierName;
        initialTiers[tierName] = {
            baseFee: PRICING_TIERS[tierName].baseFee,
            memberFee: PRICING_TIERS[tierName].memberFee,
            transactionFeePercent: PRICING_TIERS[tierName].transactionFeePercent,
        };
    }
    return initialTiers as Record<TierName, TierConfig>;
  });
  
  const [calculatorMembers, setCalculatorMembers] = useState(25);
  const [calculatorVolume, setCalculatorVolume] = useState(500000);
  const { toast } = useToast();

  const handleTierChange = (tierName: TierName, field: keyof TierConfig, value: string) => {
    const numericValue = Number(value) || 0;
    setTiers(prevTiers => ({
      ...prevTiers,
      [tierName]: {
        ...prevTiers[tierName],
        [field]: numericValue,
      },
    }));
  };

  const calculateFee = (tierName: TierName) => {
    const tier = tiers[tierName];
    const baseFee = tier.baseFee;
    const memberCost = tier.memberFee * calculatorMembers;
    const transactionCost = (tier.transactionFeePercent / 100) * calculatorVolume;
    return baseFee + memberCost + transactionCost;
  };

  const handleSaveChanges = () => {
    // Here you would typically send the 'tiers' state to your backend to save it.
    console.log('Saving new pricing tiers:', tiers);
    toast({
      title: "Pricing Model Updated",
      description: "The new subscription fees have been saved.",
    });
  };


  return (
    <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
            <CardHeader className='flex flex-row justify-between items-start'>
                <div>
                    <CardTitle>Subscription Pricing Model</CardTitle>
                    <CardDescription>Adjust the parameters for each subscription tier. Changes will affect new subscriptions.</CardDescription>
                </div>
                 <Button onClick={handleSaveChanges}>
                    <Save className="mr-2" /> Save Changes
                </Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                {Object.keys(tiers).map(tierKey => {
                    const tierName = tierKey as TierName;
                    const tier = tiers[tierName];
                    return (
                        <Card key={tierName} className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">{tierName}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`${tierName}-base-fee`}>Base Fee (KES)</Label>
                                    <Input 
                                        id={`${tierName}-base-fee`} 
                                        type="number" 
                                        value={tier.baseFee}
                                        onChange={(e) => handleTierChange(tierName, 'baseFee', e.target.value)}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`${tierName}-member-fee`}>Fee per Member (KES)</Label>
                                    <Input 
                                        id={`${tierName}-member-fee`} 
                                        type="number" 
                                        value={tier.memberFee}
                                        onChange={(e) => handleTierChange(tierName, 'memberFee', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`${tierName}-transaction-fee`}>Transaction Fee (%)</Label>
                                    <Input 
                                        id={`${tierName}-transaction-fee`} 
                                        type="number"
                                        step="0.1"
                                        value={tier.transactionFeePercent}
                                        onChange={(e) => handleTierChange(tierName, 'transactionFeePercent', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator /> Subscription Calculator</CardTitle>
                <CardDescription>Model potential monthly revenue based on the pricing formulas you've set.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Number of Members</Label>
                        <span className="font-bold">{calculatorMembers}</span>
                    </div>
                    <Slider 
                        value={[calculatorMembers]}
                        onValueChange={([val]) => setCalculatorMembers(val)}
                        min={1} 
                        max={100} 
                        step={1} 
                    />
                </div>
                <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <Label>Monthly Transaction Volume (KES)</Label>
                        <span className="font-bold">{calculatorVolume.toLocaleString()}</span>
                    </div>
                    <Slider 
                        value={[calculatorVolume]}
                        onValueChange={([val]) => setCalculatorVolume(val)}
                        min={10000} 
                        max={5000000} 
                        step={10000} 
                    />
                </div>
                <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold">Estimated Monthly Fee:</h4>
                    {Object.keys(tiers).map(tierKey => {
                        const tierName = tierKey as TierName;
                        return (
                            <div key={tierName} className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-md">
                                <span className="text-muted-foreground">{tierName} Tier</span>
                                <span className="font-bold text-primary">KES {calculateFee(tierName).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
