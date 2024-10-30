const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
// Lane 0 1 2 3 ... (getLaneCenter)
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");

const mutations = 0.08; // <- Var
const N = 1500; // <- Var
const cars = generateCars(N);

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 2),
  //
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2),
  //
  new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1600, 30, 50, "DUMMY", 2),
  //
  new Car(road.getLaneCenter(1), -1700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -2100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2200, 30, 50, "DUMMY", 2),
  //
  new Car(road.getLaneCenter(1), -2300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -2400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -2400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -2500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -2600, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -2700, 30, 50, "DUMMY", 2),
];

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i !== 0) NeuralNetwork.mutate(cars[i].brain, mutations);
  }
}

animate();

function generateCars(N) {
  const cars = [];

  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // fitness function
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;

  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
