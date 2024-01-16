import { useEffect, useState } from "react";
import { withRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

function CustomAlert({ router }) {
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("");
  const [message, setMessage] = useState("");

  const alert = useSelector((state) => state.user.alert);

  useEffect(() => {
    setShow(alert.show);
    setVariant(alert.variant);
    setMessage(alert.message);

    if (router.query.success == "true" && alert.message) {
      setShow(true);
    }
  }, [alert]);

  return (
    show && (
      <div className={`alert alert-${variant}`} role="alert">
        {message}
      </div>
    )
  );
}

export default withRouter(CustomAlert);
