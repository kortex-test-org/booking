import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// We need lucide-react, which is installed by shadcn by default
import { Clock, Banknote } from "lucide-react";

export interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  hasAvailableSlots?: boolean;
}

export function ServiceCard({ id, name, description, price, duration_minutes, hasAvailableSlots = true }: ServiceCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-muted/50 dark:bg-card/50 backdrop-blur-sm flex flex-col justify-between p-0 gap-0">
      <div>

        <CardHeader className="pt-5 pb-4">
          <CardTitle className="text-xl leading-tight">{name}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-5">
          <div className="flex gap-4 text-sm font-medium text-muted-foreground/80">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/40 rounded-md">
              <Clock className="w-4 h-4" />
              <span>{duration_minutes} мин</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/40 rounded-md">
              <Banknote className="w-4 h-4" />
              <span className="text-foreground">{price} €</span>
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-5">
        {hasAvailableSlots ? (
          <Link href={`/booking/${id}`} className="w-full relative overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            <Button className="w-full shadow-sm transition-all relative">Забронировать</Button>
          </Link>
        ) : (
          <Button variant="secondary" disabled className="w-full">
            Не доступно
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
