"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/queries/services";
import type { Service } from "@/services/services";

type ServiceFormData = {
  name: string;
  description: string;
  price: string;
  duration_minutes: string;
};

const EMPTY_FORM: ServiceFormData = {
  name: "",
  description: "",
  price: "",
  duration_minutes: "",
};

function serviceToForm(s: Service): ServiceFormData {
  return {
    name: s.name,
    description: s.description,
    price: String(s.price),
    duration_minutes: String(s.duration_minutes),
  };
}

function formToData(f: ServiceFormData) {
  return {
    name: f.name.trim(),
    description: f.description.trim(),
    price: parseFloat(f.price),
    duration_minutes: parseInt(f.duration_minutes, 10),
  };
}

export default function AdminServicesPage() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceFormData>(EMPTY_FORM);

  function openCreate() {
    setForm(EMPTY_FORM);
    setCreateOpen(true);
  }

  function openEdit(service: Service) {
    setForm(serviceToForm(service));
    setEditTarget(service);
  }

  function handleCreate() {
    createService.mutate(formToData(form), {
      onSuccess: () => setCreateOpen(false),
    });
  }

  function handleUpdate() {
    if (!editTarget) return;
    updateService.mutate(
      { id: editTarget.id, data: formToData(form) },
      { onSuccess: () => setEditTarget(null) },
    );
  }

  const isFormValid = form.name.trim() && form.price && form.duration_minutes;

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Услуги
          </h1>
          <p className="text-muted-foreground">Управление списком услуг.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Новая услуга</DialogTitle>
              <DialogDescription>
                Заполните данные для новой услуги
              </DialogDescription>
            </DialogHeader>
            <ServiceForm form={form} onChange={setForm} />
            <DialogFooter>
              <Button
                disabled={!isFormValid || createService.isPending}
                onClick={handleCreate}
              >
                {createService.isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="min-w-30">Название</TableHead>
              <TableHead className="min-w-40">Описание</TableHead>
              <TableHead className="min-w-25">Цена</TableHead>
              <TableHead className="min-w-25">Длит. (мин)</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Загрузка...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Услуги не найдены
                </TableCell>
              </TableRow>
            )}
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {service.description || "—"}
                </TableCell>
                <TableCell>{service.price} €</TableCell>
                <TableCell>{service.duration_minutes}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => openEdit(service)}
                      >
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive"
                        onClick={() => deleteService.mutate(service.id)}
                      >
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать услугу</DialogTitle>
            <DialogDescription>Измените данные услуги</DialogDescription>
          </DialogHeader>
          <ServiceForm form={form} onChange={setForm} />
          <DialogFooter>
            <Button
              disabled={!isFormValid || updateService.isPending}
              onClick={handleUpdate}
            >
              {updateService.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceForm({
  form,
  onChange,
}: {
  form: ServiceFormData;
  onChange: (f: ServiceFormData) => void;
}) {
  function set(key: keyof ServiceFormData, value: string) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="svc-name">Название</Label>
        <Input
          id="svc-name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Стрижка"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="svc-desc">Описание</Label>
        <Input
          id="svc-desc"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Краткое описание услуги"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="svc-price">Цена (€)</Label>
          <Input
            id="svc-price"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="1500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="svc-duration">Длительность (мин)</Label>
          <Input
            id="svc-duration"
            type="number"
            min={1}
            value={form.duration_minutes}
            onChange={(e) => set("duration_minutes", e.target.value)}
            placeholder="60"
          />
        </div>
      </div>
    </div>
  );
}
