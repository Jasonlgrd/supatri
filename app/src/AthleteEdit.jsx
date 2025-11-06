import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";
import { Input } from "./ui/Input.jsx";
import { Label } from "./ui/Label.jsx";
import { useToast } from "./hooks/use-toast.js";
import { supabase } from "./supabaseClient.js";
import { z } from "zod";
import { Avatar, AvatarImage } from "./ui/Avatar.jsx";
import Header from "./Header.jsx";
import { Upload } from "lucide-react";

const SUPABASE_STORAGE_URL = import.meta.env.VITE_SUPABASE_STORAGE_URL;

const athleteSchema = z.object({
  first_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthdate: z.string().refine(
    (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    {
      message: "Date invalide",
    }
  ),
  location: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
});

export default function AthleteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [athlete, setAthlete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birthdate: "",
    location: "",
  });

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
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          birthdate: data.birthdate,
          location: data.location,
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile({
        file,
        extension: file.name.split(".").at(-1),
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate the form data
      athleteSchema.parse(formData);

      if (photoFile) {
        // Upload the avatar file to the supabase storage
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`${id}.${photoFile.extension}`, photoFile.file, {
            upsert: true,
          });
        if (error) {
          throw error;
        }
        // Build the avatar URL
        const avatarUrl = `${SUPABASE_STORAGE_URL}/${data.fullPath}`;
        // Add the avatar URL to the form data
        Object.assign(formData, { avatar: avatarUrl });
      }

      // Update the athlete in the database
      await supabase.from("athletes").update(formData).eq("id", id);

      toast({
        title: "Athlète mis à jour",
        description: "Vos modifications ont été enregistrées avec succès.",
      });

      navigate(`/athlete/${id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error(error);
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la mise à jour de l'athlète.",
        });
        navigate(`/athlete/${id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!athlete) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Éditer</h1>

          <Card className="p-8 border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 items-center mb-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={
                      photoPreview ||
                      athlete.avatar ||
                      "/src/assets/default-avatar.png"
                    }
                    alt={formData.first_name + " " + formData.last_name}
                  />
                </Avatar>
                <div>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Label htmlFor="photo" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="mr-2 w-4 h-4" />
                        Changer la photo
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className="mt-2"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className="mt-2"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="birthdate">Date de naissance</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    handleChange("birthdate", parseInt(e.target.value) || 0)
                  }
                  className="mt-2"
                />
                {errors.birthdate && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.birthdate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Ville</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="mt-2"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-primary to-accent"
                  disabled={isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/athlete/${id}`)}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
