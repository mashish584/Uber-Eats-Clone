import React from "react";
import { Auth, DataStore } from "aws-amplify";
import { User } from "../models";
import { AuthContextInterface } from "./types";

const initalState: AuthContextInterface = {
  authUser: null,
  dbUser: null,
  queryUser: null,
  setDbUser: null,
};

const AuthContext = React.createContext(initalState);

const AuthContextProvider: React.FC = ({ children }) => {
  const [authUser, setAuthUser] = React.useState<string | null>(null);
  const [dbUser, setDbUser] = React.useState<User | null>(null);

  const queryUser = () => {
    DataStore.query(User, (user) => user.sub("eq", authUser || "")).then((users) =>
      setDbUser(users[0])
    );
  };

  const updateDbuser = (user: User) => {
    if (user) setDbUser(user);
  };

  React.useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then((user) => {
      setAuthUser(user?.attributes?.sub || null);
    });
  }, []);

  React.useEffect(() => {
    if (authUser) {
      queryUser();
    }
  }, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        dbUser,
        setDbUser: updateDbuser,
        queryUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => React.useContext(AuthContext);

export default AuthContextProvider;
