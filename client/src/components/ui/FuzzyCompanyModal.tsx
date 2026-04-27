import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanySearchResult } from "@/services/companies";

interface FuzzyCompanyModalProps {
  open: boolean;
  results: CompanySearchResult[];
  onSelect: (company: CompanySearchResult) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

/**
 * Modal shown when fuzzy company search finds potential matches.
 * User can pick an existing company or choose to create a new one.
 */
export function FuzzyCompanyModal({
  open,
  results,
  onSelect,
  onCreateNew,
  onClose,
}: FuzzyCompanyModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Similar company found</DialogTitle>
          <DialogDescription>
            We found companies that may match yours. Select one or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto py-2">
          {results.map((c) => (
            <button
              key={c._id}
              onClick={() => onSelect(c)}
              className="w-full flex items-center justify-between p-3 rounded-lg border
                         hover:bg-accent hover:border-primary transition-colors text-left"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                {c.domain && (
                  <p className="text-xs text-muted-foreground">@{c.domain}</p>
                )}
              </div>
              <Badge variant="secondary">{c.score}% match</Badge>
            </button>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={onCreateNew} className="w-full sm:w-auto">
            Create new company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
