import { GameApp } from "./GameApp";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { selectToken } from "../store/reducers/AuthSlice";
const Game = () => {
  const [connection, setConnection] = useState<HubConnection>();
  const auth = useSelector(selectToken);
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5062/gameHub", {
        accessTokenFactory: () => (auth ? auth : ""),
      })
      .withAutomaticReconnect()
      .build();
    setConnection(connection);
    connection
      .start()
      .then(() => {
        console.log("Connected!");

        connection.on("ReceiveMessage", (message) => {
          console.log(message);
        });
      })
      .catch((e) => console.log("Connection failed: ", e));
    const _game = new GameApp(connection);
    const targetDiv = document.getElementById("main");
    if (targetDiv) {
      targetDiv.appendChild(_game.app.view);
    }
    return () => {
      if (_game) {
        const targetDiv = document.getElementById("main");
        if (targetDiv) {
          targetDiv.removeChild(_game.app.view);
        }
        _game.destroy();
      }
      if (connection) {
        connection.off("ReceiveMessage");
        connection.stop();
      }
    };
  }, [auth]);

  const JoinQueue = async () => {
    console.log("Message Sent");
    try {
      await connection?.send("JoinQueue");
    } catch (e) {
      console.log(e);
    }
  };

  return <div className="game" id="main"></div>;
  //return <div onClick={sendMessage}>Hello Button</div>;
};

export default Game;
