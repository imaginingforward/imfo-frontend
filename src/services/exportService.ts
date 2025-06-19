import { jsPDF } from 'jspdf';
import type { MatchResult } from './matchingService';
import { formatDate, formatCurrency } from './matchingService';

// Export matches to PDF
export const exportMatchesToPdf = (matches: MatchResult[], companyName: string): void => {
  // Create PDF document
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(20);
  doc.text('Space Tech RFP Matches', 20, 20);
  
  // Set subtitle with company name
  doc.setFontSize(14);
  doc.text(`Matches for ${companyName}`, 20, 30);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 40);
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  let y = 55;
  
  // Add each match to the PDF
  matches.forEach((match, index) => {
    const opportunity = match.opportunity;
    
    // Start a new page if there's not enough room
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Match title
    doc.setFontSize(16);
    doc.text(`${index + 1}. ${opportunity.title}`, 20, y);
    y += 8;
    
    // Match details
    doc.setFontSize(12);
    doc.text(`Agency: ${opportunity.agency}`, 20, y);
    y += 6;
    
    doc.text(`Notice ID: ${opportunity.noticeId}`, 20, y);
    y += 6;
    
    if (opportunity.awardAmount) {
      doc.text(`Award Amount: ${formatCurrency(opportunity.awardAmount)}`, 20, y);
      y += 6;
    }
    
    doc.text(`Deadline: ${opportunity.responseDeadline ? formatDate(opportunity.responseDeadline) : formatDate(opportunity.archiveDate)}`, 20, y);
    y += 6;
    
    doc.text(`Match Score: ${(match.score * 100).toFixed(1)}% (${match.confidenceLevel} confidence)`, 20, y);
    y += 6;
    
    // Tech focus
    doc.text(`Tech Focus: ${opportunity.techFocus.join(', ')}`, 20, y);
    y += 10;
    
    // Description (truncated)
    const maxDescLength = 150;
    const description = opportunity.description.length > maxDescLength 
      ? opportunity.description.substring(0, maxDescLength) + '...' 
      : opportunity.description;
      
    doc.text('Description:', 20, y);
    y += 6;
    
    // Word wrap description
    const splitDescription = doc.splitTextToSize(description, 170);
    doc.text(splitDescription, 20, y);
    y += splitDescription.length * 6;
    
    // Contact information
    if (opportunity.pointOfContact?.email) {
      doc.text(`Contact: ${opportunity.pointOfContact.email}`, 20, y);
      y += 6;
    }
    
    // URL
    if (opportunity.url) {
      doc.text(`URL: ${opportunity.url}`, 20, y);
      y += 6;
    }
    
    // Add horizontal line between matches
    if (index < matches.length - 1) {
      doc.setLineWidth(0.2);
      doc.line(20, y, 190, y);
      y += 10;
    }
  });
  
  // Save the PDF
  doc.save(`space-tech-rfp-matches-${companyName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

// Export matches to CSV
export const exportMatchesToCsv = (matches: MatchResult[], companyName: string): void => {
  // CSV header
  let csvContent = "Notice ID,Title,Agency,Description,Posted Date,Response Deadline,Award Amount,";
  csvContent += "Tech Focus,Match Score,Confidence Level,URL\n";
  
  // Add each match to the CSV
  matches.forEach((match) => {
    const opportunity = match.opportunity;
    
    // Format description (remove commas and newlines)
    const description = opportunity.description
      .replace(/,/g, ' ')
      .replace(/\r?\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Format tech focus
    const techFocus = opportunity.techFocus.join('; ');
    
    // Add the row
    csvContent += `"${opportunity.noticeId}",`;
    csvContent += `"${opportunity.title}",`;
    csvContent += `"${opportunity.agency}",`;
    csvContent += `"${description}",`;
    csvContent += `"${formatDate(opportunity.postedDate)}",`;
    csvContent += `"${opportunity.responseDeadline ? formatDate(opportunity.responseDeadline) : formatDate(opportunity.archiveDate)}",`;
    csvContent += `"${opportunity.awardAmount ? formatCurrency(opportunity.awardAmount) : 'Not specified'}",`;
    csvContent += `"${techFocus}",`;
    csvContent += `"${(match.score * 100).toFixed(1)}%",`;
    csvContent += `"${match.confidenceLevel}",`;
    csvContent += `"${opportunity.url || ''}"\n`;
  });
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `space-tech-rfp-matches-${companyName.toLowerCase().replace(/\s+/g, '-')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Email matches
export const emailMatches = async (
  matches: MatchResult[], 
  companyName: string, 
  recipientEmail: string
): Promise<boolean> => {
  try {
    // In a real implementation, this would call a backend API to send an email
    // For now, we'll just log a message and return success
    console.log(`Would email ${matches.length} matches to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Error emailing matches:', error);
    return false;
  }
};
