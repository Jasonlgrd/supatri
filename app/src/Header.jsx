import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "./contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
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
          {!user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 w-4 h-4" />
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
