import { NavLink } from "react-router";
import { Card } from "./ui/Card";

function AthleteCard({ id, firstName, lastName, location, avatar }) {
  const name = `${firstName} ${lastName}`;

  return (
    <div>
      <NavLink to={`/athlete/${id}`}>
        <Card className="overflow-hidden transition-all duration-300 group hover:shadow-lg border-border bg-card">
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
        </Card>
      </NavLink>
    </div>
  );
}

export default AthleteCard;
