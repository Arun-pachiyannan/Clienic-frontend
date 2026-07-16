import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

const statusColor = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    api.get("/appointments").then((res) => setAppointments(res.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (appt, status) => {
    setUpdatingId(appt._id);
    try {
      const { data } = await api.put(`/appointments/${appt._id}/status`, { status });
      setAppointments((prev) => prev.map((a) => (a._id === appt._id ? data : a)));
      showToast(`Appointment ${status.toLowerCase()}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update appointment", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading appointments" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-ink/50 text-sm">No appointment requests yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{appt.patientName}</p>
                <p className="text-sm text-ink/50">{appt.phone}</p>
                <p className="text-sm text-ink/60 mt-1">
                  {appt.preferredDate} at {appt.preferredTime}
                </p>
                {appt.message && <p className="text-xs text-ink/40 mt-1 max-w-md">"{appt.message}"</p>}
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[appt.status]}`}>
                  {appt.status}
                </span>
                {appt.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="accent"
                      loading={updatingId === appt._id}
                      onClick={() => updateStatus(appt, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={updatingId === appt._id}
                      onClick={() => updateStatus(appt, "Cancelled")}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
