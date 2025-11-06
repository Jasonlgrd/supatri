import { NavLink } from "react-router";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { HardDriveDownload, Loader2 } from "lucide-react";
import { supabase } from "./supabaseClient.js";
import { useState } from "react";
import { useToast } from "./hooks/use-toast.js";

function AthleteCard({ id, firstName, lastName, location, avatar }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const name = `${firstName} ${lastName}`;

  async function syncAthlete(e, id) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("sync-athlete", {
        body: { id },
      });
      if (error) {
        throw error;
      }
      toast({
        title: "Athlète synchronisé",
        description: data.message,
      });
    } catch (error) {
      toast({
        title: "Synchronisation échouée",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <NavLink to={`/athlete/${id}`}>
        <Card className="flex overflow-hidden justify-between transition-all duration-300 group hover:shadow-lg border-border bg-card">
          <div className="flex gap-6 items-center p-6">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="object-cover w-24 h-24 rounded-xl ring-2 transition-transform duration-300 ring-primary/20 group-hover:scale-105"
                />
              ) : (
                <div className="flex justify-center items-center w-24 h-24 rounded-xl bg-muted">
                  <img
                    src="/src/assets/default-avatar.png"
                    alt="Default avatar"
                    className="object-cover w-12 h-12 rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="mb-1 text-2xl font-bold text-foreground">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>

          <div className="flex items-center p-6">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => syncAthlete(e, id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <HardDriveDownload className="mr-2 w-4 h-4" />
              )}
              Synchroniser
            </Button>
          </div>
        </Card>
      </NavLink>
    </div>
  );
}

export default AthleteCard;
