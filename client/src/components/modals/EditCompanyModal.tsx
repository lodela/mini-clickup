import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppButton } from "@/components/ui/app-button";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/utils/compressImage";

const formSchema = z.object({
  name: z.string().min(2, "Nombre comercial es requerido"),
  legalName: z.string().min(2, "Razón social es requerida"),
  rfc: z
    .string()
    .min(12, "RFC inválido")
    .max(13, "RFC inválido")
    .optional()
    .or(z.literal("")),
  fiscalAddress: z.string().min(5, "Dirección fiscal es requerida"),
  status: z.string().min(1, "Estado es requerido"),
});

type FormValues = z.infer<typeof formSchema>;

interface CompanyData {
  _id: string;
  name: string;
  legalName: string;
  rfc?: string;
  fiscalAddress?: string;
  logo: string | null;
  status: string;
  primaryContact?: {
    name: string;
    email: string;
  };
}

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: CompanyData;
}

export default function EditCompanyModal({
  isOpen,
  onClose,
  onSuccess,
  company,
}: EditCompanyModalProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoCompressing, setLogoCompressing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company.name || "",
      legalName: company.legalName || "",
      rfc: company.rfc || "",
      fiscalAddress: company.fiscalAddress || "",
      status: company.status || "Active",
    },
  });

  // Reset form when company data changes or modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: company.name || "",
        legalName: company.legalName || "",
        rfc: company.rfc || "",
        fiscalAddress: company.fiscalAddress || "",
        status: company.status || "Active",
      });
      setLogo(null);
      const timer = setTimeout(() => nameInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, company, form]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_BYTES = 2 * 1024 * 1024; // 2MB hard limit

    if (file.size > MAX_BYTES) {
      setLogoCompressing(true);
      try {
        const compressed = await compressImage(file, 1.8 * 1024 * 1024);
        setLogo(compressed);
        toast.info(
          `Logo comprimido de ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`
        );
      } finally {
        setLogoCompressing(false);
      }
    } else {
      setLogo(file);
    }
  };

  const onSubmit= async (values: FormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("legalName", values.legalName);
      if (values.rfc) formData.append("rfc", values.rfc);
      formData.append("fiscalAddress", values.fiscalAddress);
      formData.append("status", values.status);

      if (logo) {
        formData.append("logo", logo);
      }

      const response = await fetch(`/api/admin/companies/${company._id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Empresa actualizada exitosamente.");
        onSuccess();
        onClose();
        form.reset();
        setLogo(null);
      } else {
        // Map field-level errors from API → inline RHF errors
        type FieldKey = "name" | "legalName" | "rfc";
        const validFields: FieldKey[] = ["name", "legalName", "rfc"];
        if (Array.isArray(data.fieldErrors) && data.fieldErrors.length > 0) {
          data.fieldErrors.forEach(({ field, message }: { field: string; message: string }) => {
            if (validFields.includes(field as FieldKey)) {
              form.setError(field as FieldKey, { type: "server", message });
            }
          });
          toast.error(data.message || "Verifica los campos marcados");
        } else {
          toast.error(data.message || "Error al actualizar la empresa");
        }
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto glass-dialog"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={onClose}
      >
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-100/80 rounded-xl text-indigo-600 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Editar Empresa / Cliente
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Actualiza la información fiscal y el estado del cliente.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1: Nombre Comercial + Razón Social */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Nombre Comercial</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. ACME Corp"
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          (nameInputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                        }}
                        className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Razón Social</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. ACME S.A. de C.V."
                        {...field}
                        className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: RFC (opcional) + Logo */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rfc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      RFC{" "}
                      <span className="text-slate-400 font-normal">(Opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ABC123456XYZ"
                        {...field}
                        className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 uppercase placeholder:normal-case placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel className="text-slate-700 font-medium">
                  Logo{" "}
                  <span className="text-slate-400 font-normal">(Max 2MB — se comprime auto)</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="edit-logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={logoCompressing}
                      className="h-10 rounded-xl border-slate-200 bg-white/70 file:text-indigo-600 file:font-medium"
                    />
                    {logoCompressing && (
                      <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 text-xs text-indigo-600 pointer-events-none">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Comprimiendo…
                      </div>
                    )}
                    {company.logo && !logo && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Logo actual: {company.logo.split("/").pop() || "subido"}
                      </p>
                    )}
                    {logo && (
                      <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                        Nuevo logo: {logo.name}
                      </p>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            </div>

            {/* Row 3: Dirección Fiscal */}
            <FormField
              control={form.control}
              name="fiscalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Dirección Fiscal</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Calle, Número, Colonia, CP, Ciudad..."
                      {...field}
                      className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 4: Estado */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 focus:border-indigo-400">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Activo</SelectItem>
                      <SelectItem value="Inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <AppButton
                type="button"
                variant="cancel"
                onClick={onClose}
              >
                Cancelar
              </AppButton>
              <AppButton
                type="submit"
                variant="primary"
                loading={isLoading}
              >
                {isLoading ? "Guardando..." : "Actualizar Empresa"}
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
