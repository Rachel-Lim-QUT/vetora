
const DICT = {
  REQUESTED:  { title: "Requested",   quote: "Your request is queued." },
  CONFIRMED:  { title: "Confirmed",   quote: "Your appointment is reserved." },
  IN_PROGRESS:{ title: "In progress", quote: "We are working on it." },
  COMPLETED:  { title: "Completed",   quote: "All done. Thanks!" },
  CANCELLED:  { title: "Cancelled",   quote: "This appointment was cancelled." },
};

export default function AppointmentStatus({ status, className = "" }) {
  const d = DICT[status] || { title: "Unknown", quote: "Status not recognized." };

  return (
    <div className={className}>
      <div style={{ fontWeight: 700 }}>{d.title}</div>
      <blockquote style={{ margin: 0, fontStyle: "italic" }}>“{d.quote}”</blockquote>
    </div>
  );
}
