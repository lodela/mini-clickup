import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, List, Users, ArrowLeft, Shield, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";

interface Team {
  _id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    email: string;
    avatar?: string;
  };
  memberCount: number;
  projectCount: number;
  avatar?: string;
  createdAt: string;
}

export default function AdminTeamsPage() {
  const { companyId, departmentId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState("");

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/teams?departmentId=${departmentId}`);
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
        // Assuming the first team can give us the department context or we fetch it separately
        // For PoC, let's just use a placeholder if empty
        setDepartmentName("Departamento Seleccionado");
      }
    } catch (error) {
      toast.error("Error al cargar los equipos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [departmentId]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/companies/${companyId}/departments`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Equipos de Trabajo</h1>
            <p className="text-muted-foreground text-sm">
              Jerarquía: <span className="font-bold text-foreground">{departmentName}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => console.log("Crear equipo")}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Equipo
        </Button>
      </div>

      {/* Filters & View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">Total: {teams.length}</Badge>
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
      {teams.length === 0 && !isLoading ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-12 text-center bg-muted/5">
          <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-semibold italic">No hay equipos en este departamento.</h2>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">
            Crea un equipo para empezar a asignar proyectos y tareas.
          </p>
          <Button variant="outline" className="mt-8" onClick={() => console.log("Crear equipo")}>
            Añadir Equipo
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "flex flex-col gap-3"
        }>
          {teams.map((team) => (
            <div 
              key={team._id}
              className={viewMode === "grid"
                ? "group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/40"
                : "flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all"
              }
            >
              <div className="flex items-start justify-between">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-110 transition-transform">
                  <AvatarImage src={team.avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {team.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-lg leading-tight">{team.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">{team.description || "Sin descripción"}</p>
              </div>

              <div className="mt-6 flex items-center gap-3 w-full bg-muted/40 rounded-xl p-3 border border-black/5">
                <Shield className="h-4 w-4 text-primary opacity-70" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate">{team.owner?.name}</p>
                  <p className="text-[9px] text-muted-foreground truncate uppercase font-semibold">Team Leader</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 w-full border-t pt-4">
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20">
                  <span className="text-xs font-black">{team.memberCount}</span>
                  <span className="text-[8px] uppercase opacity-60 font-bold">Miembros</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20">
                  <span className="text-xs font-black">{team.projectCount}</span>
                  <span className="text-[8px] uppercase opacity-60 font-bold">Proyectos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
