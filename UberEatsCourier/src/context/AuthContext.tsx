import React from "react";
import { Auth, DataStore } from "aws-amplify";
import { AuthContextInterface } from "./types";
import { Courier } from "../models";

const initalState: AuthContextInterface = {
  authUser: null,
  dbUser: null,
  queryUser: null,
  setDbCourier: null,
};

const AuthContext = React.createContext(initalState);

const AuthContextProvider: React.FC = ({ children }) => {
  const [authUser, setAuthUser] = React.useState<string | null>(null);
  const [dbCourier, setDbCourier] = React.useState<Courier | null>(null);

  const queryUser = () => {
    DataStore.query(Courier, (courier) => courier.sub("eq", authUser || "")).then((users) =>
      setDbCourier(users[0])
    );
  };

  const updateDbCourier = (user: Courier) => {
    if (user) setDbCourier(user);
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

  React.useEffect(() => {
    let subscription;
    if (dbCourier?.id) {
      subscription = DataStore.observe(Courier, dbCourier.id).subscribe((msg) => {
        if (msg.opType === "UPDATE") {
          setDbCourier(msg.element);
        }
      });
    }

    return () => subscription?.ubsubscribe();
  }, [dbCourier?.id]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        dbCourier,
        setDbCourier: updateDbCourier,
        queryUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => React.useContext(AuthContext);

export default AuthContextProvider;
