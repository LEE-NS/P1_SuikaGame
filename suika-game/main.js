import { Engine, Render, Runner, Bodies, World, Body, Events } from "matter-js";
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 425, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const rightWall = Bodies.rectangle(605, 425, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const ground = Bodies.rectangle(310, 835, 620, 30, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const topLine = Bodies.rectangle(310, 130, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" },
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let numSuika = 0;

function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.3,
  })

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
};

window.onkeydown = (event) => {
  if (disableAction) {
    return
  }

  switch(event.code) {
    case "ArrowLeft":
      if(currentBody.position.x - currentFruit.radius > 30)
      Body.setPosition(currentBody, {
        x: currentBody.position.x - 10,
        y: currentBody.position.y,
      });
      break;

    case "ArrowRight":
      if(currentBody.position.x - currentFruit.radius < 540)
      Body.setPosition(currentBody, {
        x: currentBody.position.x + 10,
        y: currentBody.position.y,
      });
      break;

    case "Space":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000)
      break;
  }
}

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if(index === FRUITS.length - 1) {
        return
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: { 
            sprite: { texture: `${newFruit.name}.png` }  
          },
          index: index + 1,
        }
      );
      
      setTimeout(() => {
        World.add(world, newBody)
      }, 100)

      if(newFruit === FRUITS[10]) {
        numSuika++;
        console.log(numSuika)
      }

      if(numSuika === 2) {
        setTimeout(() => {
          alert("YOU WIN", "")
          location.reload();
          return
        }, 1000)
        
      }

      
    }

    if(!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
      alert("GAME OVER")
      location.reload();
    }
  })
})

addFruit();

