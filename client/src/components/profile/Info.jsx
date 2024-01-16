import { updateUser } from "@/utils/api.js";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, setCurrentUser } from "@/app/features/user-slice";

export default function Info() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleFormPhoneNumber = (e) => {
    const phoneNumber = e.target.value.replace(/[^\d]/g, "").slice(0, 15);
    dispatch(setCurrentUser({ ...currentUser, phone_number: phoneNumber }));
  };

  async function handleUpdateProfile(e) {
    e.preventDefault();
    try {
      await updateUser(currentUser);
      dispatch(getCurrentUser());
      alert("Your profile updated successfuly");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={(e) => handleUpdateProfile(e)}>
      <div className="row">
        <div className="col-6 mb-2">
          <label className="form-label">First Name</label>
          <input type="text" className="form-control" placeholder="Enter your first name" value={currentUser?.first_name} onChange={(e) => dispatch(setCurrentUser({ ...currentUser, first_name: e.target.value }))} />
        </div>
        <div className="col-6 mb-2">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-control" placeholder="Enter your last name" value={currentUser?.last_name} onChange={(e) => dispatch(setCurrentUser({ ...currentUser, last_name: e.target.value }))} />
        </div>
        <div className="form-text mt-0">Your first name & last name may appear around navbar, relogin to take effect</div>
      </div>
      <div className="my-2">
        <label className="form-label">Email</label>
        <input type="text" disabled readOnly className="form-control" value={currentUser?.email} />
      </div>
      <div className="mb-2">
        <label className="form-label">Phone Number</label>
        <input type="text" className="form-control" placeholder="Enter your phone number" value={currentUser?.phone_number} onChange={(e) => handleFormPhoneNumber(e)} />
      </div>
      <div className="mb-2">
        <label className="form-label">Address</label>
        <input type="text" className="form-control" placeholder="Enter your address" value={currentUser?.address} onChange={(e) => dispatch(setCurrentUser({ ...currentUser, address: e.target.value }))} />
        <div className="form-text">The address is used for the checkout process to the destination</div>
      </div>
      <div className="mt-3">
        <button type="submit" className="btn btn-primary">
          Update Changes
        </button>
      </div>
    </form>
  );
}
