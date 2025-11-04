import { useState } from "react";
import { supabase } from "./supabaseClient.js";
import { NavLink } from "react-router";
import { Label } from "./ui/Label.jsx";
import { Input } from "./ui/Input.jsx";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");

    try {
      const { _data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: "http://localhost:5173",
        },
      });
      if (error) {
        throw error;
      }
      setEmail("");
      setSuccess("Email envoyé avec succès");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-background">
      <div className="w-full max-w-md">
        <NavLink to="/" className="flex gap-2 justify-center items-center mb-8">
          <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent">
            <span className="text-3xl font-bold text-primary-foreground">
              S
            </span>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
            SupaTri
          </h1>
        </NavLink>

        <Card className="p-6 border-border bg-card">
          <form onSubmit={(e) => handleAuth(e)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="president@supatri.com"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-primary to-accent"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Envoyer le lien"}
            </Button>
            {success && <p className="text-green-500">{success}</p>}
          </form>
        </Card>
      </div>
    </div>
  );
}
