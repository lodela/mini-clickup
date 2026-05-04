import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Users, ArrowLeft, Building2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

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
      toast.error('Error al cargar los departamentos');
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/companies')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Departamentos</h1>
            <p className="text-muted-foreground text-sm">
              Empresa:{' '}
              <span className="text-foreground font-bold">{companyName || 'Cargando...'}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => console.log('Crear departamento')}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Departamento
        </Button>
      </div>

      {/* Filters & View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Total: {departments.length}
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
      {departments.length === 0 && !isLoading ? (
        <div className="border-muted bg-muted/5 flex h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center">
          <Building2 className="text-muted-foreground/40 mb-4 h-12 w-12" />
          <h2 className="text-xl font-semibold italic">
            Esta empresa no tiene departamentos registrados.
          </h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm">
            Los departamentos son necesarios para agrupar equipos de trabajo.
          </p>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => console.log('Crear departamento')}
          >
            Crear Primer Departamento
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
          {departments.map((dept) => (
            <Link
              to={`/admin/companies/${companyId}/departments/${dept._id}/teams`}
              key={dept._id}
              className={
                viewMode === 'grid'
                  ? 'group bg-card hover:border-primary/40 flex cursor-pointer flex-col rounded-2xl border p-6 shadow-sm transition-all hover:shadow-lg'
                  : 'bg-card hover:bg-muted/30 flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all'
              }
            >
              <div className="flex items-start justify-between">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <Building2 className="h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg leading-tight font-bold">{dept.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 min-h-[32px] text-xs">
                  {dept.description || 'Sin descripción'}
                </p>
              </div>

              <div className="bg-muted/40 mt-6 flex w-full items-center gap-3 rounded-xl p-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={dept.manager?.avatar || ''} />
                  <AvatarFallback className="text-[10px] font-bold">
                    {dept.manager?.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold">{dept.manager?.name}</p>
                  <p className="text-muted-foreground truncate text-[9px] font-semibold uppercase">
                    Manager
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold">4 Equipos</span>
                </div>
                <Badge
                  variant={dept.status === 'Active' ? 'default' : 'secondary'}
                  className="h-4 px-1.5 text-[8px] font-black uppercase"
                >
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
