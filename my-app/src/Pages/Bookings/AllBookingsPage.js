import BookingComponent from "../../components/Bookings/BookingComponent";
import SideBar from "../../Utilities/SideBar";

export default function AllBookingsPage() {
  return (
    <div className="parent">
      <SideBar />
      <div className="p-4 w-100 dashboard">
      <BookingComponent />
      </div>
    </div>
  )
}
