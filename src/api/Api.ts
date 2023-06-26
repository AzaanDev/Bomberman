import client from "./Client";

const SignUp = async (payload: string): Promise<any> => {
  try {
    const r = await client.post("/api/Signup/", payload);
    return r.data;
  } catch (e) {
    console.log(e);
  }
};

const Login = async (payload: string) => {
  try {
    const r = await client.post("/api/Login/", payload);
    return r.data;
  } catch (e) {
    console.log(e);
  }
};

export { SignUp, Login };
