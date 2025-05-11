import React, { useState } from 'react';
import { MatchResult } from '@/services/matchingService';
import RFPMatchCard from './RFPMatchCard';
import { Button } from './ui/button';
import { 
  DownloadIcon, 
  FileSpreadsheetIcon,
  FileTextIcon,
  MailIcon
} from 'lucide-react';
import { 
  exportMatchesToPdf,
  exportMatchesToCsv,
  emailMatches
} from '@/services/exportService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';

interface RFPMatchListProps {
  matches: MatchResult[];
  companyName: string;
}

const RFPMatchList: React.FC<RFPMatchListProps> = ({ matches, companyName }) => {
  const [email, setEmail] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Export to PDF
  const handleExportPDF = () => {
    try {
      exportMatchesToPdf(matches, companyName);
      toast({
        title: 'PDF Export Successful',
        description: 'Your matches have been exported as a PDF file.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: 'PDF Export Failed',
        description: 'There was an error exporting your matches.',
        variant: 'destructive',
      });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    try {
      exportMatchesToCsv(matches, companyName);
      toast({
        title: 'CSV Export Successful',
        description: 'Your matches have been exported as a CSV file.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: 'CSV Export Failed',
        description: 'There was an error exporting your matches.',
        variant: 'destructive',
      });
    }
  };

  // Email matches
  const handleEmailMatches = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      await emailMatches(matches, companyName, email);
      setEmailDialogOpen(false);
      
      toast({
        title: 'Email Sent',
        description: `Your matches have been sent to ${email}.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error emailing matches:', error);
      
      toast({
        title: 'Email Failed',
        description: 'There was an error sending your matches.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Top Matches</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-1">
            <FileTextIcon className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          
          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-1">
            <FileSpreadsheetIcon className="h-4 w-4" />
            <span>CSV</span>
          </Button>
          
          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <MailIcon className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Email Your Matches</DialogTitle>
                <DialogDescription>
                  Enter the email address where you'd like to receive your RFP matches.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Label htmlFor="email" className="mb-2 block">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEmailDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEmailMatches}
                  disabled={isExporting}
                >
                  {isExporting ? 'Sending...' : 'Send'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match, index) => (
          <RFPMatchCard
            key={match.opportunity.noticeId}
            match={match}
            index={index}
          />
        ))}
      </div>
      
      {matches.length === 0 && (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No matching opportunities found.
          </p>
        </div>
      )}
    </div>
  );
};

export default RFPMatchList;
