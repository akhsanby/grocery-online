const isAuthorized = async (token = "qweqewqee") => {
  if (!token) {
    return false;
  }

  const response = await fetch("http://localhost:8000/api/users/current", {
    method: "get",
    headers: { Authorization: token },
  });
  const result = await response.json();

  if (result.errors === "Unauthorized") {
    return false;
  } else if (result.data) {
    return true;
  }
};

export default isAuthorized;
