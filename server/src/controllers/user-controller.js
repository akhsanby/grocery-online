import userService from "../services/user-service.js";

async function register(req, res, next) {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    const email = req.user.email;
    const result = await userService.get(email);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const email = req.user.email;
    const request = req.body;
    request.email = email;

    const result = await userService.update(request);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await userService.logout(req.user.email);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  get,
  update,
  logout,
};
