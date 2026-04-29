import { useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Building2, Mail, Send } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Nombre comercial es requerido"),
  legalName: z.string().min(2, "Razón social es requerida"),
  rfc: z.string().min(12, "RFC inválido").max(13, "RFC inválido"),
  fiscalAddress: z.string().min(5, "Dirección fiscal es requerida"),
  adminName: z.string().min(2, "Nombre del administrador es requerido"),
  adminEmail: z.string().email("Email inválido"),
});

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCompanyModal({ isOpen, onClose, onSuccess }: CreateCompanyModalProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sendInvitation, setSendInvitation] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      legalName: "",
      rfc: "",
      fiscalAddress: "",
      adminName: "",
      adminEmail: "",
    },
  });

  // Auto-focus on Nombre Comercial when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("legalName", values.legalName);
      formData.append("rfc", values.rfc);
      formData.append("fiscalAddress", values.fiscalAddress);
      formData.append("primaryContactData", JSON.stringify({
        name: values.adminName,
        email: values.adminEmail,
      }));
      formData.append("sendInvitation", String(sendInvitation));

      if (logo) formData.append("logo", logo);

      const response = await fetch("/api/admin/companies", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(sendInvitation
          ? "Empresa creada. Invitación enviada al administrador."
          : "Empresa creada exitosamente."
        );
        onSuccess();
        onClose();
        form.reset();
        setSendInvitation(true);
      } else {
        toast.error(data.message || "Error al crear la empresa");
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
        className="sm:max-w-[620px] bg-white/85 backdrop-blur-xl border border-white/30 ring-1 ring-white/20 shadow-2xl shadow-slate-900/20 rounded-2xl"
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rfc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">RFC</FormLabel>
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
                <FormLabel className="text-slate-700 font-medium">Logo <span className="text-slate-400 font-normal">(Max 2MB)</span></FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    className="h-10 rounded-xl border-slate-200 bg-white/70 file:text-indigo-600 file:font-medium"
                  />
                </FormControl>
              </FormItem>
            </div>

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

            {/* Administrador Inicial */}
            <div className="rounded-xl bg-slate-50/70 border border-slate-100 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">Administrador Inicial <span className="text-slate-400 font-normal">(Cliente_A)</span></h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Nombre Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Juan Pérez"
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
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Email Corporativo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@empresa.com"
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
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl h-10 px-5"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-200 transition-all"
              >
                {isLoading ? "Creando..." : "Guardar Empresa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
