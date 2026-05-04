import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { AppButton } from "@/components/ui/app-button";
import { Building2, Mail, Send, Loader2 } from "lucide-react";
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
  adminFirstName: z.string().min(2, "Nombre es requerido"),
  adminLastName: z.string().min(2, "Apellido es requerido"),
  adminEmail: z.string().email("Email inválido"),
  adminCellPhone: z
    .string()
    .min(10, "Teléfono celular inválido")
    .regex(/^(\+52)?[\s.-]?\(?[0-9]{2,3}\)?[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{4}$/, "Formato inválido (+52...)"),
  adminOfficePhone: z.string().optional().or(z.literal("")),
  adminExtension: z.string().max(6, "Máximo 6 caracteres").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCompanyModal({ isOpen, onClose, onSuccess }: CreateCompanyModalProps) {
  const { i18n } = useTranslation();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoCompressing, setLogoCompressing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendInvitation, setSendInvitation] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      legalName: "",
      rfc: "",
      fiscalAddress: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      adminCellPhone: "",
      adminOfficePhone: "",
      adminExtension: "",
    },
  });

  // Auto-focus on Nombre Comercial when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("legalName", values.legalName);
      if (values.rfc) formData.append("rfc", values.rfc);
      formData.append("fiscalAddress", values.fiscalAddress);

      // Compatibilidad backend: name como string completo + campos individuales
      formData.append(
        "primaryContactData",
        JSON.stringify({
          name: `${values.adminFirstName} ${values.adminLastName}`,
          firstName: values.adminFirstName,
          lastName: values.adminLastName,
          email: values.adminEmail,
          cellPhone: values.adminCellPhone,
          officePhone: values.adminOfficePhone ?? "",
          extension: values.adminExtension ?? "",
        })
      );
      formData.append("sendInvitation", String(sendInvitation));
      formData.append("locale", i18n.language);

      if (logo) formData.append("logo", logo);

      const response = await fetch("/api/admin/companies", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          sendInvitation
            ? "Empresa creada. Invitación enviada al administrador."
            : "Empresa creada exitosamente."
        );
        onSuccess();
        onClose();
        form.reset();
        setLogo(null);
        setSendInvitation(true);
      } else {
        // Map field-level errors from API → inline RHF errors
        type FieldKey = "name" | "legalName" | "rfc" | "adminEmail" | "adminCellPhone";
        const validFields: FieldKey[] = ["name", "legalName", "rfc", "adminEmail", "adminCellPhone"];
        if (Array.isArray(data.fieldErrors) && data.fieldErrors.length > 0) {
          data.fieldErrors.forEach(({ field, message }: { field: string; message: string }) => {
            if (validFields.includes(field as FieldKey)) {
              form.setError(field as FieldKey, { type: "server", message });
            }
          });
          toast.error(data.message || "Verifica los campos marcados");
        } else {
          toast.error(data.message || "Error al crear la empresa");
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
                Nueva Empresa / Cliente
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Información fiscal y administrador inicial del cliente.
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

            {/* Administrador Inicial (Cliente_A) */}
            <div className="rounded-xl bg-slate-50/70 border border-slate-100 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  Administrador Inicial{" "}
                  <span className="text-slate-400 font-normal">(Cliente_A)</span>
                </h3>
              </div>

              {/* Admin Row 1: Nombre + Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="adminFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan"
                          {...field}
                          className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adminLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Apellido</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pérez"
                          {...field}
                          className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Admin Row 2: Email Corporativo (full width) */}
              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email Corporativo</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@empresa.com"
                        {...field}
                        className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Admin Row 3: Celular + Teléfono Empresa + Ext. */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <FormField
                    control={form.control}
                    name="adminCellPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Teléfono Celular</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+52 55 1234 5678"
                            {...field}
                            className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-5">
                  <FormField
                    control={form.control}
                    name="adminOfficePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Teléfono Empresa{" "}
                          <span className="text-slate-400 font-normal">(Opcional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="55 8765 4321"
                            {...field}
                            className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="adminExtension"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Ext.</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="101"
                            maxLength={6}
                            {...field}
                            className="h-10 rounded-xl border-slate-200 bg-white/70 focus:ring-indigo-400 placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Invitation Checkbox */}
            <div className="flex items-start gap-3 rounded-xl bg-indigo-50/60 border border-indigo-100 px-4 py-3">
              <Checkbox
                id="sendInvitation"
                checked={sendInvitation}
                onCheckedChange={(checked) => setSendInvitation(!!checked)}
                className="mt-0.5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
              />
              <div>
                <Label
                  htmlFor="sendInvitation"
                  className="text-sm font-semibold text-slate-700 cursor-pointer leading-tight flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-500" />
                  Enviar invitación por correo
                </Label>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Se enviará un email con credenciales temporales y link de acceso al administrador.
                </p>
              </div>
            </div>

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
                {isLoading ? "Creando..." : "Guardar Empresa"}
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
