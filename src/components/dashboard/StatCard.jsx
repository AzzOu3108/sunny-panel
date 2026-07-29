import Card from "../ui/Card";

export default function StatCard({ label, value, icon }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
        <img src={icon} alt="" className="h-5 w-5" />
      </span>
    </Card>
  );
}
