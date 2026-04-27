import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, LayoutGrid, List, Folder, History, Ticket, Building2, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import CreateCompanyModal from "@/components/modals/CreateCompanyModal";
import { toast } from "sonner";

interface CompanyStats {
  projectsCount: number;
  storiesCount: number;
  ticketsCount: number;
}

interface Company {
  _id: string;
  name: string;
  legalName: string;
  primaryContact: {
    name: string;
    email: string;
    avatar?: string;
  };
  logo: string | null;
  status: string;
  rfc?: string;
  stats: CompanyStats;
}

export default function AdminCompaniesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setPagesMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchCompanies = useCallback(async (isNewSearch = false) => {
    try {
      setIsLoading(true);
      const currentPage = isNewSearch ? 1 : page;
      const response = await fetch(`/api/admin/companies?page=${currentPage}&limit=12&search=${search}`);
      const data = await response.json();
      
      if (data.success) {
        setCompanies(prev => isNewSearch ? data.data : [...prev, ...data.data]);
        setPagesMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      toast.error("Error al cargar las empresas");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCompanies(true);
  }, [search]);

  useEffect(() => {
    if (page > 1) fetchCompanies();
  }, [page]);

  const lastElementRef = useCallback((node: HTMLAnchorElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <CreateCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchCompanies(true)} 
      />

      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administración de Empresas</h1>
          <p className="text-muted-foreground text-sm">Control centralizado de clientes y jerarquías.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o RFC..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Empresa
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">Total: {companies.length}</Badge>
        </div>
        <div className="flex items-center rounded-lg border bg-background p-1 shadow-sm">
          <Button 
            variant={viewMode === "grid" ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {companies.length === 0 && !isLoading ? (
        <div className="flex h-[450px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-12 text-center bg-muted/10">
          <Building2 className="h-16 w-16 text-muted-foreground/50 mb-6" />
          <h2 className="text-xl font-semibold">Sin resultados</h2>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">
            {search ? `No se encontraron empresas que coincidan con "${search}"` : "Comienza registrando tu primer cliente corporativo."}
          </p>
          <Button variant="outline" className="mt-8 px-8" onClick={() => setIsModalOpen(true)}>
            Crear Empresa
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 pb-20" 
          : "flex flex-col gap-3 pb-20"
        }>
          {companies.map((company, index) => {
            const isLast = companies.length === index + 1;
            return (
              <Link 
                to={`/admin/companies/${company._id}/departments`}
                key={company._id} 
                ref={isLast ? lastElementRef : null}
                className={viewMode === "grid" 
                  ? "group relative flex flex-col items-center rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 overflow-hidden cursor-pointer" 
                  : "flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all shadow-sm cursor-pointer"
                }
              >
                {viewMode === "grid" ? (
                  <>
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-1 ring-muted/50 group-hover:scale-110 transition-transform duration-300">
                      <AvatarImage src={company.logo || ""} alt={company.name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-2xl">
                        {company.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="mt-5 text-center w-full px-2">
                      <h3 className="font-bold text-lg leading-tight truncate">{company.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-1.5">{company.legalName}</p>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-1.5 w-full bg-muted/40 rounded-xl p-4 ring-1 ring-black/5">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>{company.primaryContact.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate w-full text-center">
                        {company.primaryContact.email}
                      </p>
                    </div>

                    <div className="mt-8 grid grid-cols-3 w-full border-t border-muted/60 pt-4 gap-2">
                      <div className="flex flex-col items-center group/stat">
                        <Folder className="h-4 w-4 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-xs font-bold mt-1">{company.stats.projectsCount}</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">Proyectos</span>
                      </div>
                      <div className="flex flex-col items-center border-x border-muted/60 group/stat">
                        <History className="h-4 w-4 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-xs font-bold mt-1">{company.stats.storiesCount}</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">Historias</span>
                      </div>
                      <div className="flex flex-col items-center group/stat">
                        <Ticket className="h-4 w-4 text-muted-foreground group-hover/stat:text-primary transition-colors" />
                        <span className="text-xs font-bold mt-1">{company.stats.ticketsCount}</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-60 font-bold">Tickets</span>
                      </div>
                    </div>

                    <Badge variant={company.status === "Active" ? "default" : "destructive"} className="absolute top-4 right-4 text-[9px] h-5 px-2 uppercase font-black">
                      {company.status}
                    </Badge>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-5">
                      <Avatar className="h-12 w-12 border shadow-sm">
                        <AvatarImage src={company.logo || ""} alt={company.name} />
                        <AvatarFallback>{company.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-base">{company.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded uppercase">{company.rfc}</span>
                          <span className="text-xs text-muted-foreground">• {company.primaryContact.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-12 pr-4">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold">{company.stats.projectsCount}</span>
                          <span className="text-[8px] uppercase opacity-60">Proyectos</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold">{company.stats.storiesCount}</span>
                          <span className="text-[8px] uppercase opacity-60">Historias</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold">{company.stats.ticketsCount}</span>
                          <span className="text-[8px] uppercase opacity-60">Tickets</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] h-6 px-3 font-bold uppercase">{company.status}</Badge>
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
