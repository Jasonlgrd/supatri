import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { Button } from "./ui/Button";
import { LogOut } from "lucide-react";
import AthleteCard from "./AthleteCard";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

function Athletes() {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    getAthletes();
  }, []);

  async function getAthletes() {
    const { data } = await supabase.from("athletes").select();
    setAthletes(data);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b backdrop-blur-sm border-border bg-card/50">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="flex gap-2 items-center">
              <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent">
                <span className="text-2xl font-bold text-primary-foreground">
                  S
                </span>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                SupaTri
              </h1>
            </NavLink>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 w-4 h-4" />
              Connexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-12 mx-auto">
        <div className="mb-8">
          <h2 className="mb-2 text-4xl font-bold text-foreground">
            Liste des athlètes
          </h2>
        </div>

        <div className="space-y-4">
          {athletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              id={athlete.id}
              firstName={athlete.first_name}
              lastName={athlete.last_name}
              location={athlete.location}
              avatar={athlete.avatar}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Athletes;
