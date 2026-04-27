import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, List, Users, ArrowLeft, Building2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Department {
  _id: string;
  name: string;
  description: string;
  manager: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  companyId: {
    _id: string;
    name: string;
  };
}

export default function AdminDepartmentsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/departments?companyId=${companyId}`);
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
        if (data.data.length > 0) {
          setCompanyName(data.data[0].companyId.name);
        }
      }
    } catch (error) {
      toast.error("Error al cargar los departamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [companyId]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/companies")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Departamentos</h1>
            <p className="text-muted-foreground text-sm">
              Empresa: <span className="font-bold text-foreground">{companyName || "Cargando..."}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => console.log("Crear departamento")}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Departamento
        </Button>
      </div>

      {/* Filters & View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">Total: {departments.length}</Badge>
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
      {departments.length === 0 && !isLoading ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-12 text-center bg-muted/5">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold italic">Esta empresa no tiene departamentos registrados.</h2>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">
            Los departamentos son necesarios para agrupar equipos de trabajo.
          </p>
          <Button variant="outline" className="mt-8" onClick={() => console.log("Crear departamento")}>
            Crear Primer Departamento
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "flex flex-col gap-3"
        }>
          {departments.map((dept) => (
            <Link 
              to={`/admin/companies/${companyId}/departments/${dept._id}/teams`}
              key={dept._id}
              className={viewMode === "grid"
                ? "group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/40 cursor-pointer"
                : "flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all cursor-pointer"
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-lg leading-tight">{dept.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">{dept.description || "Sin descripción"}</p>
              </div>

              <div className="mt-6 flex items-center gap-3 w-full bg-muted/40 rounded-xl p-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={dept.manager?.avatar || ""} />
                  <AvatarFallback className="text-[10px] font-bold">
                    {dept.manager?.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate">{dept.manager?.name}</p>
                  <p className="text-[9px] text-muted-foreground truncate uppercase font-semibold">Manager</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold">4 Equipos</span>
                </div>
                <Badge variant={dept.status === "Active" ? "default" : "secondary"} className="text-[8px] h-4 px-1.5 uppercase font-black">
                  {dept.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
