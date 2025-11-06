import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { ArrowLeft, Edit, MapPin, Calendar } from "lucide-react";
import { supabase } from "./supabaseClient.js";
import Header from "./Header.jsx";

export default function AthletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState(null);

  useEffect(() => {
    getAthlete();
  }, [id, navigate]);

  async function getAthlete() {
    try {
      const { data } = await supabase
        .from("athletes")
        .select()
        .eq("id", id)
        .single();
      if (data) {
        setAthlete(data);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Chargement...</div>;

  if (!athlete) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour
          </Button>
          <Card className="p-8 mb-8 border-border bg-card">
            <div className="flex flex-col gap-8 items-start md:flex-row">
              <div className="relative">
                <img
                  src={athlete.avatar}
                  alt={athlete.first_name + " " + athlete.last_name}
                  className="object-cover w-32 h-32 rounded-2xl ring-4 ring-primary/20"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-foreground">
                      {athlete.first_name} {athlete.last_name}
                    </h1>
                    <div className="flex gap-4 items-center text-muted-foreground">
                      <div className="flex gap-1 items-center">
                        <MapPin className="w-4 h-4" />
                        <span>{athlete.location}</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {athlete.birthdate
                            ? new Date().getFullYear() -
                              new Date(athlete.birthdate).getFullYear()
                            : ""}{" "}
                          ans
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-linear-to-r from-primary to-accent"
                    onClick={() => navigate(`/athlete/${id}/edit`)}
                  >
                    <Edit className="mr-2 w-4 h-4" />
                    Éditer
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
