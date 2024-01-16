import { useState } from "react";
import { updateUserPassword } from "@/utils/api.js";
import { useSelector } from "react-redux";

export default function AccountSettings() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [tempPassword, setTempPassword] = useState({
    new: "",
    confirm: "",
  });

  async function handleChangePassword(e) {
    e.preventDefault();
    try {
      if (tempPassword.new !== tempPassword.confirm) {
        alert("Confirm password didn't match");
        return;
      }

      await updateUserPassword({
        email: currentUser.email,
        password: tempPassword.new,
      });
      alert("Password updated");
      setTempPassword({
        new: "",
        confirm: "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form className="mb-2" onSubmit={(e) => handleChangePassword(e)}>
        <label className="form-label">Change Password</label>
        <div className="d-flex flex-column gap-1">
          <input type="password" value={tempPassword.new} onChange={(e) => setTempPassword({ ...tempPassword, new: e.target.value })} className="form-control" placeholder="New password" />
          <input type="password" value={tempPassword.confirm} onChange={(e) => setTempPassword({ ...tempPassword, confirm: e.target.value })} className="form-control" placeholder="Confirm password" />
        </div>
        <button type="submit" className="btn btn-danger mt-2">
          Change password
        </button>
      </form>
      <div className="mt-3">
        <p className="mb-2">Once you delete your account, there is no going back. Please be certain.</p>
        <button type="button" className="btn btn-danger mt-0">
          Delete account
        </button>
      </div>
    </>
  );
}
