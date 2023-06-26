import * as PIXI from "pixi.js";
import img from "../assets/sprites/bunny.png";
import tiles from "../assets/maps/grass.png";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export class GameApp {
  public app: PIXI.Application<HTMLCanvasElement>;
  public player: PIXI.Sprite;
  public rows: number = 15;
  public cols: number = 13;
  public speed: number;
  private onlinePlayers: Map<string, PIXI.Sprite>;
  private keys: { [key: string]: boolean };
  private ticker: PIXI.Ticker;
  private connection: HubConnection;
  public roomId: string = "";

  constructor(hub: HubConnection) {
    this.app = new PIXI.Application<HTMLCanvasElement>({
      antialias: true,
      autoDensity: true,
      autoStart: false,
      backgroundColor: 0xffffff,
      resolution: devicePixelRatio,
      width: 960, //15 rows
      height: 832, // 13 cols
    });
    this.onlinePlayers = new Map<string, PIXI.Sprite>();
    const tileContainer = new PIXI.Container();
    const playerContainer = new PIXI.Container();

    this.speed = 5;
    this.player = PIXI.Sprite.from(img);

    this.keys = {};
    this.ticker = PIXI.Ticker.shared;
    this.ticker.add(this.update, this);
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
    const texture = PIXI.Texture.from(tiles);
    const frame = new PIXI.Rectangle(0, 0, 64, 64);
    const textureRegion = new PIXI.Texture(texture.baseTexture, frame);

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 13; j++) {
        const sprite = new PIXI.TilingSprite(textureRegion);
        sprite.position.x = i * 64;
        sprite.position.y = j * 64;
        tileContainer.addChild(sprite);
      }
    }

    playerContainer.addChild(this.player);
    this.app.stage.addChild(tileContainer);
    this.app.stage.addChild(playerContainer);
    this.connection = hub;
    this.app.start();
  }
  private update(delta: number) {
    const playerSpeed = this.speed * delta;

    if (this.keys["w"]) {
      this.player.y -= playerSpeed;
    } else if (this.keys["s"]) {
      this.player.y += playerSpeed;
    }

    if (this.keys["a"]) {
      this.player.x -= playerSpeed;
    } else if (this.keys["d"]) {
      this.player.x += playerSpeed;
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      this.keys[key] = true;
      this.SendInputs(key);
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      this.keys[key] = false;
    }
  }

  public AddPlayer(user: string, img: string) {
    let sprite = PIXI.Sprite.from(img);
    this.app.stage.addChild(sprite);
    this.onlinePlayers.set(user, sprite);
  }

  public destroy() {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    window.removeEventListener("keyup", this.handleKeyUp.bind(this));

    this.ticker.remove(this.update, this);

    this.app.destroy();
  }

  private SendInputs(input: string) {
    this.connection.send("SendInput", this.roomId, input);
  }
}
