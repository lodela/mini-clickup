import { useState, useEffect } from "react";
import { Plus, LayoutGrid, List, Folder, History, Ticket, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CreateCompanyModal from "@/components/modals/CreateCompanyModal";
import { toast } from "react-hot-toast";

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
  stats: CompanyStats;
}

export default function AdminCompaniesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/companies");
      const data = await response.json();
      if (data.success) {
        setCompanies(data.data);
      }
    } catch (error) {
      toast.error("Error al cargar las empresas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <CreateCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCompanies} 
      />

      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administración de Empresas</h1>
          <p className="text-muted-foreground">Gestiona tus clientes y sus configuraciones maestras.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Empresa
        </Button>
      </div>

      {/* Filters & View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">Total: {companies.length}</Badge>
          {isLoading && <span className="text-xs text-muted-foreground animate-pulse italic">Cargando datos...</span>}
        </div>
        <div className="flex items-center rounded-lg border bg-background p-1">
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

      {/* Main Content Area */}
      {companies.length === 0 && !isLoading ? (
        <div className="flex h-[450px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold italic">No hay ninguna empresa registrada todavía.</h2>
          <p className="mt-2 text-muted-foreground">Haz clic en el botón "Agregar Empresa" para comenzar.</p>
          <Button variant="outline" className="mt-8" onClick={() => setIsModalOpen(true)}>
            Primer Cliente
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" 
          : "flex flex-col gap-2"
        }>
          {companies.map((company) => (
            viewMode === "grid" ? (
              <div key={company._id} className="group relative flex flex-col items-center rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50" style={{ minWidth: '220px', maxWidth: '390px' }}>
                <Avatar className="h-20 w-20 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarImage src={company.logo || ""} alt={company.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                    {company.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-lg leading-tight truncate px-2">{company.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{company.legalName}</p>
                </div>

                <div className="mt-6 flex flex-col items-center gap-1 w-full bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <User className="h-3 w-3 text-primary" />
                    <span>{company.primaryContact.name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {company.primaryContact.email}
                  </p>
                </div>

                {/* Footer Indicators - Figma Style */}
                <div className="mt-8 grid grid-cols-3 w-full border-t pt-4 gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Folder className="h-3 w-3" />
                      <span className="text-[10px] font-semibold">{company.stats.projectsCount}</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-tighter opacity-70">Proyectos</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x">
                    <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <History className="h-3 w-3" />
                      <span className="text-[10px] font-semibold">{company.stats.storiesCount}</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-tighter opacity-70">Historias</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Ticket className="h-3 w-3" />
                      <span className="text-[10px] font-semibold">{company.stats.ticketsCount}</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-tighter opacity-70">Tickets</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant={company.status === "Active" ? "default" : "destructive"} className="text-[9px] px-1.5 py-0">
                    {company.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div key={company._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={company.logo || ""} alt={company.name} />
                    <AvatarFallback>{company.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{company.name}</h4>
                    <p className="text-xs text-muted-foreground">{company.primaryContact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 px-6">
                  <div className="flex gap-4">
                    <span className="text-xs">📂 {company.stats.projectsCount}</span>
                    <span className="text-xs">📜 {company.stats.storiesCount}</span>
                    <span className="text-xs">🎫 {company.stats.ticketsCount}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{company.status}</Badge>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
