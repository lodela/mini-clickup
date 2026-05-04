import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Users, ArrowLeft, Shield, MoreVertical } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    teams: ctxTeams,
    isLoadingTeams,
    fetchTeams,
  } = useAdmin();
  const teams = ctxTeams as Team[];
  const departmentName = 'Departamento Seleccionado';

  useEffect(() => {
    if (departmentId) {
      fetchTeams(departmentId);
    }
  }, [departmentId, fetchTeams]);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full glass-bg">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/companies/${companyId}/departments`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Equipos de Trabajo</h1>
            <p className="text-muted-foreground text-sm">
              Jerarquía: <span className="text-foreground font-bold">{departmentName}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => console.log('Crear equipo')}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Equipo
        </Button>
      </div>

      {/* Filters & View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Total: {teams.length}
          </Badge>
        </div>
        <div className="bg-background flex items-center rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {teams.length === 0 && !isLoadingTeams ? (
        <div className="border-muted bg-muted/5 flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center">
          <Users className="text-muted-foreground/40 mb-4 h-12 w-12" />
          <h2 className="text-xl font-semibold italic">No hay equipos en este departamento.</h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm">
            Crea un equipo para empezar a asignar proyectos y tareas.
          </p>
          <Button variant="outline" className="mt-8" onClick={() => console.log('Crear equipo')}>
            Añadir Equipo
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-3'
          }
        >
          {teams.map((team) => (
            <div
              key={team._id}
              className={
                viewMode === 'grid'
                  ? 'group bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/40 flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:shadow-lg'
                  : 'bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 flex items-center justify-between rounded-xl border p-4 transition-all'
              }
            >
              <div className="flex items-start justify-between">
                <Avatar className="border-background h-12 w-12 border-2 shadow-sm transition-transform group-hover:scale-110">
                  <AvatarImage src={team.avatar || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {team.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg leading-tight font-bold">{team.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 min-h-[32px] text-xs">
                  {team.description || 'Sin descripción'}
                </p>
              </div>

              <div className="bg-muted/40 mt-6 flex w-full items-center gap-3 rounded-xl border border-black/5 p-3">
                <Shield className="text-primary h-4 w-4 opacity-70" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold">{team.owner?.name}</p>
                  <p className="text-muted-foreground truncate text-[9px] font-semibold uppercase">
                    Team Leader
                  </p>
                </div>
              </div>

              <div className="mt-6 grid w-full grid-cols-2 gap-2 border-t pt-4">
                <div className="bg-muted/20 flex flex-col items-center rounded-lg p-2">
                  <span className="text-xs font-black">{team.memberCount}</span>
                  <span className="text-[8px] font-bold uppercase opacity-60">Miembros</span>
                </div>
                <div className="bg-muted/20 flex flex-col items-center rounded-lg p-2">
                  <span className="text-xs font-black">{team.projectCount}</span>
                  <span className="text-[8px] font-bold uppercase opacity-60">Proyectos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
