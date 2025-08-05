import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronLeft, ChevronRight, Globe, Database, Linkedin, Twitter } from 'lucide-react';
import { type Company } from "@/services/companyService";
import { cn } from "@/lib/utils";

interface CompanyTableProps {
  companies: Company[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-white/30 overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/10">
            <TableRow className="border-b border-white/20">
              <TableHead className="text-white font-semibold">Company</TableHead>
              <TableHead className="text-white font-semibold">Sector</TableHead>
              <TableHead className="text-white font-semibold">Subsector</TableHead>
              <TableHead className="text-white font-semibold">Stage</TableHead>
              <TableHead className="text-white font-semibold">Location</TableHead>
              <TableHead className="text-white font-semibold">Latest Funding</TableHead>
              <TableHead className="text-white font-semibold">Total Funding</TableHead>
              <TableHead className="text-white font-semibold">Annual Revenue</TableHead>
              <TableHead className="text-white font-semibold">Business Activity</TableHead>
              <TableHead className="text-white font-semibold">Founded</TableHead>
              <TableHead className="text-white font-semibold">Hiring</TableHead>
              <TableHead className="text-white font-semibold">Notable Partners</TableHead>
              <TableHead className="text-white font-semibold">Website</TableHead>
              <TableHead className="text-white font-semibold">LinkedIn</TableHead>
              <TableHead className="text-white font-semibold">Twitter</TableHead>
              <TableHead className="text-white font-semibold">Crunchbase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow 
                key={company.id} 
                className={cn(
                  "hover:bg-white/10",
                  index % 2 === 0 ? "bg-transparent" : "bg-white/5"
                )}
              >
                <TableCell className="font-medium text-gray-100">{company.company_name}</TableCell>
                <TableCell className="text-gray-200">{company.sector}</TableCell>
                <TableCell className="text-gray-200">{company.subsector_tags || '—'}</TableCell>
                <TableCell className="text-gray-200">{company.stage || '—'}</TableCell>
                <TableCell className="text-gray-200">{company.hq_location || '—'}</TableCell>
                <TableCell className="text-gray-200">{company.latest_funding_raised || '—'}</TableCell>
                <TableCell className="text-gray-200">{company.total_funding_raised || '—'}</TableCell>
                <TableCell className="text-gray-200">{company.annual_revenue || '—'}</TableCell>
                <TableCell className="text-gray-200">
                  {company.business_activity || '—'}
                </TableCell>
                <TableCell className="text-gray-200">{company.year_founded || '—'}</TableCell>
                <TableCell className="text-gray-200">
                  {company.hiring === 'Y' ? 'Yes' : company.hiring === 'N' ? 'No' : '—'}
                </TableCell>
                <TableCell className="text-gray-200">
                  {company.notable_partners || '—'}
                </TableCell>
                <TableCell className="text-white">
                  {company.website_url ? (
                    <a 
                      href={company.website_url.startsWith('http') ? company.website_url : `http://${company.website_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                      title="Website"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-white">
                  {company.linkedin_url ? (
                    <a 
                      href={company.linkedin_url.startsWith('http') ? company.linkedin_url : `http://${company.linkedin_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-white">
                  {company.twitter_url ? (
                    <a 
                      href={company.twitter_url.startsWith('http') ? company.twitter_url : `http://${company.twitter_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300"
                      title="Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-white">
                  {company.crunchbase_url ? (
                    <a 
                      href={company.crunchbase_url.startsWith('http') ? company.crunchbase_url : `http://${company.crunchbase_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300"
                      title="Crunchbase"
                    >
                      <Database className="h-4 w-4" />
                    </a>
                  ) : '—'}
                </TableCell>
              </TableRow>
            ))}
            
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-4 text-white">
                  No companies found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-300">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button 
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
